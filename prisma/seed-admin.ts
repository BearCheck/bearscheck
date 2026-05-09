import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  const now = new Date();

  // Dépenses
  const depenses = [
    { titre: "Vercel Pro", montant: 20, categorie: "HEBERGEMENT" as const, type: "MENSUEL" as const, recurrent: true, dateDepense: new Date(now.getFullYear(), now.getMonth(), 1) },
    { titre: "Supabase", montant: 25, categorie: "HEBERGEMENT" as const, type: "MENSUEL" as const, recurrent: true, dateDepense: new Date(now.getFullYear(), now.getMonth(), 1) },
    { titre: "Domaine bearscheck.fr", montant: 15, categorie: "DOMAINE" as const, type: "EXCEPTIONNEL" as const, recurrent: false, dateDepense: new Date(now.getFullYear(), 0, 15) },
    { titre: "Domiciliation Marseille", montant: 19, categorie: "DOMICILIATION" as const, type: "MENSUEL" as const, recurrent: true, dateDepense: new Date(now.getFullYear(), now.getMonth(), 1) },
    { titre: "Claude Pro", montant: 18, categorie: "LOGICIELS" as const, type: "MENSUEL" as const, recurrent: true, dateDepense: new Date(now.getFullYear(), now.getMonth(), 1) },
    { titre: "Inscription ORIAS", montant: 25, categorie: "ORIAS" as const, type: "EXCEPTIONNEL" as const, recurrent: false, dateDepense: new Date(now.getFullYear(), 0, 10) },
    { titre: "Figma", montant: 15, categorie: "LOGICIELS" as const, type: "MENSUEL" as const, recurrent: true, dateDepense: new Date(now.getFullYear(), now.getMonth() - 1, 1) },
  ];

  for (const d of depenses) {
    await prisma.expense.create({ data: d });
  }
  console.log(`✅ ${depenses.length} dépenses créées`);

  // Revenus
  const revenus = [
    { titre: "Commission Direct Assurance — Janvier", montant: 350, source: "Commission", dateRevenu: new Date(now.getFullYear(), 0, 31) },
    { titre: "Affiliation Groupama", montant: 120, source: "Affiliation", dateRevenu: new Date(now.getFullYear(), 1, 28) },
    { titre: "Commission Direct Assurance — Février", montant: 480, source: "Commission", dateRevenu: new Date(now.getFullYear(), 1, 28) },
  ];

  for (const r of revenus) {
    await prisma.revenue.create({ data: r });
  }
  console.log(`✅ ${revenus.length} revenus créés`);

  // Tâches roadmap
  const taches = [
    { titre: "Obtenir numéro ORIAS", priorite: "CRITIQUE" as const, statut: "EN_COURS" as const, dureeEstimee: 40, progression: 35, tags: ["administratif", "légal"], description: "Dossier en cours de traitement par l'ORIAS" },
    { titre: "Intégrer API Direct Assurance", priorite: "HAUTE" as const, statut: "A_FAIRE" as const, dureeEstimee: 20, progression: 0, tags: ["technique", "api"] },
    { titre: "Configurer Cloudflare", priorite: "HAUTE" as const, statut: "TERMINE" as const, dureeEstimee: 2, progression: 100, tags: ["infra", "sécurité"] },
    { titre: "Rédiger CGV et CGU", priorite: "HAUTE" as const, statut: "A_FAIRE" as const, dureeEstimee: 8, progression: 0, tags: ["légal"] },
    { titre: "Lancer campagne Google Ads", priorite: "MOYENNE" as const, statut: "A_FAIRE" as const, dureeEstimee: 15, progression: 0, tags: ["marketing"] },
    { titre: "Dashboard admin V2", priorite: "HAUTE" as const, statut: "TERMINE" as const, dureeEstimee: 30, progression: 100, tags: ["technique", "admin"] },
  ];

  for (let i = 0; i < taches.length; i++) {
    await prisma.roadmapTask.create({ data: { ...taches[i], ordre: i + 1 } });
  }
  console.log(`✅ ${taches.length} tâches créées`);

  // Événements calendrier
  const evenements = [
    { titre: "Déclaration T1 URSSAF", categorie: "FISCAL" as const, dateDebut: new Date("2026-04-30"), allDay: true, couleur: "#C9A84C" },
    { titre: "Déclaration T2 URSSAF", categorie: "FISCAL" as const, dateDebut: new Date("2026-07-31"), allDay: true, couleur: "#C9A84C" },
    { titre: "Déclaration T3 URSSAF", categorie: "FISCAL" as const, dateDebut: new Date("2026-10-31"), allDay: true, couleur: "#C9A84C" },
    { titre: "Déclaration T4 URSSAF", categorie: "FISCAL" as const, dateDebut: new Date("2027-01-31"), allDay: true, couleur: "#C9A84C" },
    { titre: "Renouvellement ORIAS", categorie: "ADMINISTRATIF" as const, dateDebut: new Date("2027-01-01"), allDay: true, couleur: "#8B5CF6" },
    { titre: "Revue mensuelle produit", categorie: "REUNION" as const, dateDebut: new Date(now.getFullYear(), now.getMonth(), 15, 10, 0), allDay: false, couleur: "#3B82F6" },
  ];

  for (const e of evenements) {
    await prisma.calendarEvent.create({ data: e });
  }
  console.log(`✅ ${evenements.length} événements créés`);

  console.log("\n🐻 Seed admin terminé avec succès !");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
