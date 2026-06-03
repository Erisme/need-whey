import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import ProfilForm from './ProfilForm'

export default async function ProfilPage() {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  const profile = await prisma.profile.findUnique({ where: { userId: session.userId } })

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <h1>Mon profil</h1>
      <div className="card">
        <ProfilForm profile={profile} />
      </div>
    </div>
  )
}
