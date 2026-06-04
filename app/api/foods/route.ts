import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

// Sauvegarde un aliment issu d'Open Food Facts dans la DB locale
export async function POST(req: NextRequest) {
  try {
    await requireAuth()
  } catch {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await req.json()
  const { nom, categorie, kcalPer100g, protPer100g, glucPer100g, lipPer100g, vegetarien, poidsUnitaire } = body

  if (!nom) return NextResponse.json({ error: 'Nom requis' }, { status: 400 })

  // Vérifie si un aliment avec ce nom existe déjà
  const existing = await prisma.food.findFirst({ where: { nom } })
  if (existing) return NextResponse.json(existing)

  const food = await prisma.food.create({
    data: {
      nom,
      categorie: categorie ?? 'Open Food Facts',
      kcalPer100g: Number(kcalPer100g) || 0,
      protPer100g: Number(protPer100g) || 0,
      glucPer100g: Number(glucPer100g) || 0,
      lipPer100g: Number(lipPer100g) || 0,
      vegetarien: Boolean(vegetarien),
      poidsUnitaire: Number(poidsUnitaire) || 100,
    },
  })

  return NextResponse.json(food, { status: 201 })
}
