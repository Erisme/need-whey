import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

function todayUTC() {
  const d = new Date()
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
}

export async function POST(req: NextRequest) {
  let session
  try {
    session = await requireAuth()
  } catch {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { foodId, moment, quantite } = await req.json()

  if (!foodId || !moment || !quantite) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const MOMENTS = ['matin', 'midi', 'soir', 'collation']
  if (!MOMENTS.includes(moment)) {
    return NextResponse.json({ error: 'Moment invalide' }, { status: 400 })
  }

  const entry = await prisma.mealEntry.create({
    data: {
      userId: session.userId!,
      foodId: Number(foodId),
      moment,
      quantite: Number(quantite),
      date: todayUTC(),
    },
  })

  return NextResponse.json(entry, { status: 201 })
}
