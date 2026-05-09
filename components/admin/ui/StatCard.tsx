"use client";

interface StatCardProps {
  titre: string;
  valeur: string | number;
  unite?: string;
  evolution?: number;
  icone: string;
  couleur?: string;
  href?: string;
}

export function StatCard({ titre, valeur, unite, evolution, icone, couleur = "#C9A84C" }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm" style={{ borderLeftColor: couleur, borderLeftWidth: 4 }}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icone}</span>
        {evolution !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${evolution >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {evolution >= 0 ? "+" : ""}{evolution.toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[#0F172A]">
        {valeur}{unite && <span className="text-base font-medium text-[#64748B] ml-1">{unite}</span>}
      </p>
      <p className="text-sm text-[#64748B] mt-0.5">{titre}</p>
    </div>
  );
}
