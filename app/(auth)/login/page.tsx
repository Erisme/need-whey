'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const body = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      password: fd.get('password') as string,
    }
    const res = await fetch(`/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Erreur inconnue')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: '3rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Need Whey</h1>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h2>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Prénom</label>
              <input id="name" name="name" type="text" required autoComplete="given-name" />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          {mode === 'login' ? (
            <>Pas encore de compte ?{' '}
              <button className="btn" style={{ padding: 0, background: 'none', color: 'var(--color-primary)' }} onClick={() => setMode('register')}>
                Créer un compte
              </button>
            </>
          ) : (
            <>Déjà un compte ?{' '}
              <button className="btn" style={{ padding: 0, background: 'none', color: 'var(--color-primary)' }} onClick={() => setMode('login')}>
                Se connecter
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
