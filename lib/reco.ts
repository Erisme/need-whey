import type { Food } from '@prisma/client'

export type SuggestionAliment = {
  food: Food
  quantiteG: number
  proteinesApportees: number
  kcalApportees: number
}

/**
 * Algorithme glouton par densité protéique (prot/kcal).
 * Propose des aliments pour combler le déficit en protéines
 * sans dépasser le plafond calorique restant.
 */
export function calculerRecommandations(
  foods: Food[],
  proteinesManquantesG: number,
  kcalRestantes: number,
  vegetarien: boolean
): SuggestionAliment[] {
  const candidats = foods
    .filter((f) => !vegetarien || f.vegetarien)
    .filter((f) => f.protPer100g > 0 && f.kcalPer100g > 0)
    .sort((a, b) => b.protPer100g / b.kcalPer100g - a.protPer100g / a.kcalPer100g)

  const suggestions: SuggestionAliment[] = []
  let proteinesRestantes = proteinesManquantesG
  let kcalDisponibles = kcalRestantes

  for (const food of candidats) {
    if (proteinesRestantes <= 0 || kcalDisponibles <= 0) break

    const kcalPour100g = food.kcalPer100g
    const protPour100g = food.protPer100g

    // Quelle quantité faut-il pour couvrir les protéines restantes ?
    const gParProteine = 100 / protPour100g
    const gNecessaires = proteinesRestantes * gParProteine

    // Limiter par les calories disponibles
    const gMaxParKcal = (kcalDisponibles / kcalPour100g) * 100
    const quantiteG = Math.min(gNecessaires, gMaxParKcal)

    if (quantiteG < 10) continue // ignorer les portions trop petites

    const proteinesApportees = (quantiteG / 100) * protPour100g
    const kcalApportees = (quantiteG / 100) * kcalPour100g

    suggestions.push({
      food,
      quantiteG: Math.round(quantiteG),
      proteinesApportees: Math.round(proteinesApportees * 10) / 10,
      kcalApportees: Math.round(kcalApportees),
    })

    proteinesRestantes -= proteinesApportees
    kcalDisponibles -= kcalApportees
  }

  return suggestions
}
