import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { calculerBesoins } from '@/lib/nutrition'
import ProgressBar from '@/components/ProgressBar'

function todayUTC() {
  const d = new Date()
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  const profile = await prisma.profile.findUnique({ where: { userId: session.userId } })
  if (!profile) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="card">
          <h2>Bienvenue !</h2>
          <p>Commence par renseigner ton profil pour calculer tes besoins journaliers.</p>
          <Link href="/profil" className="btn btn-primary">Renseigner mon profil</Link>
        </div>
      </div>
    )
  }

  const besoins = calculerBesoins(
    profile.poids,
    profile.taille,
    profile.dateNaissance,
    profile.sexe as 'homme' | 'femme',
    profile.niveauActivite as Parameters<typeof calculerBesoins>[4],
    profile.objectif as Parameters<typeof calculerBesoins>[5]
  )

  const today = todayUTC()
  const entries = await prisma.mealEntry.findMany({
    where: { userId: session.userId, date: today },
    include: { food: true },
  })

  const totaux = entries.reduce(
    (acc, e) => {
      const r = e.quantite / 100
      return {
        kcal: acc.kcal + e.food.kcalPer100g * r,
        proteines: acc.proteines + e.food.protPer100g * r,
      }
    },
    { kcal: 0, proteines: 0 }
  )

  const pctKcal = Math.min(100, Math.round((totaux.kcal / besoins.objectifKcal) * 100))
  const pctProt = Math.min(100, Math.round((totaux.proteines / besoins.objectifProteinesG) * 100))

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <h1 style={{ marginBottom: '0.25rem' }}>Tableau de bord</h1>
      <p style={{ color: 'var(--color-muted)', marginTop: 0 }}>
        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>

      {besoins.alerteProteinesElevees && (
        <div className="alert alert-warning" role="alert">
          Objectif protéines élevé (&gt;2,2 g/kg). Consultez un professionnel de santé.
        </div>
      )}

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Objectifs du jour</h2>
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
            <span>{Math.round(totaux.proteines)} / {besoins.objectifProteinesG} g</span>
          </div>
          <ProgressBar pct={pctProt} color={pctProt >= 100 ? 'success' : pctProt >= 60 ? undefined : 'warning'} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{besoins.objectifKcal}</div>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>kcal / jour</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{besoins.objectifProteinesG} g</div>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>protéines / jour</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <Link href="/journal" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
          Ouvrir le journal
        </Link>
        <Link href="/profil" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
          Modifier le profil
        </Link>
      </div>
    </div>
  )
}
