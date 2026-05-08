"use client";

import { Users, UserRound } from "lucide-react";
import StepWrapper from "./StepWrapper";
import OptionCard from "@/components/ui/OptionCard";
import Input from "@/components/ui/Input";
import Slider from "@/components/ui/Slider";
import { useTunnelStore } from "@/store/tunnelStore";

export default function Step5ConducteurSecondaire() {
  const { formData, updateFormData, nextStep, prevStep } = useTunnelStore();

  return (
    <StepWrapper
      title="Conducteur secondaire"
      subtitle="Y a-t-il un autre conducteur régulier pour ce véhicule ?"
      onNext={nextStep}
      onPrev={prevStep}
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Y a-t-il un conducteur secondaire ?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "true", icon: <Users className="h-5 w-5" />, label: "Oui" },
              { value: "false", icon: <UserRound className="h-5 w-5" />, label: "Non" },
            ].map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                selected={String(formData.conducteurSecondaire ?? false) === opt.value}
                onSelect={(v) => updateFormData({ conducteurSecondaire: v === "true" })}
                icon={opt.icon}
                label={opt.label}
              />
            ))}
          </div>
        </div>

        {formData.conducteurSecondaire && (
          <div className="flex flex-col gap-4 p-4 bg-[#FAFAFA] border border-[#E5D8BC] rounded-xl">
            <p className="text-sm font-semibold text-[#C9A84C]">Informations conducteur secondaire</p>

            <Input
              label="Date de naissance"
              type="date"
              value={formData.conducteurSecondaireNaissance ?? ""}
              max={new Date(Date.now() - 16 * 365.25 * 24 * 3600 * 1000).toISOString().split("T")[0]}
              onChange={(e) => updateFormData({ conducteurSecondaireNaissance: e.target.value })}
            />

            <Input
              label="Date d'obtention du permis"
              type="date"
              value={formData.conducteurSecondairePermis ?? ""}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => updateFormData({ conducteurSecondairePermis: e.target.value })}
            />

            <Slider
              label="Coefficient bonus-malus"
              displayValue={(formData.conducteurSecondaireBonusMalus ?? 1.0).toFixed(2)}
              min={50}
              max={350}
              step={5}
              value={Math.round((formData.conducteurSecondaireBonusMalus ?? 1.0) * 100)}
              onChange={(e) => updateFormData({ conducteurSecondaireBonusMalus: Number(e.target.value) / 100 })}
            />
          </div>
        )}
      </div>
    </StepWrapper>
  );
}
