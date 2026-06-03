import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  let session
  try {
    session = await requireAuth()
  } catch {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await req.json()
  const { sexe, dateNaissance, taille, poids, niveauActivite, objectif, vegetarien } = body

  if (!sexe || !dateNaissance || !taille || !poids || !niveauActivite || !objectif) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const data = {
    sexe,
    dateNaissance: new Date(dateNaissance),
    taille: Number(taille),
    poids: Number(poids),
    niveauActivite,
    objectif,
    vegetarien: Boolean(vegetarien),
  }

  await prisma.profile.upsert({
    where: { userId: session.userId },
    update: data,
    create: { userId: session.userId!, ...data },
  })

  return NextResponse.json({ ok: true })
}
