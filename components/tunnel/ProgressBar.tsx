"use client";

import { Handshake } from "lucide-react";

interface ProgressBarProps {
  current: number;
  total: number;
  affiliatePartner?: string;
}

const STEP_LABELS = [
  "Démarrage",
  "Le véhicule",
  "Utilisation",
  "Conducteur",
  "Historique",
  "Conducteur 2",
  "Couverture",
  "Garanties",
  "Contact",
];

export default function ProgressBar({ current, total, affiliatePartner }: ProgressBarProps) {
  const percentage = Math.round((current / (total - 1)) * 100);

  return (
    <div className="w-full">
      {affiliatePartner && (
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center gap-1.5 bg-[#F5E6C8] text-[#C9A84C] border border-[#E5D8BC] px-3 py-1 rounded-full text-xs font-medium">
            <Handshake className="h-3.5 w-3.5" />
            Partenaire {affiliatePartner}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#6B7280]">
          Étape {current + 1} sur {total}
        </span>
        <span className="text-xs font-semibold text-[#C9A84C]">
          {percentage}% complété
        </span>
      </div>

      <div className="w-full h-2 bg-[#F5E6C8] rounded-full overflow-hidden"
        role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full rounded-full shimmer transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        {STEP_LABELS.map((label, index) => (
          <div key={label} className="flex flex-col items-center gap-1"
            aria-label={`${label}: ${index <= current ? "complété" : "à venir"}`}>
            <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-300
              ${index < current ? "bg-[#C9A84C]" : index === current ? "bg-[#C9A84C] scale-125" : "bg-[#E5D8BC]"}`} />
            <span className={`hidden sm:block text-[9px] ${index <= current ? "text-[#C9A84C]" : "text-[#9CA3AF]"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
