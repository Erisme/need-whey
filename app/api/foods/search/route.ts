import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface OFFProduct {
  product_name?: string
  serving_quantity?: number | string
  labels_tags?: string[]
  categories_tags?: string[]
  nutriments?: {
    'energy-kcal_100g'?: number
    proteins_100g?: number
    carbohydrates_100g?: number
    fat_100g?: number
  }
}

function offToFood(p: OFFProduct, index: number) {
  const n = p.nutriments ?? {}
  const kcal = n['energy-kcal_100g'] ?? 0
  const prot = n.proteins_100g ?? 0
  const gluc = n.carbohydrates_100g ?? 0
  const lip = n.fat_100g ?? 0
  const serving = p.serving_quantity ? Number(p.serving_quantity) : null
  const labels = p.labels_tags ?? []
  const categories = p.categories_tags ?? []
  const isVege = labels.some((l) => l.includes('vegetarian') || l.includes('vegan')) ||
    !categories.some((c) => c.includes('en:meats') || c.includes('en:fish') || c.includes('en:seafood'))

  return {
    id: -(index + 1),     // negative id = aliment OFF non encore sauvegardé
    nom: p.product_name ?? '',
    categorie: 'Open Food Facts',
    kcalPer100g: Math.round(kcal * 10) / 10,
    protPer100g: Math.round(prot * 10) / 10,
    glucPer100g: Math.round(gluc * 10) / 10,
    lipPer100g: Math.round(lip * 10) / 10,
    vegetarien: isVege,
    poidsUnitaire: serving && serving > 0 && serving <= 1000 ? serving : 100,
    fromOFF: true,
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json([])

  // Recherche locale
  const local = await prisma.food.findMany({
    where: { nom: { contains: q } },
    take: 10,
    orderBy: { nom: 'asc' },
  })

  const localWithFlag = local.map((f) => ({ ...f, fromOFF: false }))

  // Complète avec OFF si peu de résultats locaux
  if (local.length >= 5) return NextResponse.json(localWithFlag)

  try {
    const url = `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(q)}&fields=product_name,nutriments,serving_quantity,labels_tags,categories_tags&page_size=10&json=1`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'NeedWhey/1.0 (contact@needwhey.app)' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error('OFF error')

    const data = await res.json()
    const products: OFFProduct[] = data.products ?? []

    const offResults = products
      .filter((p) => {
        if (!p.product_name) return false
        const n = p.nutriments ?? {}
        // Filtre les entrées sans données nutritionnelles valides
        return (n['energy-kcal_100g'] ?? 0) > 0 || (n.proteins_100g ?? 0) > 0
      })
      .map(offToFood)
      // Déduplique par rapport aux résultats locaux
      .filter((off) => !local.some((l) => l.nom.toLowerCase() === off.nom.toLowerCase()))
      .slice(0, 10 - local.length)

    return NextResponse.json([...localWithFlag, ...offResults])
  } catch {
    // OFF indisponible — on renvoie juste les résultats locaux
    return NextResponse.json(localWithFlag)
  }
}
