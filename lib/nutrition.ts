export type Sexe = 'homme' | 'femme'
export type NiveauActivite = 'sedentaire' | 'leger' | 'modere' | 'actif' | 'tres_actif'
export type Objectif = 'PERTE_POIDS' | 'MAINTIEN' | 'MUSCULATION'

const ACTIVITE_FACTEURS: Record<NiveauActivite, number> = {
  sedentaire: 1.2,
  leger: 1.375,
  modere: 1.55,
  actif: 1.725,
  tres_actif: 1.9,
}

export function calculerAge(dateNaissance: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dateNaissance.getFullYear()
  const m = today.getMonth() - dateNaissance.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dateNaissance.getDate())) age--
  return age
}

export function calculerBMR(poids: number, taille: number, age: number, sexe: Sexe): number {
  // Mifflin-St Jeor
  if (sexe === 'homme') {
    return 10 * poids + 6.25 * taille - 5 * age + 5
  }
  return 10 * poids + 6.25 * taille - 5 * age - 161
}

export function calculerTDEE(bmr: number, niveauActivite: NiveauActivite): number {
  return bmr * ACTIVITE_FACTEURS[niveauActivite]
}

export function calculerObjectifCalories(tdee: number, objectif: Objectif): number {
  switch (objectif) {
    case 'PERTE_POIDS':
      return Math.round(tdee * 0.82) // -18%
    case 'MUSCULATION':
      return Math.round(tdee * 1.1)
    default:
      return Math.round(tdee)
  }
}

export function calculerObjectifProteines(poids: number, objectif: Objectif, age: number): number {
  let facteur: number
  if (age >= 65) {
    facteur = 1.1
  } else if (age < 18) {
    facteur = 0.91
  } else {
    switch (objectif) {
      case 'PERTE_POIDS':
        facteur = 1.6
        break
      case 'MUSCULATION':
        facteur = 1.9
        break
      default:
        facteur = 0.83
    }
  }
  return Math.round(poids * facteur)
}

export function estApportProteinesEleve(poids: number, proteinesG: number): boolean {
  return proteinesG / poids > 2.2
}

export type BesoinsJour = {
  bmr: number
  tdee: number
  objectifKcal: number
  objectifProteinesG: number
  alerteProteinesElevees: boolean
}

export function calculerBesoins(
  poids: number,
  taille: number,
  dateNaissance: Date,
  sexe: Sexe,
  niveauActivite: NiveauActivite,
  objectif: Objectif
): BesoinsJour {
  const age = calculerAge(dateNaissance)
  const bmr = calculerBMR(poids, taille, age, sexe)
  const tdee = calculerTDEE(bmr, niveauActivite)
  const objectifKcal = calculerObjectifCalories(tdee, objectif)
  const objectifProteinesG = calculerObjectifProteines(poids, objectif, age)
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    objectifKcal,
    objectifProteinesG,
    alerteProteinesElevees: estApportProteinesEleve(poids, objectifProteinesG),
  }
}

export type TotauxRepas = {
  kcal: number
  proteines: number
  glucides: number
  lipides: number
}

export function calculerTotaux(
  entries: Array<{ quantite: number; food: { kcalPer100g: number; protPer100g: number; glucPer100g: number; lipPer100g: number } }>
): TotauxRepas {
  return entries.reduce(
    (acc, e) => {
      const ratio = e.quantite / 100
      return {
        kcal: acc.kcal + e.food.kcalPer100g * ratio,
        proteines: acc.proteines + e.food.protPer100g * ratio,
        glucides: acc.glucides + e.food.glucPer100g * ratio,
        lipides: acc.lipides + e.food.lipPer100g * ratio,
      }
    },
    { kcal: 0, proteines: 0, glucides: 0, lipides: 0 }
  )
}
