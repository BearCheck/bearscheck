import type { TunnelFormData, InsuranceResult } from "@/types/tunnel";
import { DEPARTEMENTS_COEFFICIENTS, getDepartementFromCodePostal } from "./vehicleData";

interface TarifBase {
  assureur: string;
  formule: "tiers" | "tiers_vol_incendie" | "tous_risques";
  baseMensuel: number;
  garanties: string[];
  franchise: number;
  satisfaction: number;
}

const TARIFS_BASE: TarifBase[] = [
  { assureur: "Direct Assurance", formule: "tiers", baseMensuel: 18, garanties: ["Responsabilité civile", "Défense pénale"], franchise: 500, satisfaction: 4.1 },
  { assureur: "Luko", formule: "tiers", baseMensuel: 19, garanties: ["Responsabilité civile", "Défense pénale", "Assistance"], franchise: 500, satisfaction: 4.3 },
  { assureur: "Lovys", formule: "tiers", baseMensuel: 17, garanties: ["Responsabilité civile", "Défense pénale"], franchise: 600, satisfaction: 4.2 },
  { assureur: "Amaguiz", formule: "tiers", baseMensuel: 16, garanties: ["Responsabilité civile"], franchise: 600, satisfaction: 3.9 },
  { assureur: "Macif", formule: "tiers", baseMensuel: 21, garanties: ["Responsabilité civile", "Défense pénale", "Assistance 0km"], franchise: 400, satisfaction: 4.4 },

  { assureur: "Axa", formule: "tiers_vol_incendie", baseMensuel: 28, garanties: ["Responsabilité civile", "Vol & Incendie", "Bris de glace", "Assistance"], franchise: 400, satisfaction: 4.2 },
  { assureur: "Allianz", formule: "tiers_vol_incendie", baseMensuel: 30, garanties: ["Responsabilité civile", "Vol & Incendie", "Bris de glace", "Assistance", "Protection juridique"], franchise: 350, satisfaction: 4.3 },
  { assureur: "Matmut", formule: "tiers_vol_incendie", baseMensuel: 27, garanties: ["Responsabilité civile", "Vol & Incendie", "Bris de glace"], franchise: 450, satisfaction: 4.1 },
  { assureur: "Maaf", formule: "tiers_vol_incendie", baseMensuel: 26, garanties: ["Responsabilité civile", "Vol & Incendie", "Assistance"], franchise: 500, satisfaction: 4.0 },

  { assureur: "MAIF", formule: "tous_risques", baseMensuel: 48, garanties: ["Responsabilité civile", "Tous risques", "Bris de glace", "Assistance 0km", "Véhicule de remplacement", "Protection juridique", "Garantie conducteur"], franchise: 300, satisfaction: 4.7 },
  { assureur: "Groupama", formule: "tous_risques", baseMensuel: 52, garanties: ["Responsabilité civile", "Tous risques", "Bris de glace", "Assistance 0km", "Protection juridique", "Garantie conducteur"], franchise: 250, satisfaction: 4.5 },
  { assureur: "GMF", formule: "tous_risques", baseMensuel: 46, garanties: ["Responsabilité civile", "Tous risques", "Bris de glace", "Assistance 0km", "Garantie conducteur"], franchise: 350, satisfaction: 4.4 },
  { assureur: "Generali", formule: "tous_risques", baseMensuel: 50, garanties: ["Responsabilité civile", "Tous risques", "Bris de glace", "Assistance 0km", "Protection juridique", "Véhicule de remplacement", "Garantie conducteur"], franchise: 300, satisfaction: 4.3 },
  { assureur: "MMA", formule: "tous_risques", baseMensuel: 45, garanties: ["Responsabilité civile", "Tous risques", "Bris de glace", "Assistance 0km", "Protection juridique"], franchise: 350, satisfaction: 4.2 },
];

function getAgeCoefficient(dateNaissance: string): number {
  const age = new Date().getFullYear() - new Date(dateNaissance).getFullYear();
  if (age < 25) return 1.5;
  if (age < 30) return 1.2;
  if (age > 70) return 1.15;
  return 1.0;
}

function getBonusMalusCoefficient(bm: number): number {
  return bm;
}

function getSinistresCoefficient(sinistres: TunnelFormData["sinistres"]): number {
  switch (sinistres) {
    case "aucun": return 1.0;
    case "non_responsable": return 1.0;
    case "1_responsable": return 1.35;
    case "2plus": return 1.80;
    default: return 1.0;
  }
}

