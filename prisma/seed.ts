import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const foods = [
  // ── Viandes & volailles ────────────────────────────────────────
  { nom: 'Poulet (blanc, cuit)',         categorie: 'Viande',    kcalPer100g: 165, protPer100g: 31,   glucPer100g: 0,    lipPer100g: 3.6,  vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Poulet (cuisse, cuite)',       categorie: 'Viande',    kcalPer100g: 185, protPer100g: 26,   glucPer100g: 0,    lipPer100g: 9,    vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Poulet rôti',                 categorie: 'Viande',    kcalPer100g: 177, protPer100g: 27,   glucPer100g: 0,    lipPer100g: 7.5,  vegetarien: false, poidsUnitaire: 180 },
  { nom: 'Dinde (blanc, cuit)',          categorie: 'Viande',    kcalPer100g: 135, protPer100g: 30,   glucPer100g: 0,    lipPer100g: 1.5,  vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Boeuf haché 5% MG',           categorie: 'Viande',    kcalPer100g: 137, protPer100g: 21,   glucPer100g: 0,    lipPer100g: 5.5,  vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Steak de boeuf (cuit)',        categorie: 'Viande',    kcalPer100g: 215, protPer100g: 26,   glucPer100g: 0,    lipPer100g: 12,   vegetarien: false, poidsUnitaire: 180 },
  { nom: 'Veau (escalope, cuit)',        categorie: 'Viande',    kcalPer100g: 175, protPer100g: 30,   glucPer100g: 0,    lipPer100g: 5,    vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Agneau (gigot, cuit)',         categorie: 'Viande',    kcalPer100g: 234, protPer100g: 27,   glucPer100g: 0,    lipPer100g: 14,   vegetarien: false, poidsUnitaire: 180 },
  { nom: 'Porc (filet, cuit)',           categorie: 'Viande',    kcalPer100g: 143, protPer100g: 27,   glucPer100g: 0,    lipPer100g: 3.8,  vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Canard (magret, cuit)',        categorie: 'Viande',    kcalPer100g: 190, protPer100g: 28,   glucPer100g: 0,    lipPer100g: 8.5,  vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Lapin (cuit)',                 categorie: 'Viande',    kcalPer100g: 145, protPer100g: 26,   glucPer100g: 0,    lipPer100g: 4.2,  vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Jambon blanc (dégraissé)',     categorie: 'Viande',    kcalPer100g: 107, protPer100g: 18,   glucPer100g: 1.5,  lipPer100g: 3,    vegetarien: false, poidsUnitaire: 60  },
  { nom: 'Jambon cru (type serrano)',    categorie: 'Viande',    kcalPer100g: 196, protPer100g: 30,   glucPer100g: 0.5,  lipPer100g: 8,    vegetarien: false, poidsUnitaire: 30  },
  { nom: 'Bacon (tranches)',             categorie: 'Viande',    kcalPer100g: 303, protPer100g: 25,   glucPer100g: 0,    lipPer100g: 22,   vegetarien: false, poidsUnitaire: 30  },
  { nom: 'Foie de veau (cuit)',          categorie: 'Viande',    kcalPer100g: 140, protPer100g: 22,   glucPer100g: 4,    lipPer100g: 4,    vegetarien: false, poidsUnitaire: 150 },

  // ── Poissons & fruits de mer ───────────────────────────────────
  { nom: 'Thon en boîte (naturel)',                categorie: 'Poisson', kcalPer100g: 116, protPer100g: 26, glucPer100g: 0,   lipPer100g: 1,    vegetarien: false, poidsUnitaire: 140 },
  { nom: 'Thon en boîte (à la tomate)',            categorie: 'Poisson', kcalPer100g: 95,  protPer100g: 17, glucPer100g: 4,   lipPer100g: 1.5,  vegetarien: false, poidsUnitaire: 185 },
  { nom: 'Saumon (cuit)',                          categorie: 'Poisson', kcalPer100g: 206, protPer100g: 20, glucPer100g: 0,   lipPer100g: 13,   vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Cabillaud (cuit)',                       categorie: 'Poisson', kcalPer100g: 105, protPer100g: 23, glucPer100g: 0,   lipPer100g: 0.9,  vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Truite (cuite)',                         categorie: 'Poisson', kcalPer100g: 149, protPer100g: 22, glucPer100g: 0,   lipPer100g: 6.5,  vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Sardines en boîte (huile, égouttées)',   categorie: 'Poisson', kcalPer100g: 208, protPer100g: 25, glucPer100g: 0,   lipPer100g: 12,   vegetarien: false, poidsUnitaire: 100 },
  { nom: 'Sardines à la sauce tomate',             categorie: 'Poisson', kcalPer100g: 150, protPer100g: 18, glucPer100g: 3,   lipPer100g: 7,    vegetarien: false, poidsUnitaire: 120 },
  { nom: 'Maquereau (cuit)',                       categorie: 'Poisson', kcalPer100g: 232, protPer100g: 20, glucPer100g: 0,   lipPer100g: 16,   vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Anchois (en boîte)',                     categorie: 'Poisson', kcalPer100g: 210, protPer100g: 29, glucPer100g: 0,   lipPer100g: 10,   vegetarien: false, poidsUnitaire: 50  },
  { nom: 'Crevettes cuites',                      categorie: 'Poisson', kcalPer100g: 99,  protPer100g: 21, glucPer100g: 0,   lipPer100g: 1.1,  vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Moules cuites',                         categorie: 'Poisson', kcalPer100g: 86,  protPer100g: 14, glucPer100g: 3.7, lipPer100g: 2,    vegetarien: false, poidsUnitaire: 150 },
  { nom: 'Calmar (cuit)',                          categorie: 'Poisson', kcalPer100g: 92,  protPer100g: 17, glucPer100g: 1.5, lipPer100g: 1.4,  vegetarien: false, poidsUnitaire: 150 },

  // ── Œufs & produits laitiers ───────────────────────────────────
  { nom: 'Oeuf entier (cuit)',     categorie: 'Oeuf',    kcalPer100g: 147, protPer100g: 12.5, glucPer100g: 0.7, lipPer100g: 10,   vegetarien: true, poidsUnitaire: 60  },
  { nom: 'Blanc d\'oeuf (cuit)',   categorie: 'Oeuf',    kcalPer100g: 52,  protPer100g: 11,   glucPer100g: 0.7, lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 33  },
  { nom: 'Blanc d\'oeuf liquide',  categorie: 'Oeuf',    kcalPer100g: 47,  protPer100g: 10.8, glucPer100g: 0.8, lipPer100g: 0.1,  vegetarien: true, poidsUnitaire: 100 },
  { nom: 'Fromage blanc 0%',       categorie: 'Laitier', kcalPer100g: 45,  protPer100g: 8,    glucPer100g: 4,   lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Fromage blanc 3%',       categorie: 'Laitier', kcalPer100g: 58,  protPer100g: 8,    glucPer100g: 4,   lipPer100g: 1.5,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Fromage cottage',        categorie: 'Laitier', kcalPer100g: 98,  protPer100g: 11,   glucPer100g: 3.4, lipPer100g: 4.3,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Yaourt grec nature',     categorie: 'Laitier', kcalPer100g: 97,  protPer100g: 9,    glucPer100g: 3.6, lipPer100g: 5,    vegetarien: true, poidsUnitaire: 170 },
  { nom: 'Yaourt nature (0%)',     categorie: 'Laitier', kcalPer100g: 47,  protPer100g: 4.5,  glucPer100g: 6.5, lipPer100g: 0.1,  vegetarien: true, poidsUnitaire: 125 },
  { nom: 'Yaourt nature entier',   categorie: 'Laitier', kcalPer100g: 65,  protPer100g: 4,    glucPer100g: 5,   lipPer100g: 3.3,  vegetarien: true, poidsUnitaire: 125 },
  { nom: 'Yaourt aux fruits',      categorie: 'Laitier', kcalPer100g: 96,  protPer100g: 3.8,  glucPer100g: 17,  lipPer100g: 1.6,  vegetarien: true, poidsUnitaire: 125 },
  { nom: 'Yaourt protéiné',        categorie: 'Laitier', kcalPer100g: 72,  protPer100g: 11,   glucPer100g: 5,   lipPer100g: 0.3,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Skyr nature',            categorie: 'Laitier', kcalPer100g: 60,  protPer100g: 11,   glucPer100g: 4,   lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 170 },
  { nom: 'Kéfir nature',           categorie: 'Laitier', kcalPer100g: 61,  protPer100g: 3.4,  glucPer100g: 4.8, lipPer100g: 3.2,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Lait demi-écrémé',       categorie: 'Laitier', kcalPer100g: 46,  protPer100g: 3.2,  glucPer100g: 4.8, lipPer100g: 1.5,  vegetarien: true, poidsUnitaire: 250 },
  { nom: 'Lait entier',            categorie: 'Laitier', kcalPer100g: 64,  protPer100g: 3.2,  glucPer100g: 4.6, lipPer100g: 3.7,  vegetarien: true, poidsUnitaire: 250 },
  { nom: 'Lait écrémé',            categorie: 'Laitier', kcalPer100g: 35,  protPer100g: 3.5,  glucPer100g: 4.9, lipPer100g: 0.1,  vegetarien: true, poidsUnitaire: 250 },
  { nom: 'Ricotta',                categorie: 'Fromage', kcalPer100g: 174, protPer100g: 11,   glucPer100g: 3,   lipPer100g: 13,   vegetarien: true, poidsUnitaire: 125 },
  { nom: 'Emmental',               categorie: 'Fromage', kcalPer100g: 382, protPer100g: 28,   glucPer100g: 0.5, lipPer100g: 29,   vegetarien: true, poidsUnitaire: 30  },
  { nom: 'Parmesan',               categorie: 'Fromage', kcalPer100g: 431, protPer100g: 38,   glucPer100g: 0,   lipPer100g: 29,   vegetarien: true, poidsUnitaire: 20  },
  { nom: 'Mozzarella légère',      categorie: 'Fromage', kcalPer100g: 192, protPer100g: 18,   glucPer100g: 2,   lipPer100g: 12,   vegetarien: true, poidsUnitaire: 125 },
  { nom: 'Feta',                   categorie: 'Fromage', kcalPer100g: 264, protPer100g: 14,   glucPer100g: 1,   lipPer100g: 21,   vegetarien: true, poidsUnitaire: 50  },
  { nom: 'Brie',                   categorie: 'Fromage', kcalPer100g: 334, protPer100g: 21,   glucPer100g: 0,   lipPer100g: 28,   vegetarien: true, poidsUnitaire: 50  },
  { nom: 'Camembert',              categorie: 'Fromage', kcalPer100g: 299, protPer100g: 19,   glucPer100g: 0.5, lipPer100g: 24,   vegetarien: true, poidsUnitaire: 50  },
  { nom: 'Cheddar',                categorie: 'Fromage', kcalPer100g: 403, protPer100g: 25,   glucPer100g: 0.1, lipPer100g: 33,   vegetarien: true, poidsUnitaire: 30  },

  // ── Légumineuses ───────────────────────────────────────────────
  { nom: 'Lentilles cuites',        categorie: 'Légumineuse',      kcalPer100g: 116, protPer100g: 9,    glucPer100g: 20,  lipPer100g: 0.4,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Lentilles corail cuites', categorie: 'Légumineuse',      kcalPer100g: 100, protPer100g: 7.6,  glucPer100g: 17,  lipPer100g: 0.3,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Pois chiches cuits',      categorie: 'Légumineuse',      kcalPer100g: 164, protPer100g: 8.9,  glucPer100g: 27,  lipPer100g: 2.6,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Haricots rouges cuits',   categorie: 'Légumineuse',      kcalPer100g: 127, protPer100g: 8.7,  glucPer100g: 22,  lipPer100g: 0.5,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Haricots blancs cuits',   categorie: 'Légumineuse',      kcalPer100g: 140, protPer100g: 9.7,  glucPer100g: 25,  lipPer100g: 0.4,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Edamame (soja vert)',      categorie: 'Légumineuse',      kcalPer100g: 121, protPer100g: 11,   glucPer100g: 8.9, lipPer100g: 5.2,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Fèves cuites',            categorie: 'Légumineuse',      kcalPer100g: 88,  protPer100g: 7.9,  glucPer100g: 12,  lipPer100g: 0.5,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Tofu ferme',              categorie: 'Protéine végétale', kcalPer100g: 76,  protPer100g: 8.1,  glucPer100g: 1.9, lipPer100g: 4.2,  vegetarien: true, poidsUnitaire: 100 },
  { nom: 'Tempeh',                  categorie: 'Protéine végétale', kcalPer100g: 195, protPer100g: 19,   glucPer100g: 9,   lipPer100g: 11,   vegetarien: true, poidsUnitaire: 100 },
  { nom: 'Seitan',                  categorie: 'Protéine végétale', kcalPer100g: 143, protPer100g: 25,   glucPer100g: 7,   lipPer100g: 2,    vegetarien: true, poidsUnitaire: 100 },

  // ── Céréales & féculents ───────────────────────────────────────
  { nom: 'Riz blanc cuit',          categorie: 'Féculent', kcalPer100g: 130, protPer100g: 2.7,  glucPer100g: 28,  lipPer100g: 0.3,  vegetarien: true, poidsUnitaire: 180 },
  { nom: 'Riz complet cuit',        categorie: 'Féculent', kcalPer100g: 123, protPer100g: 2.7,  glucPer100g: 26,  lipPer100g: 0.9,  vegetarien: true, poidsUnitaire: 180 },
  { nom: 'Pâtes cuites (blé)',       categorie: 'Féculent', kcalPer100g: 158, protPer100g: 5.8,  glucPer100g: 31,  lipPer100g: 0.9,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Pâtes complètes cuites',   categorie: 'Féculent', kcalPer100g: 149, protPer100g: 6,    glucPer100g: 28,  lipPer100g: 1,    vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Quinoa cuit',             categorie: 'Féculent', kcalPer100g: 120, protPer100g: 4.4,  glucPer100g: 22,  lipPer100g: 1.9,  vegetarien: true, poidsUnitaire: 180 },
  { nom: 'Boulgour cuit',           categorie: 'Féculent', kcalPer100g: 83,  protPer100g: 3,    glucPer100g: 18,  lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 180 },
  { nom: 'Semoule cuite',           categorie: 'Féculent', kcalPer100g: 102, protPer100g: 3.3,  glucPer100g: 21,  lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 180 },
  { nom: 'Pomme de terre cuite',    categorie: 'Féculent', kcalPer100g: 87,  protPer100g: 1.9,  glucPer100g: 20,  lipPer100g: 0.1,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Flocons d\'avoine',       categorie: 'Céréale',  kcalPer100g: 370, protPer100g: 13,   glucPer100g: 60,  lipPer100g: 7,    vegetarien: true, poidsUnitaire: 60  },
  { nom: 'Pain complet',            categorie: 'Céréale',  kcalPer100g: 247, protPer100g: 9,    glucPer100g: 44,  lipPer100g: 3.5,  vegetarien: true, poidsUnitaire: 60  },
  { nom: 'Pain blanc',              categorie: 'Céréale',  kcalPer100g: 265, protPer100g: 9,    glucPer100g: 52,  lipPer100g: 2.5,  vegetarien: true, poidsUnitaire: 60  },
  { nom: 'Muesli (sans sucre)',      categorie: 'Céréale',  kcalPer100g: 370, protPer100g: 10,   glucPer100g: 60,  lipPer100g: 7,    vegetarien: true, poidsUnitaire: 50  },

  // ── Légumes ────────────────────────────────────────────────────
  { nom: 'Brocoli cuit',            categorie: 'Légume', kcalPer100g: 35,  protPer100g: 2.4,  glucPer100g: 6.6, lipPer100g: 0.4,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Épinards cuits',          categorie: 'Légume', kcalPer100g: 23,  protPer100g: 2.5,  glucPer100g: 3.8, lipPer100g: 0.4,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Petits pois cuits',       categorie: 'Légume', kcalPer100g: 84,  protPer100g: 5.4,  glucPer100g: 15,  lipPer100g: 0.4,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Maïs en boîte',           categorie: 'Légume', kcalPer100g: 86,  protPer100g: 2.9,  glucPer100g: 19,  lipPer100g: 1.2,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Haricots verts cuits',    categorie: 'Légume', kcalPer100g: 31,  protPer100g: 1.8,  glucPer100g: 7,   lipPer100g: 0.1,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Patate douce cuite',      categorie: 'Légume', kcalPer100g: 86,  protPer100g: 1.6,  glucPer100g: 20,  lipPer100g: 0.1,  vegetarien: true, poidsUnitaire: 180 },
  { nom: 'Carotte cuite',           categorie: 'Légume', kcalPer100g: 35,  protPer100g: 0.9,  glucPer100g: 7.1, lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Courgette cuite',         categorie: 'Légume', kcalPer100g: 16,  protPer100g: 1.1,  glucPer100g: 2.8, lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Tomate',                  categorie: 'Légume', kcalPer100g: 18,  protPer100g: 0.9,  glucPer100g: 3.1, lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 120 },
  { nom: 'Salade verte',            categorie: 'Légume', kcalPer100g: 14,  protPer100g: 1.4,  glucPer100g: 2.4, lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 100 },
  { nom: 'Concombre',               categorie: 'Légume', kcalPer100g: 16,  protPer100g: 0.7,  glucPer100g: 3.2, lipPer100g: 0.1,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Poivron rouge',           categorie: 'Légume', kcalPer100g: 31,  protPer100g: 1,    glucPer100g: 6,   lipPer100g: 0.3,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Champignons cuits',       categorie: 'Légume', kcalPer100g: 28,  protPer100g: 3.6,  glucPer100g: 2.3, lipPer100g: 0.5,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Aubergine cuite',         categorie: 'Légume', kcalPer100g: 24,  protPer100g: 0.8,  glucPer100g: 4.8, lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Chou-fleur cuit',         categorie: 'Légume', kcalPer100g: 23,  protPer100g: 2.3,  glucPer100g: 3.7, lipPer100g: 0.3,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Chou vert cuit',          categorie: 'Légume', kcalPer100g: 25,  protPer100g: 1.3,  glucPer100g: 4.5, lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Chou de Bruxelles cuit',  categorie: 'Légume', kcalPer100g: 36,  protPer100g: 3,    glucPer100g: 6,   lipPer100g: 0.4,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Asperges cuites',         categorie: 'Légume', kcalPer100g: 23,  protPer100g: 2.4,  glucPer100g: 3,   lipPer100g: 0.2,  vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Poireau cuit',            categorie: 'Légume', kcalPer100g: 31,  protPer100g: 1.5,  glucPer100g: 5.6, lipPer100g: 0.3,  vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Betterave cuite',         categorie: 'Légume', kcalPer100g: 43,  protPer100g: 1.7,  glucPer100g: 8.9, lipPer100g: 0.1,  vegetarien: true, poidsUnitaire: 120 },
  { nom: 'Avocat',                  categorie: 'Légume', kcalPer100g: 160, protPer100g: 2,    glucPer100g: 2,   lipPer100g: 15,   vegetarien: true, poidsUnitaire: 130 },

  // ── Fruits ─────────────────────────────────────────────────────
  { nom: 'Banane',       categorie: 'Fruit', kcalPer100g: 89,  protPer100g: 1.1, glucPer100g: 23,   lipPer100g: 0.3, vegetarien: true, poidsUnitaire: 120 },
  { nom: 'Pomme',        categorie: 'Fruit', kcalPer100g: 52,  protPer100g: 0.3, glucPer100g: 14,   lipPer100g: 0.2, vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Poire',        categorie: 'Fruit', kcalPer100g: 57,  protPer100g: 0.4, glucPer100g: 15.2, lipPer100g: 0.1, vegetarien: true, poidsUnitaire: 170 },
  { nom: 'Orange',       categorie: 'Fruit', kcalPer100g: 47,  protPer100g: 0.9, glucPer100g: 11.2, lipPer100g: 0.1, vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Fraise',       categorie: 'Fruit', kcalPer100g: 33,  protPer100g: 0.7, glucPer100g: 7.7,  lipPer100g: 0.3, vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Raisin',       categorie: 'Fruit', kcalPer100g: 72,  protPer100g: 0.6, glucPer100g: 17.8, lipPer100g: 0.2, vegetarien: true, poidsUnitaire: 120 },
  { nom: 'Mangue',       categorie: 'Fruit', kcalPer100g: 65,  protPer100g: 0.5, glucPer100g: 15,   lipPer100g: 0.3, vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Kiwi',         categorie: 'Fruit', kcalPer100g: 61,  protPer100g: 1.1, glucPer100g: 14.7, lipPer100g: 0.5, vegetarien: true, poidsUnitaire: 80  },
  { nom: 'Ananas',       categorie: 'Fruit', kcalPer100g: 50,  protPer100g: 0.5, glucPer100g: 12.2, lipPer100g: 0.1, vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Pastèque',     categorie: 'Fruit', kcalPer100g: 30,  protPer100g: 0.6, glucPer100g: 7.2,  lipPer100g: 0.1, vegetarien: true, poidsUnitaire: 300 },
  { nom: 'Pêche',        categorie: 'Fruit', kcalPer100g: 39,  protPer100g: 0.9, glucPer100g: 9.5,  lipPer100g: 0.1, vegetarien: true, poidsUnitaire: 150 },
  { nom: 'Melon',        categorie: 'Fruit', kcalPer100g: 34,  protPer100g: 0.8, glucPer100g: 7.9,  lipPer100g: 0.1, vegetarien: true, poidsUnitaire: 250 },
  { nom: 'Abricot',      categorie: 'Fruit', kcalPer100g: 48,  protPer100g: 1.4, glucPer100g: 10.6, lipPer100g: 0.1, vegetarien: true, poidsUnitaire: 60  },
  { nom: 'Myrtilles',    categorie: 'Fruit', kcalPer100g: 57,  protPer100g: 0.7, glucPer100g: 12.8, lipPer100g: 0.3, vegetarien: true, poidsUnitaire: 100 },
  { nom: 'Cerise',       categorie: 'Fruit', kcalPer100g: 63,  protPer100g: 1,   glucPer100g: 15,   lipPer100g: 0.2, vegetarien: true, poidsUnitaire: 100 },
  { nom: 'Citron',       categorie: 'Fruit', kcalPer100g: 29,  protPer100g: 1.1, glucPer100g: 9.3,  lipPer100g: 0.3, vegetarien: true, poidsUnitaire: 80  },

  // ── Oléagineux ─────────────────────────────────────────────────
  { nom: 'Amandes',               categorie: 'Oléagineux', kcalPer100g: 579, protPer100g: 21,  glucPer100g: 22, lipPer100g: 49,   vegetarien: true, poidsUnitaire: 30 },
  { nom: 'Noix',                  categorie: 'Oléagineux', kcalPer100g: 654, protPer100g: 15,  glucPer100g: 14, lipPer100g: 65,   vegetarien: true, poidsUnitaire: 30 },
  { nom: 'Noix de cajou',         categorie: 'Oléagineux', kcalPer100g: 553, protPer100g: 18,  glucPer100g: 30, lipPer100g: 44,   vegetarien: true, poidsUnitaire: 30 },
  { nom: 'Noisettes',             categorie: 'Oléagineux', kcalPer100g: 628, protPer100g: 15,  glucPer100g: 17, lipPer100g: 61,   vegetarien: true, poidsUnitaire: 30 },
  { nom: 'Pistaches',             categorie: 'Oléagineux', kcalPer100g: 562, protPer100g: 20,  glucPer100g: 28, lipPer100g: 45,   vegetarien: true, poidsUnitaire: 30 },
  { nom: 'Cacahuètes',            categorie: 'Oléagineux', kcalPer100g: 567, protPer100g: 26,  glucPer100g: 16, lipPer100g: 49,   vegetarien: true, poidsUnitaire: 30 },
  { nom: 'Graines de tournesol',  categorie: 'Oléagineux', kcalPer100g: 584, protPer100g: 21,  glucPer100g: 20, lipPer100g: 51,   vegetarien: true, poidsUnitaire: 30 },
  { nom: 'Graines de courge',     categorie: 'Oléagineux', kcalPer100g: 559, protPer100g: 30,  glucPer100g: 11, lipPer100g: 49,   vegetarien: true, poidsUnitaire: 30 },
  { nom: 'Graines de lin',        categorie: 'Oléagineux', kcalPer100g: 534, protPer100g: 18,  glucPer100g: 29, lipPer100g: 42,   vegetarien: true, poidsUnitaire: 15 },
  { nom: 'Graines de sésame',     categorie: 'Oléagineux', kcalPer100g: 573, protPer100g: 18,  glucPer100g: 23, lipPer100g: 50,   vegetarien: true, poidsUnitaire: 15 },
  { nom: 'Beurre de cacahuète',   categorie: 'Oléagineux', kcalPer100g: 588, protPer100g: 25,  glucPer100g: 20, lipPer100g: 50,   vegetarien: true, poidsUnitaire: 30 },

  // ── Suppléments ────────────────────────────────────────────────
  { nom: 'Protéine whey (poudre)',  categorie: 'Supplément', kcalPer100g: 380, protPer100g: 75,  glucPer100g: 8,  lipPer100g: 5,   vegetarien: true, poidsUnitaire: 30 },
  { nom: 'Protéine pois (poudre)', categorie: 'Supplément', kcalPer100g: 370, protPer100g: 78,  glucPer100g: 5,  lipPer100g: 4,   vegetarien: true, poidsUnitaire: 30 },
  { nom: 'Caséine (poudre)',       categorie: 'Supplément', kcalPer100g: 360, protPer100g: 80,  glucPer100g: 5,  lipPer100g: 1,   vegetarien: true, poidsUnitaire: 30 },

  // ── Corps gras ─────────────────────────────────────────────────
  { nom: 'Huile d\'olive',  categorie: 'Corps gras', kcalPer100g: 884, protPer100g: 0,   glucPer100g: 0,   lipPer100g: 100, vegetarien: true, poidsUnitaire: 10 },
  { nom: 'Huile de coco',   categorie: 'Corps gras', kcalPer100g: 900, protPer100g: 0,   glucPer100g: 0,   lipPer100g: 100, vegetarien: true, poidsUnitaire: 10 },
  { nom: 'Beurre',          categorie: 'Corps gras', kcalPer100g: 717, protPer100g: 0.9, glucPer100g: 0.1, lipPer100g: 81,  vegetarien: true, poidsUnitaire: 10 },

  // ── Boissons ───────────────────────────────────────────────────
  { nom: 'Jus d\'orange (pur jus)', categorie: 'Boisson', kcalPer100g: 45,  protPer100g: 0.7, glucPer100g: 10.4, lipPer100g: 0.2, vegetarien: true, poidsUnitaire: 200 },
  { nom: 'Lait d\'avoine',          categorie: 'Boisson', kcalPer100g: 46,  protPer100g: 1.3, glucPer100g: 9,    lipPer100g: 0.7, vegetarien: true, poidsUnitaire: 250 },
  { nom: 'Lait d\'amande',          categorie: 'Boisson', kcalPer100g: 24,  protPer100g: 0.5, glucPer100g: 3.7,  lipPer100g: 0.9, vegetarien: true, poidsUnitaire: 250 },
  { nom: 'Lait de soja',            categorie: 'Boisson', kcalPer100g: 39,  protPer100g: 3.3, glucPer100g: 2.6,  lipPer100g: 1.9, vegetarien: true, poidsUnitaire: 250 },
]

async function main() {
  console.log('Seeding foods...')
  for (const [i, food] of foods.entries()) {
    await prisma.food.upsert({
      where: { id: i + 1 },
      update: food,
      create: food,
    })
  }
  console.log(`Seeded ${foods.length} foods.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
