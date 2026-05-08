"use client";

import { BearImage } from "@/components/ui/BearLogo";

const DOT_DELAYS = ["0s", "0.2s", "0.4s"];

export default function BearLoader() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-6"
      role="status"
      aria-live="polite"
      aria-label="Calcul de vos devis en cours"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#F5E6C8] animate-ping opacity-25 scale-150" aria-hidden="true" />
        <BearImage height={96} className="bear-pulse relative z-10 drop-shadow-md" />
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-[#1A1A1A] mb-1">Calcul de vos devis en cours...</p>
        <p className="text-sm text-[#6B7280]">BearsCheck analyse les meilleures offres pour votre profil</p>
      </div>

      <div className="flex gap-2">
        {DOT_DELAYS.map((delay, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-[#C9A84C] animate-bounce"
            style={{ animationDelay: delay, animationDuration: "1.2s" }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
