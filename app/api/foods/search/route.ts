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

// Normalise un nom pour la comparaison (minuscules, sans accents, sans ponctuation)
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Cherche le serving_quantity OFF qui correspond le mieux à un nom d'aliment local
function matchServing(localNom: string, offProducts: OFFProduct[]): number | null {
  const localKey = normalize(localNom)
  // Mots significatifs (> 2 lettres) du nom local
  const localWords = localKey.split(' ').filter(w => w.length > 2)

  let best: { score: number; qty: number } | null = null

  for (const p of offProducts) {
    if (!p.product_name || !p.serving_quantity) continue
    const qty = Number(p.serving_quantity)
    if (!qty || qty <= 0 || qty > 1500) continue

    const offKey = normalize(p.product_name)
    const offWords = offKey.split(' ').filter(w => w.length > 2)

    let score = 0
    if (localKey === offKey) {
      score = 100
    } else if (offKey.startsWith(localWords[0]) || localKey.startsWith(offWords[0])) {
      // premier mot identique
      const common = localWords.filter(w => offWords.includes(w)).length
      score = 50 + common * 10
    } else {
      // mots en commun
      const common = localWords.filter(w => offWords.includes(w)).length
      score = common * 10
    }

    if (score > 0 && (!best || score > best.score)) {
      best = { score, qty }
    }
  }

  return best ? best.qty : null
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
    id: -(index + 1),
    nom: p.product_name ?? '',
    categorie: 'Open Food Facts',
    kcalPer100g: Math.round(kcal * 10) / 10,
    protPer100g: Math.round(prot * 10) / 10,
    glucPer100g: Math.round(gluc * 10) / 10,
    lipPer100g: Math.round(lip * 10) / 10,
    vegetarien: isVege,
    poidsUnitaire: serving && serving > 0 && serving <= 1500 ? serving : 100,
    fromOFF: true,
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json([])

  // Requête locale + OFF en parallèle
  const [local, offResult] = await Promise.all([
    prisma.food.findMany({
      where: { nom: { contains: q } },
      take: 10,
      orderBy: { nom: 'asc' },
    }),
    fetch(
      `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(q)}&fields=product_name,nutriments,serving_quantity,labels_tags,categories_tags&page_size=15&json=1`,
      {
        headers: { 'User-Agent': 'NeedWhey/1.0 (contact@needwhey.app)' },
        signal: AbortSignal.timeout(4000),
      }
    )
    .then(r => r.ok ? r.json() : { products: [] })
    .catch(() => ({ products: [] })),
  ])

  const offProducts: OFFProduct[] = offResult.products ?? []

  // Enrichit les aliments locaux avec le serving_quantity d'OFF
  const localEnriched = local.map(food => {
    const offServing = matchServing(food.nom, offProducts)
    return {
      ...food,
      poidsUnitaire: offServing ?? food.poidsUnitaire,
      fromOFF: false,
    }
  })

  // Aliments OFF sans équivalent local (pour compléter quand peu de résultats locaux)
  const localNoms = new Set(local.map(f => normalize(f.nom)))
  const offOnly = local.length < 5
    ? offProducts
        .filter(p => {
          if (!p.product_name) return false
          if (localNoms.has(normalize(p.product_name))) return false
          const n = p.nutriments ?? {}
          return (n['energy-kcal_100g'] ?? 0) > 0 || (n.proteins_100g ?? 0) > 0
        })
        .map(offToFood)
        .slice(0, 10 - local.length)
    : []

  return NextResponse.json([...localEnriched, ...offOnly])
}
