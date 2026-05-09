"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "@/components/admin/ui/ProgressBar";

const TAUX = 0.214;
const ABATTEMENT = 0.50;
const PLAFOND = 77700;

export function TaxCalculator() {
  const [ca, setCa] = useState(0);
  const [result, setResult] = useState({ cotisations: 0, revenuImposable: 0, revenuNet: 0, pct: 0 });

  useEffect(() => {
    const cotisations = ca * TAUX;
    const revenuImposable = ca * (1 - ABATTEMENT);
    const revenuNet = ca - cotisations;
    const pct = Math.min((ca / PLAFOND) * 100, 100);
    setResult({ cotisations, revenuImposable, revenuNet, pct });
  }, [ca]);

  const fmt = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-6">
      <h3 className="font-bold text-[#0F172A]">Simulateur de revenus nets</h3>

      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2" htmlFor="ca-input">
          Chiffre d&apos;affaires brut
        </label>
        <div className="flex items-center gap-2">
          <input id="ca-input" type="number" min="0" step="100" value={ca}
            onChange={(e) => setCa(parseFloat(e.target.value) || 0)}
            className="flex-1 border border-[#E2E8F0] rounded-xl px-3 py-2 text-lg font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50"
            aria-label="Chiffre d'affaires en euros" />
          <span className="text-[#64748B] font-semibold">€</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-[#64748B] mb-1">
          <span>{fmt(ca)} / {fmt(PLAFOND)}</span>
          <span>{result.pct.toFixed(0)}% du plafond</span>
        </div>
        <ProgressBar valeur={result.pct} couleur={result.pct > 80 ? "#EF4444" : "#C9A84C"} showLabel={false} size="lg" />
        {result.pct > 80 && (
          <p className="text-xs text-red-600 font-medium mt-1">⚠️ Attention, vous approchez du plafond micro-entreprise</p>
        )}
      </div>

      <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-2 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-[#64748B]">CA Brut</span>
          <span className="font-bold text-[#0F172A]">{fmt(ca)}</span>
        </div>
        <div className="flex justify-between text-red-600">
          <span>Cotisations ({(TAUX * 100).toFixed(1)}%)</span>
          <span>- {fmt(result.cotisations)}</span>
        </div>
        <div className="flex justify-between text-[#64748B]">
          <span>Abattement forfaitaire ({(ABATTEMENT * 100).toFixed(0)}%)</span>
          <span>- {fmt(ca * ABATTEMENT)}</span>
        </div>
        <div className="flex justify-between text-[#64748B]">
          <span>Revenu imposable</span>
          <span>{fmt(result.revenuImposable)}</span>
        </div>
        <div className="h-px bg-[#E2E8F0] my-1" />
        <div className="flex justify-between text-lg">
          <span className="font-bold text-[#0F172A]">Revenu net estimé</span>
          <span className="font-bold text-[#C9A84C]">{fmt(result.revenuNet)}</span>
        </div>
      </div>
    </div>
  );
}
