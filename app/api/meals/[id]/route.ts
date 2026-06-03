import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let session
  try {
    session = await requireAuth()
  } catch {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params
  const entryId = Number(id)

  const entry = await prisma.mealEntry.findUnique({ where: { id: entryId } })
  if (!entry || entry.userId !== session.userId) {
    return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
  }

  await prisma.mealEntry.delete({ where: { id: entryId } })
  return NextResponse.json({ ok: true })
}
