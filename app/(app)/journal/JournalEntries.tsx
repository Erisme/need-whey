'use client'

import { useRouter } from 'next/navigation'
import type { Food, MealEntry } from '@prisma/client'

type EntryWithFood = MealEntry & { food: Food }

export default function JournalEntries({
  entries,
  readOnly = false,
}: {
  entries: EntryWithFood[]
  readOnly?: boolean
}) {
  const router = useRouter()

  if (entries.length === 0) return null

  async function deleteEntry(id: number) {
    await fetch(`/api/meals/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Aliment</th>
            <th style={{ textAlign: 'right' }}>Qté</th>
            <th style={{ textAlign: 'right' }}>Prot.</th>
            <th style={{ textAlign: 'right' }}>Kcal</th>
            {!readOnly && <th></th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <td>
                {e.food.nom}
                {e.food.vegetarien && <span className="chip veg">veg</span>}
              </td>
              <td style={{ textAlign: 'right' }}>{e.quantite} g</td>
              <td style={{ textAlign: 'right' }}>{Math.round((e.quantite / 100) * e.food.protPer100g * 10) / 10} g</td>
              <td style={{ textAlign: 'right' }}>{Math.round((e.quantite / 100) * e.food.kcalPer100g)}</td>
              {!readOnly && (
                <td>
                  <button
                    aria-label={`Supprimer ${e.food.nom}`}
                    onClick={() => deleteEntry(e.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', fontSize: '1rem' }}
                  >
                    ✕
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
