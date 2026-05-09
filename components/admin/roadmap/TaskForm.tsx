"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/ui/Modal";
import toast from "react-hot-toast";

export interface TaskData {
  id?: string;
  titre: string;
  description: string;
  priorite: "CRITIQUE" | "HAUTE" | "MOYENNE" | "BASSE";
  statut: "A_FAIRE" | "EN_COURS" | "EN_PAUSE" | "TERMINE" | "ANNULE";
  dateDebut: string;
  dateFin: string;
  dureeEstimee: string;
  tags: string[];
  progression: number;
  ordre?: number;
}

interface Props { isOpen: boolean; onClose: () => void; onSaved: () => void; initial?: TaskData }

const PRIORITIES = ["CRITIQUE", "HAUTE", "MOYENNE", "BASSE"] as const;
const STATUTS = ["A_FAIRE", "EN_COURS", "EN_PAUSE", "TERMINE", "ANNULE"] as const;
const STATUT_LABELS: Record<string, string> = {
  A_FAIRE: "À faire", EN_COURS: "En cours", EN_PAUSE: "En pause", TERMINE: "Terminé", ANNULE: "Annulé",
};
const PRIORITY_LABELS: Record<string, string> = {
  CRITIQUE: "🔴 Critique", HAUTE: "🟠 Haute", MOYENNE: "🟡 Moyenne", BASSE: "🟢 Basse",
};

const DEFAULT: TaskData = {
  titre: "", description: "", priorite: "MOYENNE", statut: "A_FAIRE",
  dateDebut: "", dateFin: "", dureeEstimee: "", tags: [], progression: 0,
};

export function TaskForm({ isOpen, onClose, onSaved, initial }: Props) {
  const [form, setForm] = useState<TaskData>(initial ?? DEFAULT);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof TaskData>(k: K, v: TaskData[K]) => setForm((f) => ({ ...f, [k]: v }));

  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) set("tags", [...form.tags, tagInput.trim()]);
      setTagInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = form.id ? `/api/admin/roadmap/${form.id}` : "/api/admin/roadmap";
      const method = form.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          dureeEstimee: form.dureeEstimee ? parseInt(form.dureeEstimee) : undefined,
          dateDebut: form.dateDebut || undefined,
          dateFin: form.dateFin || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(form.id ? "Tâche mise à jour" : "Tâche créée");
      onSaved();
      onClose();
      setForm(DEFAULT);
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} titre={form.id ? "Modifier la tâche" : "Nouvelle tâche"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="task-titre">Titre *</label>
          <input id="task-titre" required value={form.titre} onChange={(e) => set("titre", e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="task-prio">Priorité</label>
            <select id="task-prio" value={form.priorite} onChange={(e) => set("priorite", e.target.value as TaskData["priorite"])}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50">
              {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="task-statut">Statut</label>
            <select id="task-statut" value={form.statut} onChange={(e) => set("statut", e.target.value as TaskData["statut"])}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50">
              {STATUTS.map((s) => <option key={s} value={s}>{STATUT_LABELS[s]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="task-debut">Date début</label>
            <input id="task-debut" type="date" value={form.dateDebut} onChange={(e) => set("dateDebut", e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="task-fin">Date fin</label>
            <input id="task-fin" type="date" value={form.dateFin} onChange={(e) => set("dateFin", e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="task-duree">Durée estimée (h)</label>
            <input id="task-duree" type="number" min="0" value={form.dureeEstimee}
              onChange={(e) => set("dureeEstimee", e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="task-prog">
              Progression ({form.progression}%)
            </label>
            <input id="task-prog" type="range" min="0" max="100" step="5" value={form.progression}
              onChange={(e) => set("progression", parseInt(e.target.value))}
              className="w-full accent-[#C9A84C]" aria-label="Progression en pourcentage" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="task-tags">
            Tags <span className="text-xs text-[#94A3B8]">(Entrée pour ajouter)</span>
          </label>
          <input id="task-tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag}
            placeholder="Ajouter un tag..." className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F5E6C8] text-[#C9A84C] text-xs rounded-full font-medium">
                  {tag}
                  <button type="button" onClick={() => set("tags", form.tags.filter((t) => t !== tag))} aria-label={`Supprimer le tag ${tag}`} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="task-desc">Description</label>
          <textarea id="task-desc" rows={3} value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 resize-none" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#64748B]">Annuler</button>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-semibold hover:bg-[#B8973B] disabled:opacity-50">
            {loading ? "..." : form.id ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
