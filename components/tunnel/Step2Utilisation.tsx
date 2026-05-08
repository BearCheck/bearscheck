"use client";

import { Home, Leaf, Briefcase, Warehouse, ParkingSquare, Route, Building2 } from "lucide-react";
import StepWrapper from "./StepWrapper";
import OptionCard from "@/components/ui/OptionCard";
import Input from "@/components/ui/Input";
import { useTunnelStore } from "@/store/tunnelStore";
import { KILOMETRAGES } from "@/lib/vehicleData";

const USAGES = [
  { value: "domicile_travail", icon: <Home className="h-5 w-5" />, label: "Domicile ↔ Travail", description: "Trajets quotidiens et usage personnel" },
  { value: "prive", icon: <Leaf className="h-5 w-5" />, label: "Usage privé uniquement", description: "Loisirs, vacances, courses" },
  { value: "professionnel", icon: <Briefcase className="h-5 w-5" />, label: "Professionnel", description: "Déplacements professionnels inclus" },
];

const STATIONNEMENTS = [
  { value: "garage", icon: <Warehouse className="h-5 w-5" />, label: "Garage fermé", description: "Box ou garage privé" },
  { value: "parking_prive", icon: <ParkingSquare className="h-5 w-5" />, label: "Parking privé", description: "Parking de résidence" },
  { value: "rue", icon: <Route className="h-5 w-5" />, label: "Rue", description: "Stationnement sur voie publique" },
  { value: "parking_public", icon: <Building2 className="h-5 w-5" />, label: "Parking public", description: "Parking payant ou gratuit" },
];

export default function Step2Utilisation() {
  const { formData, updateFormData, nextStep, prevStep } = useTunnelStore();

  const canNext = formData.usage && formData.stationnement && formData.kilometrageAnnuel;

  return (
    <StepWrapper
      title="Utilisation du véhicule"
      subtitle="Comment utilisez-vous votre voiture au quotidien ?"
      onNext={nextStep}
      onPrev={prevStep}
      nextDisabled={!canNext}
    >
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Usage principal</p>
          <div className="flex flex-col gap-2">
            {USAGES.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                selected={formData.usage === opt.value}
                onSelect={(v) => updateFormData({ usage: v as typeof formData.usage })}
                icon={opt.icon}
                label={opt.label}
                description={opt.description}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Stationnement habituel</p>
          <div className="grid grid-cols-2 gap-2">
            {STATIONNEMENTS.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                selected={formData.stationnement === opt.value}
                onSelect={(v) => updateFormData({ stationnement: v as typeof formData.stationnement })}
                icon={opt.icon}
                label={opt.label}
                description={opt.description}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Kilométrage annuel</p>
          <div className="flex flex-col gap-2">
            {KILOMETRAGES.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                selected={formData.kilometrageAnnuel === opt.value}
                onSelect={(v) => updateFormData({ kilometrageAnnuel: v as typeof formData.kilometrageAnnuel })}
                label={opt.label}
              />
            ))}
          </div>
        </div>

        <Input
          label="Code postal"
          placeholder="Ex : 75001"
          maxLength={5}
          value={formData.codePostal ?? ""}
          onChange={(e) => {
            const cp = e.target.value.replace(/\D/g, "").slice(0, 5);
            updateFormData({ codePostal: cp });
          }}
          hint="Permet de calculer les coefficients selon votre zone géographique"
        />
      </div>
    </StepWrapper>
  );
}
