'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Profile } from '@prisma/client'

const ACTIVITES = [
  {
    value: 'sedentaire',
    label: 'Sédentaire',
    detail: 'Bureau toute la journée, peu ou pas d\'exercice. Ex : travail assis, peu de marche.',
  },
  {
    value: 'leger',
    label: 'Légèrement actif',
    detail: '1 à 3 séances de sport par semaine. Ex : marche régulière, yoga, vélo occasionnel.',
  },
  {
    value: 'modere',
    label: 'Modérément actif',
    detail: '3 à 5 séances de sport par semaine. Ex : course, natation, musculation en loisir.',
  },
  {
    value: 'actif',
    label: 'Très actif',
    detail: '6 à 7 séances intenses par semaine. Ex : entraînement quotidien, sport compétition.',
  },
  {
    value: 'tres_actif',
    label: 'Extrêmement actif',
    detail: 'Sport intense + travail physique. Ex : athlète professionnel, maçon qui s\'entraîne aussi.',
  },
]

const OBJECTIFS = [
  { value: 'PERTE_POIDS', label: 'Perte de poids' },
  { value: 'MAINTIEN', label: 'Maintien du poids' },
  { value: 'MUSCULATION', label: 'Musculation / prise de masse' },
]

export default function ProfilForm({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const toDateInput = (d: Date | null) => {
    if (!d) return ''
    const date = new Date(d)
    return date.toISOString().split('T')[0]
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const body = {
      sexe: fd.get('sexe'),
      dateNaissance: fd.get('dateNaissance'),
      taille: Number(fd.get('taille')),
      poids: Number(fd.get('poids')),
      niveauActivite: fd.get('niveauActivite'),
      objectif: fd.get('objectif'),
      vegetarien: fd.get('vegetarien') === 'on',
    }
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Erreur lors de la sauvegarde')
    } else {
      setSuccess(true)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {success && <div className="alert alert-success" role="status">Profil enregistré !</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="sexe">Sexe</label>
          <select id="sexe" name="sexe" required defaultValue={profile?.sexe ?? ''}>
            <option value="">— Choisir —</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dateNaissance">Date de naissance</label>
          <input id="dateNaissance" name="dateNaissance" type="date" required defaultValue={toDateInput(profile?.dateNaissance ?? null)} />
        </div>
        <div className="form-group">
          <label htmlFor="taille">Taille (cm)</label>
          <input id="taille" name="taille" type="number" min={100} max={250} required defaultValue={profile?.taille ?? ''} />
        </div>
        <div className="form-group">
          <label htmlFor="poids">Poids (kg)</label>
          <input id="poids" name="poids" type="number" min={30} max={300} step={0.1} required defaultValue={profile?.poids ?? ''} />
        </div>
      </div>

      <fieldset style={{ border: 'none', padding: 0, margin: '0 0 1rem' }}>
        <legend style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Niveau d&apos;activité</legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {ACTIVITES.map((a) => {
            const checked = (profile?.niveauActivite ?? '') === a.value
            return (
              <label
                key={a.value}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  background: 'var(--color-surface)',
                }}
              >
                <input
                  type="radio"
                  name="niveauActivite"
                  value={a.value}
                  defaultChecked={checked}
                  required
                  style={{ marginTop: '0.2rem', flexShrink: 0 }}
                />
                <span>
                  <span style={{ fontWeight: 500 }}>{a.label}</span>
                  <br />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{a.detail}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="form-group">
        <label htmlFor="objectif">Objectif</label>
        <select id="objectif" name="objectif" required defaultValue={profile?.objectif ?? ''}>
          <option value="">— Choisir —</option>
          {OBJECTIFS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input id="vegetarien" name="vegetarien" type="checkbox" defaultChecked={profile?.vegetarien ?? false} style={{ width: 'auto' }} />
        <label htmlFor="vegetarien" style={{ marginBottom: 0 }}>Régime végétarien</label>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  )
}
