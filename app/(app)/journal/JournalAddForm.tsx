'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Food } from '@prisma/client'

const MOMENTS = [
  { value: 'matin', label: 'Matin' },
  { value: 'midi', label: 'Midi' },
  { value: 'soir', label: 'Soir' },
  { value: 'collation', label: 'Collation' },
]

export default function JournalAddForm({ foods }: { foods: Food[] }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = search.length >= 2
    ? foods.filter((f) => f.nom.toLowerCase().includes(search.toLowerCase()))
    : foods

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const body = {
      foodId: Number(fd.get('foodId')),
      moment: fd.get('moment'),
      quantite: Number(fd.get('quantite')),
    }
    if (!body.foodId || !body.moment || !body.quantite) {
      setError('Tous les champs sont requis')
      setLoading(false)
      return
    }
    const res = await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Erreur lors de l\'ajout')
    } else {
      ;(e.target as HTMLFormElement).reset()
      setSearch('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group" style={{ gridColumn: '1/-1' }}>
          <label htmlFor="food-search">Rechercher un aliment</label>
          <input
            id="food-search"
            type="search"
            placeholder="Taper au moins 2 lettres…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="form-group" style={{ gridColumn: '1/-1' }}>
          <label htmlFor="foodId">Aliment</label>
          <select id="foodId" name="foodId" required>
            <option value="">— Sélectionner —</option>
            {filtered.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom} ({f.protPer100g}g prot · {f.kcalPer100g} kcal / 100g){f.vegetarien ? ' 🌿' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="moment">Moment</label>
          <select id="moment" name="moment" required>
            {MOMENTS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantite">Quantité (g)</label>
          <input id="quantite" name="quantite" type="number" min={1} max={2000} step={1} required placeholder="150" />
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Ajout…' : 'Ajouter'}
      </button>
    </form>
  )
}
