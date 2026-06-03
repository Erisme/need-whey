import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Mot de passe trop court (min 6 caractères)' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({ data: { name, email, passwordHash } })

  const session = await getSession()
  session.userId = user.id
  session.userName = user.name
  await session.save()

  return NextResponse.json({ ok: true }, { status: 201 })
}
