"use client";

import { Check, X } from "lucide-react";
import StepWrapper from "./StepWrapper";
import OptionCard from "@/components/ui/OptionCard";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { useTunnelStore } from "@/store/tunnelStore";
import { ASSUREURS_FR } from "@/lib/vehicleData";

const FORMULES = [
  { value: "tiers", label: "Responsabilité civile (Tiers)" },
  { value: "intermediaire", label: "Tiers + Vol & Incendie" },
  { value: "tous_risques", label: "Tous risques" },
];

export default function Step6Couverture() {
  const { formData, updateFormData, nextStep, prevStep } = useTunnelStore();

  return (
    <StepWrapper
      title="Votre couverture actuelle"
      subtitle="Ces informations permettent de comparer votre contrat actuel."
      onNext={nextStep}
      onPrev={prevStep}
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Êtes-vous actuellement assuré(e) ?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "true", icon: <Check className="h-5 w-5" />, label: "Oui" },
              { value: "false", icon: <X className="h-5 w-5" />, label: "Non" },
            ].map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                selected={String(formData.estAssure ?? false) === opt.value}
                onSelect={(v) => updateFormData({ estAssure: v === "true" })}
                icon={opt.icon}
                label={opt.label}
              />
            ))}
          </div>
        </div>

        {formData.estAssure && (
          <div className="flex flex-col gap-4 p-4 bg-[#FAFAFA] border border-[#E5D8BC] rounded-xl">
            <Select
              label="Assureur actuel"
              placeholder="Sélectionnez votre assureur"
              value={formData.assureurActuel ?? ""}
              options={ASSUREURS_FR.map((a) => ({ value: a, label: a }))}
              onChange={(e) => updateFormData({ assureurActuel: e.target.value })}
            />

            <div>
              <p className="text-sm font-medium text-[#1A1A1A] mb-2">Formule actuelle</p>
              <div className="flex flex-col gap-2">
                {FORMULES.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    value={opt.value}
                    selected={formData.formuleActuelle === opt.value}
                    onSelect={(v) => updateFormData({ formuleActuelle: v as typeof formData.formuleActuelle })}
                    label={opt.label}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <Input
          label="Date de début souhaitée du nouveau contrat"
          type="date"
          value={formData.dateDebutSouhaite ?? ""}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => updateFormData({ dateDebutSouhaite: e.target.value })}
          hint="Optionnel — par défaut : le plus tôt possible"
        />
      </div>
    </StepWrapper>
  );
}
