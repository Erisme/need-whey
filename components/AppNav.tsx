'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useId, useState } from 'react'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Tableau de bord' },
  { href: '/journal', label: 'Journal' },
  { href: '/profil', label: 'Profil' },
] as const

export default function AppNav({ userName }: { userName: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const menuId = useId()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  useEffect(() => {
    if (!menuOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMenu()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, closeMenu])

  async function logout() {
    closeMenu()
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <nav
      className={`app-nav${menuOpen ? ' is-open' : ''}`}
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="app-nav-bar">
        <span className="app-nav-brand" aria-hidden="true">
          Need Whey
        </span>
        <button
          type="button"
          className="app-nav-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="visually-hidden">{menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
          <span className="app-nav-toggle-icon" aria-hidden="true" />
        </button>
      </div>

      <div id={menuId} className="app-nav-menu">
        <div className="app-nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={closeMenu}>
              {label}
            </Link>
          ))}
        </div>
        <span className="nav-spacer" aria-hidden="true" />
        <div className="app-nav-account">
          {userName ? (
            <span className="app-nav-user" title={userName}>
              {userName}
            </span>
          ) : null}
          <button
            type="button"
            className="btn btn-secondary app-nav-logout"
            onClick={logout}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  )
}
