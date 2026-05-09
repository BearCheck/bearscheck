"use client";

import { useState, useEffect, useCallback } from "react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { ExpenseForm, type ExpenseData } from "@/components/admin/finances/ExpenseForm";
import { ExpenseChart } from "@/components/admin/finances/ExpenseChart";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const CAT_COLORS: Record<string, string> = {
  HEBERGEMENT: "#3B82F6", DOMAINE: "#8B5CF6", MARKETING: "#EC4899",
  LOGICIELS: "#06B6D4", FORMATION: "#F59E0B", COMPTABILITE: "#10B981",
  ASSURANCE: "#EF4444", ORIAS: "#C9A84C", DOMICILIATION: "#F97316", AUTRE: "#6B7280",
};

const CAT_LABELS: Record<string, string> = {
  HEBERGEMENT: "Hébergement", DOMAINE: "Domaine", DOMICILIATION: "Domiciliation",
  MARKETING: "Marketing", LOGICIELS: "Logiciels", FORMATION: "Formation",
  COMPTABILITE: "Comptabilité", ASSURANCE: "Assurance", ORIAS: "ORIAS", AUTRE: "Autre",
};

interface Expense {
  id: string; titre: string; montant: number; categorie: string;
  type: string; recurrent: boolean; dateDepense: string; description?: string;
}

const PAGE_SIZE = 10;

export default function DepensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<ExpenseData | undefined>();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState<keyof Expense>("dateDepense");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/expenses");
    if (res.ok) setExpenses(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const now = new Date();
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.dateDepense);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const prevMonth = expenses.filter((e) => {
    const d = new Date(e.dateDepense);
    const pm = new Date(now.getFullYear(), now.getMonth() - 1);
    return d.getMonth() === pm.getMonth() && d.getFullYear() === pm.getFullYear();
  });
  const totalMois = thisMonth.reduce((s, e) => s + e.montant, 0);
  const totalPrevMois = prevMonth.reduce((s, e) => s + e.montant, 0);
  const evolution = totalPrevMois > 0 ? ((totalMois - totalPrevMois) / totalPrevMois) * 100 : 0;
  const fixesMois = thisMonth.filter((e) => e.type === "MENSUEL").reduce((s, e) => s + e.montant, 0);
  const exceptMois = thisMonth.filter((e) => e.type === "EXCEPTIONNEL").reduce((s, e) => s + e.montant, 0);

  const filtered = expenses
    .filter((e) => !search || e.titre.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => !filterCat || e.categorie === filterCat)
    .filter((e) => !filterType || e.type === filterType)
    .sort((a, b) => {
      const av = a[sortCol] as string | number;
      const bv = b[sortCol] as string | number;
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(col: keyof Expense) {
    if (sortCol === col) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette dépense ?")) return;
    await fetch(`/api/admin/expenses/${id}`, { method: "DELETE" });
    toast.success("Dépense supprimée");
    load();
  }

  function exportCsv() {
    const header = "Date,Titre,Catégorie,Type,Montant";
    const rows = filtered.map((e) =>
      `${new Date(e.dateDepense).toLocaleDateString("fr-FR")},${e.titre},${CAT_LABELS[e.categorie]},${e.type},${e.montant}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "depenses.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const SortBtn = ({ col }: { col: keyof Expense }) => (
    <button onClick={() => toggleSort(col)} className="ml-1 text-xs opacity-50 hover:opacity-100" aria-label={`Trier par ${col}`}>
      {sortCol === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </button>
  );

  return (
    <div className="p-8 space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Gestion des dépenses</h1>
          <p className="text-[#64748B] text-sm">Suivi de toutes les dépenses BearsCheck</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="px-4 py-2 border border-[#E2E8F0] text-sm text-[#64748B] rounded-xl hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
            ↓ CSV
          </button>
          <button onClick={() => { setEditExpense(undefined); setFormOpen(true); }}
            className="px-4 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-semibold hover:bg-[#B8973B] transition-colors">
            + Ajouter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard titre="Total ce mois" valeur={totalMois.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="💳" evolution={evolution} />
        <StatCard titre="Dépenses fixes" valeur={fixesMois.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="🔄" />
        <StatCard titre="Dépenses exceptionnelles" valeur={exceptMois.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="⚡" />
        <StatCard titre="Nb dépenses ce mois" valeur={thisMonth.length} icone="📊" />
      </div>

      <ExpenseChart expenses={expenses} />

      <div className="bg-white rounded-2xl border border-[#E2E8F0]">
        <div className="p-4 border-b border-[#E2E8F0] flex flex-wrap gap-3">
          <input placeholder="Rechercher..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 min-w-40 border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50"
            aria-label="Rechercher une dépense" />
          <select value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}
            className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50"
            aria-label="Filtrer par catégorie">
            <option value="">Toutes catégories</option>
            {Object.entries(CAT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50"
            aria-label="Filtrer par type">
            <option value="">Tous types</option>
            <option value="MENSUEL">Mensuel</option>
            <option value="EXCEPTIONNEL">Exceptionnel</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[#94A3B8]">Chargement...</div>
        ) : paged.length === 0 ? (
          <div className="py-12 text-center text-[#94A3B8]">Aucune dépense trouvée</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="text-left text-xs font-semibold text-[#64748B] uppercase px-4 py-3">
                    Date <SortBtn col="dateDepense" />
                  </th>
                  <th className="text-left text-xs font-semibold text-[#64748B] uppercase px-4 py-3">
                    Titre <SortBtn col="titre" />
                  </th>
                  <th className="text-left text-xs font-semibold text-[#64748B] uppercase px-4 py-3">Catégorie</th>
                  <th className="text-left text-xs font-semibold text-[#64748B] uppercase px-4 py-3">Type</th>
                  <th className="text-right text-xs font-semibold text-[#64748B] uppercase px-4 py-3">
                    Montant <SortBtn col="montant" />
                  </th>
                  <th className="text-center text-xs font-semibold text-[#64748B] uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {paged.map((e) => (
                  <tr key={e.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3 text-sm text-[#64748B]">
                      {new Date(e.dateDepense).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#0F172A]">{e.titre}</p>
                      {e.recurrent && <span className="text-xs text-[#94A3B8]">🔄 Récurrent</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: CAT_COLORS[e.categorie] ?? "#6B7280" }}>
                        {CAT_LABELS[e.categorie]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${e.type === "MENSUEL" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                        {e.type === "MENSUEL" ? "Mensuel" : "Exceptionnel"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#0F172A] text-sm">
                      {e.montant.toLocaleString("fr-FR")} €
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => { setEditExpense({ ...e, type: e.type as "MENSUEL" | "EXCEPTIONNEL", dateDepense: new Date(e.dateDepense).toISOString().slice(0, 10) }); setFormOpen(true); }}
                          className="text-[#94A3B8] hover:text-[#C9A84C] transition-colors" aria-label="Modifier">✏️</button>
                        <button onClick={() => handleDelete(e.id)} className="text-[#94A3B8] hover:text-red-500 transition-colors" aria-label="Supprimer">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0]">
            <p className="text-xs text-[#94A3B8]">{filtered.length} résultats</p>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg disabled:opacity-40 hover:border-[#C9A84C] transition-colors">
                ←
              </button>
              <span className="px-3 py-1.5 text-xs">{page}/{totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg disabled:opacity-40 hover:border-[#C9A84C] transition-colors">
                →
              </button>
            </div>
          </div>
        )}
      </div>

      <ExpenseForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditExpense(undefined); }}
        onSaved={load} initial={editExpense} />
    </div>
  );
}
