import { calculateQuotes } from "@/lib/pricingEngine";
import type { TunnelFormData } from "@/types/tunnel";

const BASE_FORM_DATA: TunnelFormData = {
  marque: "Renault",
  modele: "Clio",
  annee: 2020,
  carburant: "essence",
  puissanceFiscale: 6,
  valeurAchat: 12000,
  usage: "domicile_travail",
  kilometrageAnnuel: "10000-15000",
  codePostal: "75001",
  departement: "75",
  dateNaissance: "1990-01-01",
  bonusMalus: 0.8,
  sinistres: "aucun",
  formuleMin: "tiers",
};

describe("calculateQuotes", () => {
  it("retourne au moins un résultat", () => {
    const results = calculateQuotes(BASE_FORM_DATA);
    expect(results.length).toBeGreaterThan(0);
  });

  it("résultats triés par prix croissant", () => {
    const results = calculateQuotes(BASE_FORM_DATA);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].prixMensuel).toBeGreaterThanOrEqual(results[i - 1].prixMensuel);
    }
  });

  it("isEstimate toujours true", () => {
    const results = calculateQuotes(BASE_FORM_DATA);
    results.forEach((r) => expect(r.isEstimate).toBe(true));
  });

  it("prixAnnuel cohérent avec prixMensuel (±5% pour l'arrondi)", () => {
    const results = calculateQuotes(BASE_FORM_DATA);
    results.forEach((r) => {
      const expected = r.prixMensuel * 12;
      expect(r.prixAnnuel).toBeCloseTo(expected, 0);
    });
  });

  it("assigne le badge cheapest au résultat le moins cher", () => {
    const results = calculateQuotes(BASE_FORM_DATA);
    const cheapest = results.reduce((min, r) => (r.prixMensuel < min.prixMensuel ? r : min));
    expect(cheapest.badge).toBe("cheapest");
  });

  it("filtre formuleMin tous_risques : renvoie seulement des tous risques", () => {
    const results = calculateQuotes({ ...BASE_FORM_DATA, formuleMin: "tous_risques" });
    results.forEach((r) => {
      expect(r.formule).toBe("Tous Risques");
    });
  });

  it("filtre formuleMin tiers_vol_incendie : exclut les tiers simples", () => {
    const results = calculateQuotes({ ...BASE_FORM_DATA, formuleMin: "tiers_vol_incendie" });
    results.forEach((r) => {
      expect(r.formule).not.toBe("Responsabilité Civile (Tiers)");
    });
  });

  it("majoration sinistres 2plus > sinistres aucun", () => {
    const sans = calculateQuotes({ ...BASE_FORM_DATA, sinistres: "aucun" });
    const avec = calculateQuotes({ ...BASE_FORM_DATA, sinistres: "2plus" });
    const moyenneSans = sans.reduce((s, r) => s + r.prixMensuel, 0) / sans.length;
    const moyenneAvec = avec.reduce((s, r) => s + r.prixMensuel, 0) / avec.length;
    expect(moyenneAvec).toBeGreaterThan(moyenneSans);
  });

  it("conducteur jeune (< 25 ans) paie plus qu'un conducteur expérimenté", () => {
    const jeune = calculateQuotes({ ...BASE_FORM_DATA, dateNaissance: new Date().getFullYear() - 22 + "-01-01" });
    const adulte = calculateQuotes({ ...BASE_FORM_DATA, dateNaissance: new Date().getFullYear() - 40 + "-01-01" });
    const mJeune = jeune.reduce((s, r) => s + r.prixMensuel, 0) / jeune.length;
    const mAdulte = adulte.reduce((s, r) => s + r.prixMensuel, 0) / adulte.length;
    expect(mJeune).toBeGreaterThan(mAdulte);
  });

  it("options supplémentaires augmentent le prix", () => {
    const sans = calculateQuotes(BASE_FORM_DATA);
    const avec = calculateQuotes({
      ...BASE_FORM_DATA,
      garantiesBrisGlace: true,
      garantiesAssistance0km: true,
      garantiesProtectionJuridique: true,
      garantiesGarantieConducteur: true,
    });
    const mSans = sans.reduce((s, r) => s + r.prixMensuel, 0) / sans.length;
    const mAvec = avec.reduce((s, r) => s + r.prixMensuel, 0) / avec.length;
    expect(mAvec).toBeGreaterThan(mSans);
  });

  it("données vides ne lèvent pas d'exception", () => {
    expect(() => calculateQuotes({})).not.toThrow();
  });

  it("chaque résultat a un id unique", () => {
    const results = calculateQuotes(BASE_FORM_DATA);
    const ids = results.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("franchise toujours positive", () => {
    const results = calculateQuotes(BASE_FORM_DATA);
    results.forEach((r) => expect(r.franchise).toBeGreaterThan(0));
  });
});
