"use client";

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Expense {
  id: string;
  titre: string;
  montant: number;
  categorie: string;
  type: string;
  dateDepense: string;
}

const CAT_COLORS: Record<string, string> = {
  HEBERGEMENT: "#3B82F6",
  DOMAINE: "#8B5CF6",
  MARKETING: "#EC4899",
  LOGICIELS: "#06B6D4",
  FORMATION: "#F59E0B",
  COMPTABILITE: "#10B981",
  ASSURANCE: "#EF4444",
  ORIAS: "#C9A84C",
  DOMICILIATION: "#F97316",
  AUTRE: "#6B7280",
};

const MOIS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

interface Props { expenses: Expense[] }

export function ExpenseChart({ expenses }: Props) {
  const now = new Date();

  const byCategory = expenses
    .filter((e) => { const d = new Date(e.dateDepense); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce<Record<string, number>>((acc, e) => { acc[e.categorie] = (acc[e.categorie] ?? 0) + e.montant; return acc; }, {});
  const catData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  const last12 = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return { mois: MOIS[d.getMonth()], total: 0, _d: d };
  });
  expenses.forEach((e) => {
    const d = new Date(e.dateDepense);
    const idx = last12.findIndex((m) => m._d.getFullYear() === d.getFullYear() && m._d.getMonth() === d.getMonth());
    if (idx !== -1) last12[idx].total += e.montant;
  });

  const typeData = [
    { name: "Mensuel", value: expenses.filter((e) => e.type === "MENSUEL").reduce((s, e) => s + e.montant, 0) },
    { name: "Exceptionnel", value: expenses.filter((e) => e.type === "EXCEPTIONNEL").reduce((s, e) => s + e.montant, 0) },
  ].filter((d) => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
        <h3 className="font-semibold text-[#0F172A] mb-4 text-sm">Dépenses par catégorie (mois en cours)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={catData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => [`${Number(v ?? 0).toFixed(0)}€`]} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {catData.map((entry) => <Cell key={entry.name} fill={CAT_COLORS[entry.name] ?? "#6B7280"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
        <h3 className="font-semibold text-[#0F172A] mb-4 text-sm">Évolution sur 12 mois</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={last12}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="mois" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => [`${Number(v ?? 0).toFixed(0)}€`]} />
            <Line type="monotone" dataKey="total" stroke="#C9A84C" strokeWidth={2} dot={{ fill: "#C9A84C", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
        <h3 className="font-semibold text-[#0F172A] mb-4 text-sm">Mensuel vs Exceptionnel</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
              <Cell fill="#C9A84C" />
              <Cell fill="#E2E8F0" />
            </Pie>
            <Tooltip formatter={(v) => [`${Number(v ?? 0).toFixed(0)}€`]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
