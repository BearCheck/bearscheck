"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Star, Check } from "lucide-react";

import { useTunnelStore } from "@/store/tunnelStore";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { InsuranceResult } from "@/types/tunnel";

function ResultCard({ result, onExpand, isExpanded, affiliateCode }: { result: InsuranceResult; onExpand: () => void; isExpanded: boolean; affiliateCode?: string }) {
  function handleSouscrire() {
    if (affiliateCode) {
      fetch("/api/track/conversion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateCode,
          description: `Souscription ${result.assureur} — ${result.formule}`,
        }),
      }).catch(() => {});
    }
    if (result.url) {
      window.open(result.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <Card className={result.badge === "cheapest" ? "border-[#C9A84C] shadow-md" : ""}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="h-12 w-12 rounded-xl bg-[#F5E6C8] flex items-center justify-center text-[#C9A84C] font-bold text-sm shrink-0">
            {result.assureur.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[#1A1A1A]">{result.assureur}</span>
              {result.badge === "cheapest" && <Badge variant="success"><Trophy className="h-3 w-3" /> Le moins cher</Badge>}
              {result.badge === "best_value" && <Badge variant="gold"><Star className="h-3 w-3" /> Meilleur rapport</Badge>}
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">{result.formule}</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-[#C9A84C] font-[family-name:var(--font-jetbrains)]">
            {result.prixMensuel.toFixed(2)} €
          </p>
          <p className="text-xs text-[#6B7280]">par mois</p>
          <p className="text-xs text-[#9CA3AF]">soit {result.prixAnnuel.toFixed(2)} €/an</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <button onClick={onExpand}
          className="text-xs text-[#6B7280] hover:text-[#C9A84C] transition-colors underline"
          aria-expanded={isExpanded}>
          {isExpanded ? "Masquer le détail ▲" : "Voir le détail ▼"}
        </button>
        <div className="flex-1" />
        <p className="text-xs text-[#9CA3AF]">Franchise : {result.franchise}€</p>
        <Button size="sm" onClick={handleSouscrire}>Souscrire →</Button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#E5D8BC]">
          <p className="text-xs font-semibold text-[#1A1A1A] mb-2">Garanties incluses :</p>
          <ul className="flex flex-wrap gap-2">
            {result.garanties.map((g) => (
              <li key={g}>
                <Badge variant="neutral" className="text-xs"><Check className="h-3 w-3" /> {g}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

export default function ResultsPage() {
  const { results, formData, resetTunnel } = useTunnelStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [maxPrix, setMaxPrix] = useState<number>(999);

  const filtered = results.filter((r) => r.prixMensuel <= maxPrix);
  const maxResult = Math.max(...results.map((r) => r.prixMensuel));

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="success">{filtered.length} offres trouvées</Badge>
          {formData.marque && <Badge variant="neutral">{formData.marque} {formData.modele}</Badge>}
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Vos offres personnalisées</h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Triées par prix croissant · {formData.prenom && `Bonjour ${formData.prenom} !`}
        </p>
      </div>

      <div className="mb-5 p-3 bg-[#F5E6C8] border border-[#E5D8BC] rounded-xl flex items-start gap-2">
        <svg className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-[#6B7280]">
          <strong className="text-[#1A1A1A]">Estimation indicative.</strong> Ces tarifs sont calculés à partir de données de marché 2025/2026. Non contractuels. Cliquez &ldquo;Souscrire&rdquo; pour obtenir un devis précis directement auprès de l&apos;assureur.
        </p>
      </div>

      <div className="mb-5 p-4 bg-[#FAFAFA] border border-[#E5D8BC] rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#1A1A1A]">Prix maximum mensuel</span>
          <span className="text-sm font-bold text-[#C9A84C] font-[family-name:var(--font-jetbrains)]">
            {maxPrix === 999 ? "Tous" : `≤ ${maxPrix.toFixed(0)} €`}
          </span>
        </div>
        <input type="range"
          min={Math.floor(results[0]?.prixMensuel ?? 15)}
          max={Math.ceil(maxResult)}
          value={maxPrix}
          onChange={(e) => setMaxPrix(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#E5D8BC]
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C9A84C]"
        />
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-[#6B7280]">
            <p>Aucune offre dans cette fourchette de prix.</p>
          </div>
        ) : (
          filtered.map((result) => (
            <ResultCard
              key={result.id}
              result={result}
              affiliateCode={formData.affiliateCode}
              isExpanded={expandedId === result.id}
              onExpand={() => setExpandedId(expandedId === result.id ? null : result.id)}
            />
          ))
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
        <button onClick={resetTunnel}
          className="text-sm text-[#6B7280] hover:text-[#C9A84C] transition-colors underline">
          Recommencer avec un autre profil
        </button>
        <Link href="/">
          <Button variant="outline" size="sm">Retour à l&apos;accueil</Button>
        </Link>
      </div>
    </div>
  );
}
