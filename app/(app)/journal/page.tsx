import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { calculerBesoins, calculerTotaux } from '@/lib/nutrition'
import ProgressBar from '@/components/ProgressBar'
import JournalAddForm from './JournalAddForm'
import JournalEntries from './JournalEntries'
import RecoSection from './RecoSection'

function parseDate(param: string | undefined): Date {
  if (param && /^\d{4}-\d{2}-\d{2}$/.test(param)) {
    const [y, m, d] = param.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d))
  }
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

function toParam(date: Date): string {
  return date.toISOString().split('T')[0]
}

function addDays(date: Date, n: number): Date {
  return new Date(date.getTime() + n * 86_400_000)
}

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  const { date: dateParam } = await searchParams
  const selectedDate = parseDate(dateParam)

  const todayUTC = parseDate(undefined)
  const isToday = selectedDate.getTime() === todayUTC.getTime()
  const isFuture = selectedDate.getTime() > todayUTC.getTime()

  if (isFuture) redirect('/journal')

  const [profile, foods] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.userId } }),
    prisma.food.findMany({ orderBy: { nom: 'asc' } }),
  ])

  if (!profile) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="card">
          <p>Renseigne d&apos;abord ton <a href="/profil">profil</a> pour utiliser le journal.</p>
        </div>
      </div>
    )
  }

  const besoins = calculerBesoins(
    profile.poids, profile.taille, profile.dateNaissance,
    profile.sexe as 'homme' | 'femme',
    profile.niveauActivite as Parameters<typeof calculerBesoins>[4],
    profile.objectif as Parameters<typeof calculerBesoins>[5]
  )

  const entries = await prisma.mealEntry.findMany({
    where: { userId: session.userId, date: selectedDate },
    include: { food: true },
    orderBy: { createdAt: 'asc' },
  })

  const totaux = calculerTotaux(entries)
  const pctKcal = Math.min(100, Math.round((totaux.kcal / besoins.objectifKcal) * 100))
  const pctProt = Math.min(100, Math.round((totaux.proteines / besoins.objectifProteinesG) * 100))

  const prevParam = toParam(addDays(selectedDate, -1))
  const nextParam = toParam(addDays(selectedDate, 1))

  const labelDate = selectedDate.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      {/* Navigation de date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Link href={`/journal?date=${prevParam}`} className="btn btn-secondary" aria-label="Jour précédent" style={{ padding: '0.35rem 0.75rem' }}>
          ←
        </Link>
        <h1 style={{ margin: 0, flex: 1, fontSize: '1.25rem' }}>
          {isToday ? 'Aujourd\'hui' : labelDate}
        </h1>
        {!isToday ? (
          <Link href={`/journal?date=${nextParam}`} className="btn btn-secondary" aria-label="Jour suivant" style={{ padding: '0.35rem 0.75rem' }}>
            →
          </Link>
        ) : (
          <span style={{ width: '2.5rem' }} />
        )}
      </div>
      {!isToday && (
        <p style={{ color: 'var(--color-muted)', marginTop: 0, fontSize: '0.875rem' }}>
          {labelDate} —{' '}
          <Link href="/journal">Retour à aujourd&apos;hui</Link>
        </p>
      )}

      {/* Barres de progression */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span>Calories</span>
            <span>{Math.round(totaux.kcal)} / {besoins.objectifKcal} kcal</span>
          </div>
          <ProgressBar pct={pctKcal} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span><strong>Protéines</strong></span>
            <span>{Math.round(totaux.proteines * 10) / 10} / {besoins.objectifProteinesG} g</span>
          </div>
          <ProgressBar pct={pctProt} color={pctProt >= 100 ? 'success' : pctProt >= 60 ? undefined : 'warning'} />
        </div>
      </div>

      {/* Formulaire d'ajout uniquement pour aujourd'hui */}
      {isToday && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Ajouter un aliment</h2>
          <JournalAddForm />
        </div>
      )}

      {entries.length === 0 && (
        <div className="card" style={{ color: 'var(--color-muted)', textAlign: 'center' }}>
          Aucun repas enregistré ce jour.
        </div>
      )}

      <JournalEntries entries={entries} readOnly={!isToday} />

      {/* Reco uniquement pour aujourd'hui */}
      {isToday && totaux.proteines < besoins.objectifProteinesG && (
        <RecoSection
          proteinesManquantesG={besoins.objectifProteinesG - totaux.proteines}
          kcalRestantes={besoins.objectifKcal - totaux.kcal}
          vegetarien={profile.vegetarien}
          allFoods={foods}
        />
      )}
    </div>
  )
}
