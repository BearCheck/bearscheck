"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/ui/Modal";
import toast from "react-hot-toast";

export interface ExpenseData {
  id?: string;
  titre: string;
  montant: number;
  categorie: string;
  type: "MENSUEL" | "EXCEPTIONNEL";
  recurrent: boolean;
  dateDepense: string;
  description?: string;
}

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initial?: ExpenseData;
}

const CATEGORIES = [
  { value: "HEBERGEMENT", label: "Hébergement", icon: "🖥️" },
  { value: "DOMAINE", label: "Domaine", icon: "🌐" },
  { value: "DOMICILIATION", label: "Domiciliation", icon: "🏠" },
  { value: "MARKETING", label: "Marketing", icon: "📣" },
  { value: "LOGICIELS", label: "Logiciels", icon: "💻" },
  { value: "FORMATION", label: "Formation", icon: "📚" },
  { value: "COMPTABILITE", label: "Comptabilité", icon: "📊" },
  { value: "ASSURANCE", label: "Assurance", icon: "🛡️" },
  { value: "ORIAS", label: "ORIAS", icon: "📋" },
  { value: "AUTRE", label: "Autre", icon: "📌" },
];

const DEFAULT: ExpenseData = {
  titre: "", montant: 0, categorie: "AUTRE", type: "MENSUEL",
  recurrent: false, dateDepense: new Date().toISOString().slice(0, 10),
};

export function ExpenseForm({ isOpen, onClose, onSaved, initial }: ExpenseFormProps) {
  const [form, setForm] = useState<ExpenseData>(initial ?? DEFAULT);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof ExpenseData, v: ExpenseData[keyof ExpenseData]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = form.id ? `/api/admin/expenses/${form.id}` : "/api/admin/expenses";
      const method = form.id ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast.success(form.id ? "Dépense mise à jour" : "Dépense ajoutée");
      onSaved();
      onClose();
      setForm(DEFAULT);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} titre={form.id ? "Modifier la dépense" : "Nouvelle dépense"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="exp-titre">Titre *</label>
            <input id="exp-titre" required value={form.titre} onChange={(e) => set("titre", e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50"
              placeholder="Ex: Vercel Pro" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="exp-montant">Montant (€) *</label>
            <input id="exp-montant" type="number" step="0.01" min="0" required value={form.montant}
              onChange={(e) => set("montant", parseFloat(e.target.value))}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="exp-date">Date *</label>
            <input id="exp-date" type="date" required value={form.dateDepense}
              onChange={(e) => set("dateDepense", e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="exp-cat">Catégorie *</label>
            <select id="exp-cat" value={form.categorie} onChange={(e) => set("categorie", e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Type</label>
            <div className="flex gap-2">
              {(["MENSUEL", "EXCEPTIONNEL"] as const).map((t) => (
                <button key={t} type="button" onClick={() => set("type", t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${form.type === t ? "bg-[#C9A84C] text-white border-[#C9A84C]" : "border-[#E2E8F0] text-[#64748B] hover:border-[#C9A84C]"}`}>
                  {t === "MENSUEL" ? "Mensuel" : "Exceptionnel"}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <button type="button" onClick={() => set("recurrent", !form.recurrent)}
              className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${form.recurrent ? "bg-[#C9A84C]" : "bg-[#E2E8F0]"}`}
              role="switch" aria-checked={form.recurrent} aria-label="Récurrent">
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${form.recurrent ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
            <label className="text-sm text-[#374151]">Dépense récurrente</label>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="exp-desc">Description</label>
            <textarea id="exp-desc" rows={2} value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 resize-none"
              placeholder="Notes optionnelles..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Annuler</button>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-semibold hover:bg-[#B8973B] transition-colors disabled:opacity-50">
            {loading ? "Enregistrement..." : form.id ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
