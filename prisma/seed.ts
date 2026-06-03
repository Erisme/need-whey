import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const foods = [
  // Viandes & volailles
  { nom: 'Poulet (blanc, cuit)', categorie: 'Viande', kcalPer100g: 165, protPer100g: 31, glucPer100g: 0, lipPer100g: 3.6, vegetarien: false },
  { nom: 'Dinde (blanc, cuit)', categorie: 'Viande', kcalPer100g: 135, protPer100g: 30, glucPer100g: 0, lipPer100g: 1.5, vegetarien: false },
  { nom: 'Boeuf haché 5% MG', categorie: 'Viande', kcalPer100g: 137, protPer100g: 21, glucPer100g: 0, lipPer100g: 5.5, vegetarien: false },
  { nom: 'Steak de boeuf (cuit)', categorie: 'Viande', kcalPer100g: 215, protPer100g: 26, glucPer100g: 0, lipPer100g: 12, vegetarien: false },
  { nom: 'Porc (filet, cuit)', categorie: 'Viande', kcalPer100g: 143, protPer100g: 27, glucPer100g: 0, lipPer100g: 3.8, vegetarien: false },
  { nom: 'Jambon blanc (dégraissé)', categorie: 'Viande', kcalPer100g: 107, protPer100g: 18, glucPer100g: 1.5, lipPer100g: 3, vegetarien: false },

  // Poissons & fruits de mer
  { nom: 'Thon en boîte (naturel)', categorie: 'Poisson', kcalPer100g: 116, protPer100g: 26, glucPer100g: 0, lipPer100g: 1, vegetarien: false },
  { nom: 'Saumon (cuit)', categorie: 'Poisson', kcalPer100g: 206, protPer100g: 20, glucPer100g: 0, lipPer100g: 13, vegetarien: false },
  { nom: 'Cabillaud (cuit)', categorie: 'Poisson', kcalPer100g: 105, protPer100g: 23, glucPer100g: 0, lipPer100g: 0.9, vegetarien: false },
  { nom: 'Crevettes cuites', categorie: 'Poisson', kcalPer100g: 99, protPer100g: 21, glucPer100g: 0, lipPer100g: 1.1, vegetarien: false },
  { nom: 'Sardines en boîte (huile, égouttées)', categorie: 'Poisson', kcalPer100g: 208, protPer100g: 25, glucPer100g: 0, lipPer100g: 12, vegetarien: false },
  { nom: 'Maquereau (cuit)', categorie: 'Poisson', kcalPer100g: 232, protPer100g: 20, glucPer100g: 0, lipPer100g: 16, vegetarien: false },

  // Oeufs & produits laitiers
  { nom: 'Oeuf entier (cuit)', categorie: 'Oeuf', kcalPer100g: 147, protPer100g: 12.5, glucPer100g: 0.7, lipPer100g: 10, vegetarien: true },
  { nom: 'Blanc d\'oeuf (cuit)', categorie: 'Oeuf', kcalPer100g: 52, protPer100g: 11, glucPer100g: 0.7, lipPer100g: 0.2, vegetarien: true },
  { nom: 'Fromage blanc 0%', categorie: 'Laitier', kcalPer100g: 45, protPer100g: 8, glucPer100g: 4, lipPer100g: 0.2, vegetarien: true },
  { nom: 'Yaourt grec nature', categorie: 'Laitier', kcalPer100g: 97, protPer100g: 9, glucPer100g: 3.6, lipPer100g: 5, vegetarien: true },
  { nom: 'Fromage cottage', categorie: 'Laitier', kcalPer100g: 98, protPer100g: 11, glucPer100g: 3.4, lipPer100g: 4.3, vegetarien: true },
  { nom: 'Skyr nature', categorie: 'Laitier', kcalPer100g: 60, protPer100g: 11, glucPer100g: 4, lipPer100g: 0.2, vegetarien: true },
  { nom: 'Lait demi-écrémé', categorie: 'Laitier', kcalPer100g: 46, protPer100g: 3.2, glucPer100g: 4.8, lipPer100g: 1.5, vegetarien: true },
  { nom: 'Emmental', categorie: 'Fromage', kcalPer100g: 382, protPer100g: 28, glucPer100g: 0.5, lipPer100g: 29, vegetarien: true },
  { nom: 'Mozzarella légère', categorie: 'Fromage', kcalPer100g: 192, protPer100g: 18, glucPer100g: 2, lipPer100g: 12, vegetarien: true },

  // Légumineuses (végétariennes)
  { nom: 'Lentilles cuites', categorie: 'Légumineuse', kcalPer100g: 116, protPer100g: 9, glucPer100g: 20, lipPer100g: 0.4, vegetarien: true },
  { nom: 'Pois chiches cuits', categorie: 'Légumineuse', kcalPer100g: 164, protPer100g: 8.9, glucPer100g: 27, lipPer100g: 2.6, vegetarien: true },
  { nom: 'Haricots rouges cuits', categorie: 'Légumineuse', kcalPer100g: 127, protPer100g: 8.7, glucPer100g: 22, lipPer100g: 0.5, vegetarien: true },
  { nom: 'Edamame (soja vert)', categorie: 'Légumineuse', kcalPer100g: 121, protPer100g: 11, glucPer100g: 8.9, lipPer100g: 5.2, vegetarien: true },
  { nom: 'Tofu ferme', categorie: 'Protéine végétale', kcalPer100g: 76, protPer100g: 8.1, glucPer100g: 1.9, lipPer100g: 4.2, vegetarien: true },
  { nom: 'Tempeh', categorie: 'Protéine végétale', kcalPer100g: 195, protPer100g: 19, glucPer100g: 9, lipPer100g: 11, vegetarien: true },
  { nom: 'Seitan', categorie: 'Protéine végétale', kcalPer100g: 143, protPer100g: 25, glucPer100g: 7, lipPer100g: 2, vegetarien: true },

  // Oléagineux (végétariens)
  { nom: 'Amandes', categorie: 'Oléagineux', kcalPer100g: 579, protPer100g: 21, glucPer100g: 22, lipPer100g: 49, vegetarien: true },
  { nom: 'Graines de tournesol', categorie: 'Oléagineux', kcalPer100g: 584, protPer100g: 21, glucPer100g: 20, lipPer100g: 51, vegetarien: true },
  { nom: 'Graines de courge', categorie: 'Oléagineux', kcalPer100g: 559, protPer100g: 30, glucPer100g: 11, lipPer100g: 49, vegetarien: true },

  // Céréales & féculents
  { nom: 'Riz blanc cuit', categorie: 'Féculent', kcalPer100g: 130, protPer100g: 2.7, glucPer100g: 28, lipPer100g: 0.3, vegetarien: true },
  { nom: 'Pâtes cuites (blé)', categorie: 'Féculent', kcalPer100g: 158, protPer100g: 5.8, glucPer100g: 31, lipPer100g: 0.9, vegetarien: true },
  { nom: 'Quinoa cuit', categorie: 'Féculent', kcalPer100g: 120, protPer100g: 4.4, glucPer100g: 22, lipPer100g: 1.9, vegetarien: true },
  { nom: 'Flocons d\'avoine', categorie: 'Céréale', kcalPer100g: 370, protPer100g: 13, glucPer100g: 60, lipPer100g: 7, vegetarien: true },
  { nom: 'Pain complet', categorie: 'Céréale', kcalPer100g: 247, protPer100g: 9, glucPer100g: 44, lipPer100g: 3.5, vegetarien: true },
  { nom: 'Boulgour cuit', categorie: 'Féculent', kcalPer100g: 83, protPer100g: 3, glucPer100g: 18, lipPer100g: 0.2, vegetarien: true },

  // Légumes
  { nom: 'Brocoli cuit', categorie: 'Légume', kcalPer100g: 35, protPer100g: 2.4, glucPer100g: 6.6, lipPer100g: 0.4, vegetarien: true },
  { nom: 'Épinards cuits', categorie: 'Légume', kcalPer100g: 23, protPer100g: 2.5, glucPer100g: 3.8, lipPer100g: 0.4, vegetarien: true },
  { nom: 'Petits pois cuits', categorie: 'Légume', kcalPer100g: 84, protPer100g: 5.4, glucPer100g: 15, lipPer100g: 0.4, vegetarien: true },
  { nom: 'Maïs en boîte', categorie: 'Légume', kcalPer100g: 86, protPer100g: 2.9, glucPer100g: 19, lipPer100g: 1.2, vegetarien: true },
  { nom: 'Haricots verts cuits', categorie: 'Légume', kcalPer100g: 31, protPer100g: 1.8, glucPer100g: 7, lipPer100g: 0.1, vegetarien: true },
  { nom: 'Patate douce cuite', categorie: 'Légume', kcalPer100g: 86, protPer100g: 1.6, glucPer100g: 20, lipPer100g: 0.1, vegetarien: true },

  // Fruits
  { nom: 'Banane', categorie: 'Fruit', kcalPer100g: 89, protPer100g: 1.1, glucPer100g: 23, lipPer100g: 0.3, vegetarien: true },
  { nom: 'Pomme', categorie: 'Fruit', kcalPer100g: 52, protPer100g: 0.3, glucPer100g: 14, lipPer100g: 0.2, vegetarien: true },

  // Suppléments alimentaires courants
  { nom: 'Protéine whey (poudre)', categorie: 'Supplément', kcalPer100g: 380, protPer100g: 75, glucPer100g: 8, lipPer100g: 5, vegetarien: true },
  { nom: 'Protéine pois (poudre)', categorie: 'Supplément', kcalPer100g: 370, protPer100g: 78, glucPer100g: 5, lipPer100g: 4, vegetarien: true },

  // Corps gras
  { nom: 'Huile d\'olive', categorie: 'Corps gras', kcalPer100g: 884, protPer100g: 0, glucPer100g: 0, lipPer100g: 100, vegetarien: true },
  { nom: 'Beurre', categorie: 'Corps gras', kcalPer100g: 717, protPer100g: 0.9, glucPer100g: 0.1, lipPer100g: 81, vegetarien: true },
]

async function main() {
  console.log('Seeding foods...')
  for (const food of foods) {
    await prisma.food.upsert({
      where: { id: foods.indexOf(food) + 1 },
      update: food,
      create: food,
    })
  }
  console.log(`Seeded ${foods.length} foods.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
