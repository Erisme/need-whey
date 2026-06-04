CREATE TABLE IF NOT EXISTS "User" (
  "id"           INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name"         TEXT     NOT NULL,
  "email"        TEXT     NOT NULL,
  "passwordHash" TEXT     NOT NULL,
  "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Profile" (
  "id"             INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
  "userId"         INTEGER  NOT NULL,
  "sexe"           TEXT     NOT NULL,
  "dateNaissance"  DATETIME NOT NULL,
  "taille"         REAL     NOT NULL,
  "poids"          REAL     NOT NULL,
  "niveauActivite" TEXT     NOT NULL,
  "objectif"       TEXT     NOT NULL,
  "vegetarien"     BOOLEAN  NOT NULL DEFAULT 0,
  "updatedAt"      DATETIME NOT NULL,
  CONSTRAINT "Profile_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Profile_userId_key" ON "Profile"("userId");

CREATE TABLE IF NOT EXISTS "Food" (
  "id"             INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "nom"            TEXT    NOT NULL,
  "categorie"      TEXT    NOT NULL,
  "kcalPer100g"    REAL    NOT NULL,
  "protPer100g"    REAL    NOT NULL,
  "glucPer100g"    REAL    NOT NULL,
  "lipPer100g"     REAL    NOT NULL,
  "vegetarien"     BOOLEAN NOT NULL DEFAULT 0,
  "poidsUnitaire"  REAL    NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS "MealEntry" (
  "id"        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
  "userId"    INTEGER  NOT NULL,
  "foodId"    INTEGER  NOT NULL,
  "date"      DATETIME NOT NULL,
  "moment"    TEXT     NOT NULL,
  "quantite"  REAL     NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MealEntry_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "MealEntry_foodId_fkey"
    FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT
);
