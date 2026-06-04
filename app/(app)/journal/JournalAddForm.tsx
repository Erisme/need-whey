'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface FoodResult {
  id: number
  nom: string
  categorie: string
  kcalPer100g: number
  protPer100g: number
  glucPer100g: number
  lipPer100g: number
  vegetarien: boolean
  poidsUnitaire: number
  fromOFF: boolean
}

export default function JournalAddForm() {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [searching, setSearching] = useState(false)

  const [selected, setSelected] = useState<FoodResult | null>(null)
  const [quantite, setQuantite] = useState('')
  const [customPoids, setCustomPoids] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const wrapperRef = useRef<HTMLDivElement>(null)

  // Debounce search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }
    setSearching(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`)
        const data: FoodResult[] = await res.json()
        setResults(data)
        setIsOpen(data.length > 0)
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  // Ferme le dropdown en cliquant à l'extérieur
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectFood(food: FoodResult) {
    setSelected(food)
    setQuery(food.nom)
    setQuantite(String(food.poidsUnitaire))
    setCustomPoids(false)
    setIsOpen(false)
    setResults([])
  }

  function reset() {
    setSelected(null)
    setQuery('')
    setQuantite('')
    setCustomPoids(false)
    setResults([])
    setIsOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) { setError('Sélectionner un aliment'); return }
    const qty = Number(quantite)
    if (!qty || qty <= 0) { setError('Quantité invalide'); return }
    setError('')
    setLoading(true)

    try {
      let foodId = selected.id

      // Si l'aliment vient d'OFF (id négatif), on le sauvegarde d'abord en DB
      if (selected.fromOFF || foodId < 0) {
        const saveRes = await fetch('/api/foods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: selected.nom,
            categorie: selected.categorie,
            kcalPer100g: selected.kcalPer100g,
            protPer100g: selected.protPer100g,
            glucPer100g: selected.glucPer100g,
            lipPer100g: selected.lipPer100g,
            vegetarien: selected.vegetarien,
            poidsUnitaire: selected.poidsUnitaire,
          }),
        })
        if (!saveRes.ok) throw new Error('Impossible de sauvegarder l\'aliment')
        const saved = await saveRes.json()
        foodId = saved.id
      }

      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodId, quantite: qty }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'ajout')

      reset()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const hasSelection = selected !== null

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>

        {/* Recherche + dropdown */}
        <div className="form-group" style={{ gridColumn: '1/-1', position: 'relative' }} ref={wrapperRef}>
          <label htmlFor="food-search">
            Aliment
            {selected?.fromOFF && (
              <span style={{ marginLeft: '0.5rem', fontSize: '0.78em', color: 'var(--color-text-muted, #888)' }}>
                · via Open Food Facts
              </span>
            )}
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="food-search"
              type="search"
              placeholder="Rechercher un aliment…"
              value={query}
              autoComplete="off"
              onChange={(e) => {
                setQuery(e.target.value)
                if (selected && e.target.value !== selected.nom) setSelected(null)
              }}
              onFocus={() => results.length > 0 && setIsOpen(true)}
              style={{ flex: 1 }}
              aria-expanded={isOpen}
              aria-autocomplete="list"
            />
            {hasSelection && (
              <button type="button" onClick={reset} style={{ padding: '0 0.6rem', cursor: 'pointer' }} title="Effacer">
                ✕
              </button>
            )}
          </div>

          {isOpen && (
            <ul
              role="listbox"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 50,
                margin: 0,
                padding: 0,
                listStyle: 'none',
                background: 'var(--color-card, #fff)',
                border: '1px solid var(--color-border, #ddd)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                maxHeight: '16rem',
                overflowY: 'auto',
              }}
            >
              {results.map((food, i) => (
                <li
                  key={`${food.id}-${i}`}
                  role="option"
                  aria-selected={false}
                  onMouseDown={() => selectFood(food)}
                  style={{
                    padding: '0.55rem 0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--color-border, #eee)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-hover, #f5f5f5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  <span>
                    {food.nom}
                    {food.vegetarien && <span className="chip veg" style={{ marginLeft: '0.4rem' }}>veg</span>}
                    {food.fromOFF && <span style={{ marginLeft: '0.4rem', fontSize: '0.72em', color: '#888' }}>OFF</span>}
                  </span>
                  <span style={{ fontSize: '0.82em', color: 'var(--color-text-muted, #888)', whiteSpace: 'nowrap', marginLeft: '1rem', textAlign: 'right' }}>
                    <span style={{ display: 'block', fontWeight: 600, color: 'var(--color-text, #111)', fontSize: '0.9em' }}>
                      ~{food.poidsUnitaire} g
                    </span>
                    <span style={{ display: 'block' }}>
                      {food.protPer100g}g prot · {Math.round(food.kcalPer100g)} kcal/100g
                    </span>
                  </span>
                </li>
              ))}
              {searching && (
                <li style={{ padding: '0.55rem 0.9rem', color: '#888', fontSize: '0.9em' }}>Recherche…</li>
              )}
            </ul>
          )}
        </div>

        {/* Quantité */}
        <div className="form-group">
          {!customPoids && hasSelection ? (
            <>
              <label>Quantité</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.4rem' }}>
                <strong>{quantite} g</strong>
                <span style={{ color: 'var(--color-text-muted, #888)', fontSize: '0.85em' }}>
                  poids estimé d&apos;une portion
                </span>
                <button
                  type="button"
                  style={{ fontSize: '0.8em', padding: '0.1rem 0.5rem', cursor: 'pointer' }}
                  onClick={() => setCustomPoids(true)}
                >
                  Modifier
                </button>
              </div>
            </>
          ) : (
            <>
              <label htmlFor="quantite">
                Quantité (g)
                {hasSelection && selected && (
                  <span style={{ color: 'var(--color-text-muted, #888)', fontSize: '0.85em', marginLeft: '0.4rem' }}>
                    · moy. {selected.poidsUnitaire} g
                  </span>
                )}
              </label>
              <input
                id="quantite"
                type="number"
                min={1}
                max={2000}
                step={1}
                placeholder="150"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Aperçu macros si sélectionné */}
        {hasSelection && selected && quantite && (
          <div style={{ gridColumn: '1/-1', fontSize: '0.82em', color: 'var(--color-text-muted, #888)' }}>
            {(() => {
              const q = Number(quantite) / 100
              return `→ ${Math.round(selected.protPer100g * q * 10) / 10}g prot · ${Math.round(selected.kcalPer100g * q)} kcal · ${Math.round(selected.glucPer100g * q * 10) / 10}g gluc · ${Math.round(selected.lipPer100g * q * 10) / 10}g lip`
            })()}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading || !hasSelection} style={{ marginTop: '1rem' }}>
        {loading ? 'Ajout…' : 'Ajouter'}
      </button>
    </form>
  )
}
