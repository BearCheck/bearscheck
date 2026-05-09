"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ProgressBar } from "@/components/admin/ui/ProgressBar";

interface TaxDeclaration {
  id?: string;
  trimestre: number;
  annee: number;
  chiffreAffaires: number;
  cotisations: number;
  dateLimite: string;
  datePaiement?: string | null;
  statut: "A_PAYER" | "PAYE" | "EN_RETARD";
}

const ECHEANCES = [
  { trimestre: 1, periode: "Jan–Mar", limite: "2026-04-30" },
  { trimestre: 2, periode: "Avr–Jun", limite: "2026-07-31" },
  { trimestre: 3, periode: "Jul–Sep", limite: "2026-10-31" },
  { trimestre: 4, periode: "Oct–Déc", limite: "2027-01-31" },
];

const TAUX = 0.214;

const statutCfg = {
  A_PAYER: { label: "À payer", emoji: "🔴", bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  PAYE:    { label: "Payé",    emoji: "✅", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
  EN_RETARD: { label: "En retard", emoji: "⚠️", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
};

interface Props { declarations: TaxDeclaration[]; onUpdate: () => void }

export function TaxTimeline({ declarations, onUpdate }: Props) {
  const [cas, setCas] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<number | null>(null);

  const now = new Date();

  function daysUntil(dateStr: string) {
    const d = new Date(dateStr);
    const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000);
    return diff;
  }

  async function handleSave(trimestre: number, limite: string) {
    const ca = parseFloat(cas[trimestre] ?? "0");
    if (!ca) return toast.error("Saisissez un CA");
    setSaving(trimestre);
    try {
      const daysDiff = daysUntil(limite);
      const existingDecl = declarations.find((d) => d.trimestre === trimestre);
      const statut = existingDecl?.statut === "PAYE" ? "PAYE" : daysDiff < 0 ? "EN_RETARD" : "A_PAYER";
      await fetch("/api/admin/taxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trimestre, annee: 2026, chiffreAffaires: ca, dateLimite: limite, statut }),
      });
      toast.success(`Déclaration T${trimestre} enregistrée`);
      onUpdate();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(null);
    }
  }

  async function markPaid(id: string, trimestre: number) {
    try {
      await fetch("/api/admin/taxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trimestre,
          annee: 2026,
          chiffreAffaires: declarations.find((d) => d.trimestre === trimestre)?.chiffreAffaires ?? 0,
          dateLimite: ECHEANCES.find((e) => e.trimestre === trimestre)?.limite ?? "",
          datePaiement: new Date().toISOString(),
          statut: "PAYE",
        }),
      });
      toast.success("Déclaration marquée comme payée");
      onUpdate();
    } catch {
      toast.error("Erreur");
    }
    void id;
  }

  return (
    <div className="space-y-4">
      {ECHEANCES.map(({ trimestre, periode, limite }) => {
        const decl = declarations.find((d) => d.trimestre === trimestre);
        const days = daysUntil(limite);
        const statut = decl?.statut ?? (days < 0 ? "EN_RETARD" : "A_PAYER");
        const sc = statutCfg[statut];

        return (
          <div key={trimestre} className={`bg-white rounded-2xl border p-5 ${sc.border}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-[#0F172A]">Trimestre {trimestre} — {periode}</h4>
                <p className="text-xs text-[#64748B]">Limite : {new Date(limite).toLocaleDateString("fr-FR")}</p>
                {statut === "A_PAYER" && days > 0 && (
                  <p className="text-xs font-semibold text-[#C9A84C]">Dans {days} jour{days > 1 ? "s" : ""}</p>
                )}
                {days <= 0 && statut !== "PAYE" && (
                  <p className="text-xs font-semibold text-red-600">En retard de {Math.abs(days)} jour{Math.abs(days) > 1 ? "s" : ""}</p>
                )}
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${sc.bg} ${sc.border} ${sc.text}`}>
                {sc.emoji} {sc.label}
              </span>
            </div>

            {decl ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">CA déclaré</span>
                  <span className="font-bold">{decl.chiffreAffaires.toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Cotisations dues</span>
                  <span className="font-bold text-[#C9A84C]">{decl.cotisations.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €</span>
                </div>
                {statut !== "PAYE" && (
                  <button onClick={() => markPaid(decl.id!, trimestre)}
                    className="mt-2 text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Marquer comme payé ✅
                  </button>
                )}
              </div>
            ) : (
              <div className="flex gap-2 mt-2">
                <input type="number" placeholder="CA du trimestre (€)" value={cas[trimestre] ?? ""}
                  onChange={(e) => setCas((p) => ({ ...p, [trimestre]: e.target.value }))}
                  className="flex-1 border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50"
                  aria-label={`CA trimestre ${trimestre}`} />
                <div className="text-sm text-[#64748B] py-1.5 px-2 bg-[#F8FAFC] rounded-xl">
                  ≈ {((parseFloat(cas[trimestre] ?? "0") || 0) * TAUX).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <button onClick={() => handleSave(trimestre, limite)} disabled={saving === trimestre}
                  className="px-3 py-1.5 bg-[#C9A84C] text-white rounded-xl text-xs font-semibold hover:bg-[#B8973B] disabled:opacity-50 transition-colors">
                  {saving === trimestre ? "..." : "Enregistrer"}
                </button>
              </div>
            )}

            {decl && (
              <div className="mt-3">
                <ProgressBar valeur={Math.min((decl.chiffreAffaires / 77700) * 100, 100)} showLabel size="sm" />
                <p className="text-xs text-[#94A3B8] mt-1">Part du plafond annuel utilisée</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
