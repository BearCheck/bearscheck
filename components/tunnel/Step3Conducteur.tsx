"use client";

import { Home, KeyRound, Check, X } from "lucide-react";
import StepWrapper from "./StepWrapper";
import OptionCard from "@/components/ui/OptionCard";
import Input from "@/components/ui/Input";
import { useTunnelStore } from "@/store/tunnelStore";

const SITUATIONS = [
  { value: "proprietaire", icon: <Home className="h-5 w-5" />, label: "Propriétaire" },
  { value: "locataire", icon: <KeyRound className="h-5 w-5" />, label: "Locataire" },
];

export default function Step3Conducteur() {
  const { formData, updateFormData, nextStep, prevStep } = useTunnelStore();

  const canNext = formData.dateNaissance && formData.situation && formData.datePermis;

  return (
    <StepWrapper
      title="Le conducteur principal"
      subtitle="Informations sur le conducteur principal du véhicule."
      onNext={nextStep}
      onPrev={prevStep}
      nextDisabled={!canNext}
    >
      <div className="flex flex-col gap-5">
        <Input
          label="Date de naissance"
          type="date"
          value={formData.dateNaissance ?? ""}
          max={new Date(Date.now() - 16 * 365.25 * 24 * 3600 * 1000).toISOString().split("T")[0]}
          onChange={(e) => updateFormData({ dateNaissance: e.target.value })}
        />

        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Situation</p>
          <div className="grid grid-cols-2 gap-2">
            {SITUATIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                selected={formData.situation === opt.value}
                onSelect={(v) => updateFormData({ situation: v as typeof formData.situation })}
                icon={opt.icon}
                label={opt.label}
              />
            ))}
          </div>
        </div>

        <Input
          label="Date d'obtention du permis"
          type="date"
          value={formData.datePermis ?? ""}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => updateFormData({ datePermis: e.target.value })}
        />

        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Le véhicule est-il à votre nom ?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "true", icon: <Check className="h-5 w-5" />, label: "Oui" },
              { value: "false", icon: <X className="h-5 w-5" />, label: "Non" },
            ].map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                selected={String(formData.vehiculeANom) === opt.value}
                onSelect={(v) => updateFormData({ vehiculeANom: v === "true" })}
                icon={opt.icon}
                label={opt.label}
              />
            ))}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
