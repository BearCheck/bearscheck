export interface TunnelFormData {
  // Étape 0
  intention?: "new" | "switch" | "compare";

  // Étape 1 — Véhicule
  marque?: string;
  modele?: string;
  finition?: string;
  annee?: number;
  carburant?: "essence" | "diesel" | "hybride" | "electrique" | "gpl";
  puissanceFiscale?: number;
  valeurAchat?: number;

  // Étape 2 — Utilisation
  usage?: "domicile_travail" | "prive" | "professionnel";
  stationnement?: "garage" | "parking_prive" | "rue" | "parking_public";
  kilometrageAnnuel?: "lt5000" | "5000-10000" | "10000-15000" | "15000-20000" | "gt20000";
  codePostal?: string;
  departement?: string;

  // Étape 3 — Conducteur principal
  dateNaissance?: string;
  situation?: "proprietaire" | "locataire";
  datePermis?: string;
  vehiculeANom?: boolean;

  // Étape 4 — Historique
  bonusMalus?: number;
  sinistres?: "aucun" | "1_responsable" | "2plus" | "non_responsable";
  permisSuspendu?: boolean;
  resilieParAssureur?: boolean;

  // Étape 5 — Conducteur secondaire
  conducteurSecondaire?: boolean;
  conducteurSecondaireNaissance?: string;
  conducteurSecondairePermis?: string;
  conducteurSecondaireBonusMalus?: number;

  // Étape 6 — Couverture actuelle
  estAssure?: boolean;
  assureurActuel?: string;
  formuleActuelle?: "tiers" | "intermediaire" | "tous_risques";
  dateDebutSouhaite?: string;

  // Étape 7 — Garanties souhaitées
  formuleMin?: "tiers" | "tiers_vol_incendie" | "tous_risques";
  garantiesBrisGlace?: boolean;
  garantiesAssistance0km?: boolean;
  garantiesProtectionJuridique?: boolean;
  garantiesGarantieConducteur?: boolean;
  garantiesVehiculeRemplacement?: boolean;
  garantiesAuKilometre?: boolean;

  // Étape 8 — Contact
  prenom?: string;
  email?: string;
  password?: string;
  rgpdConsent?: boolean;

  // Meta
  affiliateCode?: string;
}

export interface InsuranceResult {
  id: string;
  assureur: string;
  logo?: string;
  formule: string;
  garanties: string[];
  prixMensuel: number;
  prixAnnuel: number;
  franchise: number;
  badge?: "best_value" | "cheapest" | "popular";
  satisfaction?: number;
  url?: string;
  isEstimate: true;
}
