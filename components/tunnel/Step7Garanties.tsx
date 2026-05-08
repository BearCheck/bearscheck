"use client";

import { Shield, Lock, Star, AppWindow, AlertCircle, Scale, UserRound, Car, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import StepWrapper from "./StepWrapper";
import OptionCard from "@/components/ui/OptionCard";
import { useTunnelStore } from "@/store/tunnelStore";

const FORMULES_MIN = [
  { value: "tiers", icon: <Shield className="h-5 w-5" />, label: "Responsabilité civile (Tiers)", description: "Couverture minimale légale obligatoire" },
  { value: "tiers_vol_incendie", icon: <Lock className="h-5 w-5" />, label: "Tiers + Vol & Incendie", description: "Protection contre le vol et l'incendie" },
  { value: "tous_risques", icon: <Star className="h-5 w-5" />, label: "Tous risques", description: "Couverture maximale, toutes situations" },
];

interface OptionSupp {
  key: "garantiesBrisGlace" | "garantiesAssistance0km" | "garantiesProtectionJuridique" | "garantiesGarantieConducteur" | "garantiesVehiculeRemplacement" | "garantiesAuKilometre";
  label: string;
  icon: ReactNode;
  desc: string;
}

const OPTIONS_SUPP: OptionSupp[] = [
  { key: "garantiesBrisGlace", label: "Bris de glace", icon: <AppWindow className="h-5 w-5" />, desc: "Pare-brise, vitres latérales" },
  { key: "garantiesAssistance0km", label: "Assistance 0 km", icon: <AlertCircle className="h-5 w-5" />, desc: "Dépannage même devant chez vous" },
  { key: "garantiesProtectionJuridique", label: "Protection juridique", icon: <Scale className="h-5 w-5" />, desc: "Défense en cas de litige" },
  { key: "garantiesGarantieConducteur", label: "Garantie du conducteur", icon: <UserRound className="h-5 w-5" />, desc: "Couverture en cas de blessures" },
  { key: "garantiesVehiculeRemplacement", label: "Véhicule de remplacement", icon: <Car className="h-5 w-5" />, desc: "Voiture de prêt pendant les réparations" },
  { key: "garantiesAuKilometre", label: "Assurance au kilomètre", icon: <MapPin className="h-5 w-5" />, desc: "Pay As You Drive — idéal si vous roulez peu" },
];

export default function Step7Garanties() {
  const { formData, updateFormData, nextStep, prevStep } = useTunnelStore();

  return (
    <StepWrapper
      title="Vos garanties souhaitées"
      subtitle="Sélectionnez la couverture minimale et les options qui vous intéressent."
      onNext={nextStep}
      onPrev={prevStep}
      nextDisabled={!formData.formuleMin}
    >
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Formule minimale souhaitée</p>
          <div className="flex flex-col gap-2">
            {FORMULES_MIN.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                selected={formData.formuleMin === opt.value}
                onSelect={(v) => updateFormData({ formuleMin: v as typeof formData.formuleMin })}
                icon={opt.icon}
                label={opt.label}
                description={opt.description}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-1">Options supplémentaires</p>
          <p className="text-xs text-[#6B7280] mb-3">Cochez les garanties qui vous intéressent (optionnel)</p>
          <div className="flex flex-col gap-2">
            {OPTIONS_SUPP.map((opt) => {
              const isSelected = !!formData[opt.key];
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => updateFormData({ [opt.key]: !isSelected })}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer
                    ${isSelected ? "border-[#C9A84C] bg-[#F5E6C8]" : "border-[#E5D8BC] bg-white hover:border-[#C9A84C] hover:bg-[#FAFAFA]"}`}
                  aria-pressed={isSelected}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                    ${isSelected ? "bg-[#C9A84C] text-white" : "bg-[#F5E6C8] text-[#C9A84C]"}`}>
                    {opt.icon}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isSelected ? "text-[#C9A84C]" : "text-[#1A1A1A]"}`}>{opt.label}</p>
                    <p className="text-xs text-[#6B7280]">{opt.desc}</p>
                  </div>
                  <div className={`h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors
                    ${isSelected ? "border-[#C9A84C] bg-[#C9A84C]" : "border-[#E5D8BC]"}`}>
                    {isSelected && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
