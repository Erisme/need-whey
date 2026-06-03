'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AppNav({ userName }: { userName: string }) {
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <nav className="app-nav" role="navigation" aria-label="Navigation principale">
      <Link href="/dashboard">Tableau de bord</Link>
      <Link href="/journal">Journal</Link>
      <Link href="/profil">Profil</Link>
      <span className="nav-spacer" />
      <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>{userName}</span>
      <button className="btn btn-secondary" style={{ padding: '0.35rem 0.9rem', fontSize: '0.9rem' }} onClick={logout}>
        Déconnexion
      </button>
    </nav>
  )
}
