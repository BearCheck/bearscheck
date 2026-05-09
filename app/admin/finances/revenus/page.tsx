"use client";

import { useState, useEffect, useCallback } from "react";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Modal } from "@/components/admin/ui/Modal";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

interface Revenue {
  id: string; titre: string; montant: number;
  source: string; dateRevenu: string; description?: string;
}

const SOURCES = ["Affiliation", "Commission", "Partenariat", "Publicité", "Abonnement", "Autre"];

const DEFAULT_FORM = { titre: "", montant: 0, source: "Affiliation", dateRevenu: new Date().toISOString().slice(0, 10), description: "" };

export default function RevenusPage() {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editRev, setEditRev] = useState<Revenue | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/revenues");
    if (res.ok) setRevenues(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const now = new Date();
  const thisMonth = revenues.filter((r) => {
    const d = new Date(r.dateRevenu);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalMois = thisMonth.reduce((s, r) => s + r.montant, 0);
  const totalAll = revenues.reduce((s, r) => s + r.montant, 0);

  function openCreate() { setEditRev(null); setForm(DEFAULT_FORM); setFormOpen(true); }
  function openEdit(r: Revenue) {
    setEditRev(r);
    setForm({ titre: r.titre, montant: r.montant, source: r.source, dateRevenu: new Date(r.dateRevenu).toISOString().slice(0, 10), description: r.description ?? "" });
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editRev ? `/api/admin/revenues/${editRev.id}` : "/api/admin/revenues";
      const method = editRev ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast.success(editRev ? "Revenu mis à jour" : "Revenu ajouté");
      setFormOpen(false);
      load();
    } catch {
      toast.error("Erreur");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce revenu ?")) return;
    await fetch(`/api/admin/revenues/${id}`, { method: "DELETE" });
    toast.success("Revenu supprimé");
    load();
  }

  return (
    <div className="p-8 space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Gestion des revenus</h1>
          <p className="text-[#64748B] text-sm">Suivi de tous les revenus BearsCheck</p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-semibold hover:bg-[#B8973B]">
          + Ajouter
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard titre="Revenus ce mois" valeur={totalMois.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="💰" />
        <StatCard titre="Total revenus" valeur={totalAll.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="📈" />
        <StatCard titre="Nb entrées ce mois" valeur={thisMonth.length} icone="📊" />
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="text-left text-xs font-semibold text-[#64748B] uppercase px-4 py-3">Date</th>
              <th className="text-left text-xs font-semibold text-[#64748B] uppercase px-4 py-3">Titre</th>
              <th className="text-left text-xs font-semibold text-[#64748B] uppercase px-4 py-3">Source</th>
              <th className="text-right text-xs font-semibold text-[#64748B] uppercase px-4 py-3">Montant</th>
              <th className="text-center text-xs font-semibold text-[#64748B] uppercase px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {loading ? (
              <tr><td colSpan={5} className="py-12 text-center text-[#94A3B8]">Chargement...</td></tr>
            ) : revenues.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-[#94A3B8]">Aucun revenu enregistré</td></tr>
            ) : revenues.map((r) => (
              <tr key={r.id} className="hover:bg-[#FAFAFA] transition-colors">
                <td className="px-4 py-3 text-sm text-[#64748B]">{new Date(r.dateRevenu).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#0F172A]">{r.titre}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 bg-[#F5E6C8] text-[#C9A84C] rounded-full font-medium">{r.source}</span>
                </td>
                <td className="px-4 py-3 text-right font-bold text-green-700 text-sm">+{r.montant.toLocaleString("fr-FR")} €</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openEdit(r)} className="text-[#94A3B8] hover:text-[#C9A84C]" aria-label="Modifier">✏️</button>
                    <button onClick={() => handleDelete(r.id)} className="text-[#94A3B8] hover:text-red-500" aria-label="Supprimer">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} titre={editRev ? "Modifier le revenu" : "Nouveau revenu"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="rev-titre">Titre *</label>
            <input id="rev-titre" required value={form.titre} onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="rev-montant">Montant (€) *</label>
              <input id="rev-montant" type="number" step="0.01" min="0" required value={form.montant}
                onChange={(e) => setForm((f) => ({ ...f, montant: parseFloat(e.target.value) || 0 }))}
                className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="rev-date">Date *</label>
              <input id="rev-date" type="date" required value={form.dateRevenu}
                onChange={(e) => setForm((f) => ({ ...f, dateRevenu: e.target.value }))}
                className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="rev-source">Source *</label>
            <select id="rev-source" value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50">
              {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="rev-desc">Description</label>
            <textarea id="rev-desc" rows={2} value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm text-[#64748B]">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-semibold hover:bg-[#B8973B]">
              {editRev ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
