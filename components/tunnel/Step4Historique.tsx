"use client";

import { useState } from "react";
import { CheckCircle2, Circle, AlertTriangle, AlertOctagon } from "lucide-react";
import StepWrapper from "./StepWrapper";
import OptionCard from "@/components/ui/OptionCard";
import { useTunnelStore } from "@/store/tunnelStore";

const SINISTRES = [
  { value: "aucun", icon: <CheckCircle2 className="h-5 w-5" />, label: "Aucun sinistre", description: "Conduite sans incident" },
  { value: "non_responsable", icon: <Circle className="h-5 w-5" />, label: "Sinistre non responsable", description: "Accident dont je ne suis pas responsable" },
  { value: "1_responsable", icon: <AlertTriangle className="h-5 w-5" />, label: "1 sinistre responsable", description: "1 accident responsable dans les 3 ans" },
  { value: "2plus", icon: <AlertOctagon className="h-5 w-5" />, label: "2 sinistres ou plus", description: "Plusieurs accidents dans les 3 ans" },
];

export default function Step4Historique() {
  const { formData, updateFormData, nextStep, prevStep } = useTunnelStore();
  const [showTooltip, setShowTooltip] = useState(false);

  const bm = formData.bonusMalus ?? 1.0;

  const canNext = formData.sinistres;

  return (
    <StepWrapper
      title="Historique de conduite"
      subtitle="Ces informations permettent d'affiner votre tarification."
      onNext={nextStep}
      onPrev={prevStep}
      nextDisabled={!canNext}
    >
      <div className="flex flex-col gap-6">
        {/* Bonus-malus */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-medium text-[#1A1A1A]">Votre coefficient bonus-malus</p>
            <button
              type="button"
              className="text-[#C9A84C] hover:text-[#b8943f] transition-colors"
              onClick={() => setShowTooltip(!showTooltip)}
              aria-expanded={showTooltip}
              aria-label="Qu'est-ce que le bonus-malus ?"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {showTooltip && (
            <div className="mb-4 p-4 bg-[#F5E6C8] border border-[#E5D8BC] rounded-xl text-sm text-[#6B7280]">
              <strong className="text-[#1A1A1A] block mb-1">Le bonus-malus</strong>
              Le coefficient de réduction-majoration (CRM) part de <strong>1.00</strong> à votre 1er contrat. Il descend jusqu&apos;à <strong>0.50</strong> (bonus maximum) si vous conduisez sans sinistre responsable, et monte jusqu&apos;à <strong>3.50</strong> (malus) en cas d&apos;accidents. Il figure sur votre relevé d&apos;information.
            </div>
          )}

          {/* Zone bar + draggable range */}
          <div className="relative h-10 flex items-center mb-3 select-none">
            <div className="absolute inset-x-0 h-4 rounded-full flex overflow-hidden shadow-inner">
              {/* Green 0.50→0.80 = 10% */}
              <div className="bg-gradient-to-r from-green-500 to-green-400" style={{ width: "10%" }} />
              {/* Gold 0.80→1.00 = 6.7% */}
              <div className="bg-gradient-to-r from-[#C9A84C] to-[#D4AA50]" style={{ width: "6.7%" }} />
              {/* Orange 1.00→1.50 = 16.7% */}
              <div className="bg-gradient-to-r from-orange-400 to-orange-500" style={{ width: "16.7%" }} />
              {/* Red 1.50→3.50 = 66.6% */}
              <div className="bg-gradient-to-r from-orange-600 to-red-600 flex-1" />
            </div>
            {/* Thumb */}
            <div
              className="absolute w-7 h-7 rounded-full bg-white shadow-lg border-[3px] -translate-x-1/2 transition-all duration-75 pointer-events-none z-10"
              style={{
                left: `${((bm * 100 - 50) / 300) * 100}%`,
                borderColor:
                  bm <= 0.80 ? "#22c55e" :
                  bm <= 1.00 ? "#C9A84C" :
                  bm <= 1.50 ? "#f97316" : "#ef4444",
              }}
            />
            {/* Overlay range input */}
            <input
              type="range"
              min={50}
              max={350}
              step={5}
              value={Math.round(bm * 100)}
              onChange={(e) => updateFormData({ bonusMalus: Number(e.target.value) / 100 })}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              aria-label="Coefficient bonus-malus"
            />
          </div>

          {/* Value display */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <p className={`text-5xl font-bold font-[family-name:var(--font-jetbrains)] ${
              bm <= 0.80 ? "text-green-600" :
              bm <= 1.00 ? "text-[#C9A84C]" :
              bm <= 1.50 ? "text-orange-500" :
              "text-red-600"
            }`}>
              {bm.toFixed(2)}
            </p>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${
                bm <= 0.80 ? "text-green-600" :
                bm <= 1.00 ? "text-[#C9A84C]" :
                bm <= 1.50 ? "text-orange-500" :
                "text-red-600"
              }`}>
                {bm < 1.00 ? "Bonus" : bm === 1.00 ? "Neutre" : "Malus"}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {bm < 1.00
                  ? `−${Math.round((1 - bm) * 100)} % sur la prime`
                  : bm > 1.00
                  ? `+${Math.round((bm - 1) * 100)} % sur la prime`
                  : "prime de base"}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-xs text-[#9CA3AF]">
            <span>0.50 — Bonus max</span>
            <span>1.00 — Neutre</span>
            <span>3.50 — Malus max</span>
          </div>
        </div>

        {/* Sinistres */}
        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Sinistres dans les 3 dernières années</p>
          <div className="flex flex-col gap-2">
            {SINISTRES.map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                selected={formData.sinistres === opt.value}
                onSelect={(v) => updateFormData({ sinistres: v as typeof formData.sinistres })}
                icon={opt.icon}
                label={opt.label}
                description={opt.description}
              />
            ))}
          </div>
        </div>

        {/* Permis suspendu */}
        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Votre permis a-t-il été suspendu ou annulé ?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "false", label: "Jamais suspendu" },
              { value: "true", label: "Suspendu ou annulé" },
            ].map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                selected={String(formData.permisSuspendu ?? false) === opt.value}
                onSelect={(v) => updateFormData({ permisSuspendu: v === "true" })}
                label={opt.label}
              />
            ))}
          </div>
        </div>

        {/* Résilié */}
        <div>
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Avez-vous été résilié par un assureur ?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "false", label: "Non" },
              { value: "true", label: "Oui" },
            ].map((opt) => (
              <OptionCard
                key={opt.value}
                value={opt.value}
                selected={String(formData.resilieParAssureur ?? false) === opt.value}
                onSelect={(v) => updateFormData({ resilieParAssureur: v === "true" })}
                label={opt.label}
              />
            ))}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
