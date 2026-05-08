"use client";

import { Car, RefreshCw, BarChart3 } from "lucide-react";
import StepWrapper from "./StepWrapper";
import OptionCard from "@/components/ui/OptionCard";
import { useTunnelStore } from "@/store/tunnelStore";

const OPTIONS = [
  { value: "new", icon: <Car className="h-5 w-5" />, label: "Assurer un nouveau véhicule", description: "Je viens d'acheter ou je vais acheter un véhicule" },
  { value: "switch", icon: <RefreshCw className="h-5 w-5" />, label: "Changer d'assurance", description: "Mon contrat actuel ne me convient plus" },
  { value: "compare", icon: <BarChart3 className="h-5 w-5" />, label: "Comparer pour économiser", description: "Je veux trouver un meilleur tarif" },
];

export default function Step0Intention() {
  const { formData, updateFormData, nextStep } = useTunnelStore();

  const handleSelect = (value: string) => {
    updateFormData({ intention: value as "new" | "switch" | "compare" });
    setTimeout(() => nextStep(), 250);
  };

  return (
    <StepWrapper
      title="Vous souhaitez ?"
      subtitle="Choisissez la situation qui correspond à votre besoin."
      onNext={nextStep}
      nextDisabled={!formData.intention}
      isFirst
    >
      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            value={opt.value}
            selected={formData.intention === opt.value}
            onSelect={handleSelect}
            icon={opt.icon}
            label={opt.label}
            description={opt.description}
          />
        ))}
      </div>
    </StepWrapper>
  );
}
