import Link from 'next/link'

export default function ExplicationsPage() {
  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <Link href="/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          &larr; Retour
        </Link>
        <h1 style={{ margin: 0 }}>Comment sont calculés vos besoins ?</h1>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>1. Le calcul des Calories (Énergie)</h2>
        <p>
          Pour déterminer combien de calories vous devez consommer chaque jour, nous procédons en 3 étapes basées sur des consensus scientifiques internationaux.
        </p>

        <h3>Étape A : Le Métabolisme de Base (BMR)</h3>
        <p>
          Le BMR (<em>Basal Metabolic Rate</em>) correspond au nombre de calories que votre corps brûle au repos absolu, juste pour maintenir vos fonctions vitales (respirer, faire battre votre cœur, etc.).
        </p>
        <p>
          Nous utilisons l'équation de <strong>Mifflin-St Jeor (1990)</strong>, qui est aujourd'hui considérée par l'Académie de Nutrition et de Diététique comme la formule prédictive la plus précise pour les adultes normaux et en surpoids.
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><strong>Hommes :</strong> (10 × Poids) + (6.25 × Taille) - (5 × Âge) + 5</li>
          <li><strong>Femmes :</strong> (10 × Poids) + (6.25 × Taille) - (5 × Âge) - 161</li>
        </ul>

        <h3>Étape B : La Dépense Énergétique Totale (TDEE)</h3>
        <p>
          Nous multiplions ensuite votre BMR par un <strong>Facteur d'Activité Physique (NAP)</strong> pour obtenir votre Dépense Énergétique Totale (TDEE). Ces facteurs sont définis par l'OMS (Organisation Mondiale de la Santé) :
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Sédentaire (peu ou pas de sport) : BMR × 1.2</li>
          <li>Léger (sport 1 à 3 fois/semaine) : BMR × 1.375</li>
          <li>Modéré (sport 3 à 5 fois/semaine) : BMR × 1.55</li>
          <li>Actif (sport intense 6 à 7 fois/semaine) : BMR × 1.725</li>
          <li>Très actif (travail physique dur ou double entraînement) : BMR × 1.9</li>
        </ul>

        <h3>Étape C : L'Ajustement selon votre Objectif</h3>
        <p>Une fois votre dépense d'énergie quotidienne connue, nous appliquons un ratio en fonction de votre but :</p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><strong>Maintien :</strong> 100% du TDEE.</li>
          <li><strong>Perte de poids :</strong> TDEE - 18%. Ce déficit modéré (environ 300 à 500 kcal) favorise une perte de graisse saine et durable sans ralentir drastiquement le métabolisme.</li>
          <li><strong>Musculation :</strong> TDEE + 10%. Un léger surplus (<em>lean bulk</em>) pour construire du muscle en limitant la prise de masse grasse.</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>2. Le calcul des Protéines</h2>
        <p>
          Les protéines sont essentielles pour la réparation cellulaire, la santé musculaire et la satiété. Nos recommandations sont ajustées selon votre âge et votre objectif, en nous basant sur les recommandations des autorités de santé (ANSES, OMS) et la littérature scientifique sportive récente.
        </p>

        <h3>Recommandations générales par âge :</h3>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><strong>Moins de 18 ans :</strong> 0.91 g / kg de poids corporel. La croissance nécessite un apport légèrement supérieur à celui d'un adulte sédentaire.</li>
          <li><strong>65 ans et plus :</strong> 1.1 g / kg. Avec l'âge, l'absorption des protéines diminue. L'augmentation des apports aide à prévenir la sarcopénie (fonte musculaire liée à l'âge).</li>
        </ul>

        <h3>Recommandations pour adultes (18-64 ans) selon l'objectif :</h3>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>
            <strong>Maintien : 0.83 g / kg.</strong><br/>
            <em>Source :</em> Recommandation officielle de l'ANSES (Agence nationale de sécurité sanitaire de l'alimentation) et de l'EFSA pour un adulte en bonne santé.
          </li>
          <li>
            <strong>Perte de poids : 1.6 g / kg.</strong><br/>
            <em>Explication :</em> Lors d'un déficit calorique, le corps risque de puiser dans ses muscles pour créer de l'énergie. Un apport élevé en protéines (souvent recommandé entre 1.4 et 1.8g/kg) permet de préserver la masse musculaire et augmente fortement le sentiment de satiété.<br/>
            <em>Source :</em> Hector & Phillips (2018), <em>Protein Recommendations for Weight Loss in Elite Athletes</em> (applicable au grand public pour la préservation musculaire).
          </li>
          <li>
            <strong>Musculation : 1.9 g / kg.</strong><br/>
            <em>Explication :</em> La construction musculaire (hypertrophie) nécessite des protéines supplémentaires. La littérature montre que les bénéfices maximaux sont atteints autour de 1.6 à 2.2 g/kg.<br/>
            <em>Source :</em> Morton et al. (2018), Méta-analyse dans le <em>British Journal of Sports Medicine</em>.
          </li>
        </ul>
        
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', fontSize: '0.9rem' }}>
          <strong>Note importante :</strong> Nos calculs se basent sur le <em>poids total</em> actuel. Si vous êtes en situation de fort surpoids ou d'obésité (IMC élevé), le calcul des protéines peut donner des objectifs très (voire trop) élevés à consommer. Dans ce cas spécifique, il est souvent préférable de calculer les protéines sur la base du "poids de forme" ou de consulter un professionnel de santé.
        </div>
      </div>
    </div>
  )
}
