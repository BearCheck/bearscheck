"use client";

import { useState, useEffect, useCallback } from "react";
import { TaxCalculator } from "@/components/admin/impots/TaxCalculator";
import { TaxTimeline } from "@/components/admin/impots/TaxTimeline";
import { AlertBadge } from "@/components/admin/ui/AlertBadge";
import { StatCard } from "@/components/admin/ui/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Toaster } from "react-hot-toast";

interface TaxDeclaration {
  id?: string; trimestre: number; annee: number; chiffreAffaires: number;
  cotisations: number; dateLimite: string; datePaiement?: string | null;
  statut: "A_PAYER" | "PAYE" | "EN_RETARD";
}

const PLAFOND = 77700;
const TAUX = 0.214;

export default function ImpotsPage() {
  const [declarations, setDeclarations] = useState<TaxDeclaration[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/taxes");
    if (res.ok) setDeclarations(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalCA = declarations.filter((d) => d.annee === 2026).reduce((s, d) => s + d.chiffreAffaires, 0);
  const totalCotisations = declarations.filter((d) => d.annee === 2026).reduce((s, d) => s + d.cotisations, 0);
  const totalPaye = declarations.filter((d) => d.statut === "PAYE").reduce((s, d) => s + d.cotisations, 0);
  const pourcentagePlafond = Math.min((totalCA / PLAFOND) * 100, 100);

  const now = new Date();
  const declaEnRetard = declarations.filter((d) => d.statut === "EN_RETARD").length;
  const prochaine = declarations
    .filter((d) => d.statut === "A_PAYER")
    .sort((a, b) => new Date(a.dateLimite).getTime() - new Date(b.dateLimite).getTime())[0];
  const joursProchaine = prochaine
    ? Math.ceil((new Date(prochaine.dateLimite).getTime() - now.getTime()) / 86400000)
    : null;

  const barData = declarations.map((d) => ({
    name: `T${d.trimestre}`,
    cotisations: Math.round(d.cotisations),
    ca: Math.round(d.chiffreAffaires),
  }));

  return (
    <div className="p-8 space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Calculateur Impôts</h1>
        <p className="text-[#64748B] text-sm">Micro-entreprise — Taux SERVICE BIC 2026</p>
      </div>

      {declaEnRetard > 0 && (
        <AlertBadge type="erreur" message={`${declaEnRetard} déclaration(s) en retard ! Régularisez immédiatement sur urssaf.fr`} />
      )}
      {joursProchaine !== null && joursProchaine <= 30 && joursProchaine > 0 && (
        <AlertBadge type="attention" message={`Prochaine déclaration T${prochaine?.trimestre} dans ${joursProchaine} jours (${new Date(prochaine!.dateLimite).toLocaleDateString("fr-FR")})`} />
      )}
      {pourcentagePlafond >= 80 && (
        <AlertBadge type="attention" message={`Attention : vous avez atteint ${pourcentagePlafond.toFixed(0)}% du plafond micro-entreprise (${PLAFOND.toLocaleString("fr-FR")} €)`} />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard titre="CA Total 2026" valeur={totalCA.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="📊" />
        <StatCard titre={`Plafond (${pourcentagePlafond.toFixed(0)}%)`} valeur={PLAFOND.toLocaleString("fr-FR")} unite="€" icone="🎯" couleur={pourcentagePlafond >= 80 ? "#EF4444" : "#C9A84C"} />
        <StatCard titre="Cotisations dues" valeur={totalCotisations.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="🏛️" couleur="#EF4444" />
        <StatCard titre="Cotisations payées" valeur={totalPaye.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="✅" couleur="#10B981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaxCalculator />

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <h3 className="font-bold text-[#0F172A] mb-4">Récapitulatif fiscal 2026</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Taux cotisations (Service BIC)</span>
              <span className="font-bold">{(TAUX * 100).toFixed(1)} %</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Abattement forfaitaire</span>
              <span className="font-bold">50 %</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">Plafond annuel</span>
              <span className="font-bold">{PLAFOND.toLocaleString("fr-FR")} €</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
              <span className="text-[#64748B]">CA déclaré total</span>
              <span className="font-bold text-[#C9A84C]">{totalCA.toLocaleString("fr-FR")} €</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#64748B]">Cotisations restantes à payer</span>
              <span className="font-bold text-red-600">
                {(totalCotisations - totalPaye).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
              </span>
            </div>
          </div>
        </div>
      </div>

      {barData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <h3 className="font-semibold text-[#0F172A] mb-4 text-sm">Cotisations par trimestre</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [`${v} €`]} />
                <Bar dataKey="cotisations" fill="#C9A84C" radius={[4, 4, 0, 0]} name="Cotisations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <h3 className="font-semibold text-[#0F172A] mb-4 text-sm">Évolution CA par trimestre</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [`${v} €`]} />
                <Line type="monotone" dataKey="ca" stroke="#C9A84C" strokeWidth={2} dot={{ fill: "#C9A84C", r: 4 }} name="CA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-bold text-[#0F172A] mb-4">Échéancier trimestriel 2026</h2>
        <TaxTimeline declarations={declarations} onUpdate={load} />
      </div>
    </div>
  );
}
