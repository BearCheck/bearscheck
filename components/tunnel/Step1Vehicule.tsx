"use client";

import { useState } from "react";
import StepWrapper from "./StepWrapper";
import Select from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import { useTunnelStore } from "@/store/tunnelStore";
import { MARQUES_VOITURE, getModelesForMarque, CARBURANTS } from "@/lib/vehicleData";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1969 }, (_, i) => {
  const y = CURRENT_YEAR - i;
  return { value: String(y), label: String(y) };
});

const VALEURS = [
  { value: "2500", label: "Moins de 5 000 €" },
  { value: "7500", label: "5 000 – 10 000 €" },
  { value: "15000", label: "10 000 – 20 000 €" },
  { value: "25000", label: "20 000 – 30 000 €" },
  { value: "35000", label: "30 000 – 40 000 €" },
  { value: "45000", label: "Plus de 40 000 €" },
];

export default function Step1Vehicule() {
  const { formData, updateFormData, nextStep, prevStep } = useTunnelStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const modeles = formData.marque ? getModelesForMarque(formData.marque) : [];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.marque) newErrors.marque = "Veuillez sélectionner une marque";
    if (!formData.modele) newErrors.modele = "Veuillez sélectionner un modèle";
    if (!formData.annee) newErrors.annee = "Veuillez sélectionner une année";
    if (!formData.carburant) newErrors.carburant = "Veuillez sélectionner le carburant";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) nextStep();
  };

  return (
    <StepWrapper
      title="Votre véhicule"
      subtitle="Renseignez les caractéristiques de votre véhicule."
      onNext={handleNext}
      onPrev={prevStep}
      nextDisabled={!formData.marque || !formData.modele || !formData.annee || !formData.carburant}
    >
      <div className="flex flex-col gap-5">
        <Select
          label="Marque du véhicule"
          placeholder="Sélectionnez une marque"
          value={formData.marque ?? ""}
          options={MARQUES_VOITURE.map((m) => ({ value: m, label: m }))}
          error={errors.marque}
          onChange={(e) => {
            updateFormData({ marque: e.target.value, modele: undefined });
            setErrors((prev) => ({ ...prev, marque: "" }));
          }}
        />

        <Select
          label="Modèle"
          placeholder={formData.marque ? "Sélectionnez un modèle" : "Choisissez d'abord une marque"}
          value={formData.modele ?? ""}
          options={modeles.length > 0
            ? modeles.map((m) => ({ value: m, label: m }))
            : [{ value: formData.modele ?? "", label: formData.modele ?? "Autre modèle" }]
          }
          disabled={!formData.marque}
          error={errors.modele}
          onChange={(e) => {
            updateFormData({ modele: e.target.value });
            setErrors((prev) => ({ ...prev, modele: "" }));
          }}
        />

        <Select
          label="Année de mise en circulation"
          placeholder="Sélectionnez une année"
          value={formData.annee ? String(formData.annee) : ""}
          options={YEARS}
          error={errors.annee}
          onChange={(e) => {
            updateFormData({ annee: Number(e.target.value) });
            setErrors((prev) => ({ ...prev, annee: "" }));
          }}
        />

        <Select
          label="Carburant"
          placeholder="Sélectionnez le carburant"
          value={formData.carburant ?? ""}
          options={CARBURANTS}
          error={errors.carburant}
          onChange={(e) => {
            updateFormData({ carburant: e.target.value as typeof formData.carburant });
          }}
        />

        <Slider
          label="Puissance fiscale"
          displayValue={formData.puissanceFiscale ? `${formData.puissanceFiscale} CV` : "5 CV"}
          min={1}
          max={20}
          value={formData.puissanceFiscale ?? 5}
          onChange={(e) => updateFormData({ puissanceFiscale: Number(e.target.value) })}
        />

        <Select
          label="Valeur d'achat approximative"
          placeholder="Sélectionnez une fourchette de prix"
          value={formData.valeurAchat ? String(formData.valeurAchat) : ""}
          options={VALEURS}
          onChange={(e) => updateFormData({ valeurAchat: Number(e.target.value) })}
        />
      </div>
    </StepWrapper>
  );
}
