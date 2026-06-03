'use client'

import { useState } from 'react'
import type { Food } from '@prisma/client'
import { calculerRecommandations } from '@/lib/reco'

export default function RecoSection({
  proteinesManquantesG,
  kcalRestantes,
  vegetarien,
  allFoods,
}: {
  proteinesManquantesG: number
  kcalRestantes: number
  vegetarien: boolean
  allFoods: Food[]
}) {
  const [show, setShow] = useState(false)

  const suggestions = show
    ? calculerRecommandations(allFoods, proteinesManquantesG, Math.max(kcalRestantes, 200), vegetarien)
    : []

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Compléter mes protéines</h2>
      <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
        Il manque encore <strong>{Math.round(proteinesManquantesG)} g</strong> de protéines.
        {kcalRestantes < 0 && (
          <span style={{ color: 'var(--color-warning)' }}> (objectif calorique déjà atteint — portions réduites)</span>
        )}
      </p>
      {!show ? (
        <button className="btn btn-primary" onClick={() => setShow(true)}>
          Voir les suggestions
        </button>
      ) : (
        <>
          {suggestions.length === 0 ? (
            <p>Aucune suggestion disponible avec ces contraintes.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Aliment</th>
                  <th style={{ textAlign: 'right' }}>Quantité</th>
                  <th style={{ textAlign: 'right' }}>Protéines</th>
                  <th style={{ textAlign: 'right' }}>Kcal</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((s) => (
                  <tr key={s.food.id}>
                    <td>
                      {s.food.nom}
                      {s.food.vegetarien && <span className="chip veg">veg</span>}
                    </td>
                    <td style={{ textAlign: 'right' }}>{s.quantiteG} g</td>
                    <td style={{ textAlign: 'right' }}>{s.proteinesApportees} g</td>
                    <td style={{ textAlign: 'right' }}>{s.kcalApportees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setShow(false)}>
            Masquer
          </button>
        </>
      )}
    </div>
  )
}