function getKilometrageCoefficient(km: TunnelFormData["kilometrageAnnuel"]): number {
  switch (km) {
    case "lt5000": return 0.85;
    case "5000-10000": return 0.90;
    case "10000-15000": return 1.00;
    case "15000-20000": return 1.10;
    case "gt20000": return 1.25;
    default: return 1.0;
  }
}

function getVehiculeCoefficient(annee: number, valeur: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - annee;
  let coef = 1.0;
  if (age > 15) coef *= 0.85;
  else if (age > 10) coef *= 0.90;
  if (valeur > 30000) coef *= 1.30;
  else if (valeur > 20000) coef *= 1.15;
  else if (valeur > 10000) coef *= 1.05;
  return coef;
}

function getCarburantCoefficient(carburant: TunnelFormData["carburant"]): number {
  if (carburant === "electrique") return 1.10;
  return 1.0;
}

function getZoneCoefficient(codePostal?: string): number {
  if (!codePostal) return 1.0;
  const dept = getDepartementFromCodePostal(codePostal);
  return DEPARTEMENTS_COEFFICIENTS[dept] ?? DEPARTEMENTS_COEFFICIENTS["default"];
}

function addOptionsCost(base: number, formData: TunnelFormData): number {
  let extra = 0;
  if (formData.garantiesBrisGlace) extra += 3;
  if (formData.garantiesAssistance0km) extra += 2;
  if (formData.garantiesProtectionJuridique) extra += 2.5;
  if (formData.garantiesGarantieConducteur) extra += 3;
  if (formData.garantiesVehiculeRemplacement) extra += 4;
  if (formData.garantiesAuKilometre) extra -= 5;
  return base + extra;
}

function filterByFormule(tarif: TarifBase, formuleMin?: TunnelFormData["formuleMin"]): boolean {
  if (!formuleMin || formuleMin === "tiers") return true;
  if (formuleMin === "tiers_vol_incendie") return tarif.formule !== "tiers";
  if (formuleMin === "tous_risques") return tarif.formule === "tous_risques";
  return true;
}

function assignBadge(results: InsuranceResult[]): InsuranceResult[] {
  if (results.length === 0) return results;
  const sorted = [...results].sort((a, b) => a.prixMensuel - b.prixMensuel);
  const cheapestId = sorted[0].id;

  return results.map((r) => {
    if (r.id === cheapestId) return { ...r, badge: "cheapest" as const };
    if (r.satisfaction && r.satisfaction >= 4.5) return { ...r, badge: "best_value" as const };
    return r;
  });
}

export function calculateQuotes(formData: TunnelFormData): InsuranceResult[] {
  const ageCo = formData.dateNaissance ? getAgeCoefficient(formData.dateNaissance) : 1.0;
  const bmCo = formData.bonusMalus ? getBonusMalusCoefficient(formData.bonusMalus) : 1.0;
  const sinCo = getSinistresCoefficient(formData.sinistres);
  const kmCo = getKilometrageCoefficient(formData.kilometrageAnnuel);
  const vehicCo = getVehiculeCoefficient(
    formData.annee ?? new Date().getFullYear() - 5,
    formData.valeurAchat ?? 10000
  );
  const carCo = getCarburantCoefficient(formData.carburant);
  const zoneCo = getZoneCoefficient(formData.codePostal);

  const globalCoef = ageCo * bmCo * sinCo * kmCo * vehicCo * carCo * zoneCo;

  const results: InsuranceResult[] = TARIFS_BASE
    .filter((t) => filterByFormule(t, formData.formuleMin))
    .map((tarif, index) => {
      const baseCalculated = tarif.baseMensuel * globalCoef;
      const withOptions = addOptionsCost(baseCalculated, formData);
      const randomVariation = 0.95 + Math.random() * 0.10;
      const prixMensuel = Math.round(withOptions * randomVariation * 100) / 100;

      return {
        id: `result-${index}`,
        assureur: tarif.assureur,
        formule: tarif.formule === "tiers" ? "Responsabilité Civile (Tiers)"
          : tarif.formule === "tiers_vol_incendie" ? "Tiers + Vol & Incendie"
          : "Tous Risques",
        garanties: tarif.garanties,
        prixMensuel,
        prixAnnuel: Math.round(prixMensuel * 12 * 100) / 100,
        franchise: tarif.franchise,
        satisfaction: tarif.satisfaction,
        isEstimate: true as const,
        badge: undefined,
      };
    })
    .sort((a, b) => a.prixMensuel - b.prixMensuel);

  return assignBadge(results);
}
