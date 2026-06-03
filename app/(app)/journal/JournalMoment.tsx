'use client'

import { useRouter } from 'next/navigation'
import type { Food, MealEntry } from '@prisma/client'

type EntryWithFood = MealEntry & { food: Food }

const MOMENT_LABELS: Record<string, string> = {
  matin: 'Matin',
  midi: 'Midi',
  soir: 'Soir',
  collation: 'Collation',
}

export default function JournalMoment({
  moment,
  entries,
  readOnly = false,
}: {
  moment: string
  entries: EntryWithFood[]
  readOnly?: boolean
}) {
  const router = useRouter()

  if (entries.length === 0) return null

  async function deleteEntry(id: number) {
    await fetch(`/api/meals/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  const totMoment = entries.reduce(
    (acc, e) => {
      const r = e.quantite / 100
      return {
        kcal: acc.kcal + e.food.kcalPer100g * r,
        prot: acc.prot + e.food.protPer100g * r,
      }
    },
    { kcal: 0, prot: 0 }
  )

  return (
    <div className="card moment-section">
      <div className="moment-title">{MOMENT_LABELS[moment] ?? moment}</div>
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
        <tfoot>
          <tr style={{ fontWeight: 600 }}>
            <td>Total</td>
            <td></td>
            <td style={{ textAlign: 'right' }}>{Math.round(totMoment.prot * 10) / 10} g</td>
            <td style={{ textAlign: 'right' }}>{Math.round(totMoment.kcal)}</td>
            {!readOnly && <td></td>}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
