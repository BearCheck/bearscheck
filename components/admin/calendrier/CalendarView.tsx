"use client";

import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "@/components/admin/ui/Modal";
import toast from "react-hot-toast";

interface CalEvent {
  id: string;
  titre: string;
  description?: string | null;
  dateDebut: string;
  dateFin?: string | null;
  allDay: boolean;
  couleur: string;
  categorie: string;
  rappel?: number | null;
}

const CAT_ICONS: Record<string, string> = {
  REUNION: "👥", DEADLINE: "⏰", ADMINISTRATIF: "📋",
  FISCAL: "💰", PERSONNEL: "👤", AUTRE: "📌",
};
const CAT_COLORS: Record<string, string> = {
  REUNION: "#3B82F6", DEADLINE: "#EF4444", ADMINISTRATIF: "#8B5CF6",
  FISCAL: "#C9A84C", PERSONNEL: "#10B981", AUTRE: "#6B7280",
};
const CATEGORIES = Object.keys(CAT_ICONS);

interface FormData {
  id?: string;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  allDay: boolean;
  categorie: string;
  couleur: string;
  rappel: string;
}

const emptyForm = (): FormData => ({
  titre: "", description: "", dateDebut: "", dateFin: "",
  allDay: true, categorie: "AUTRE", couleur: "#C9A84C", rappel: "",
});

export function CalendarView() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/calendar");
    if (res.ok) setEvents(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  const fcEvents = events.map((e) => ({
    id: e.id,
    title: e.titre,
    start: e.dateDebut,
    end: e.dateFin ?? undefined,
    allDay: e.allDay,
    backgroundColor: e.couleur,
    borderColor: e.couleur,
    extendedProps: { categorie: e.categorie, description: e.description },
  }));

  function handleDateSelect(sel: DateSelectArg) {
    setForm({ ...emptyForm(), dateDebut: sel.startStr.slice(0, 16), dateFin: sel.endStr?.slice(0, 16) ?? "", allDay: sel.allDay });
    setModal(true);
  }

  function handleEventClick(info: EventClickArg) {
    const ev = events.find((e) => e.id === info.event.id);
    if (!ev) return;
    setForm({
      id: ev.id,
      titre: ev.titre,
      description: ev.description ?? "",
      dateDebut: new Date(ev.dateDebut).toISOString().slice(0, 16),
      dateFin: ev.dateFin ? new Date(ev.dateFin).toISOString().slice(0, 16) : "",
      allDay: ev.allDay,
      categorie: ev.categorie,
      couleur: ev.couleur,
      rappel: ev.rappel?.toString() ?? "",
    });
    setModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = form.id ? `/api/admin/calendar/${form.id}` : "/api/admin/calendar";
      const method = form.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: form.titre,
          description: form.description || undefined,
          dateDebut: new Date(form.dateDebut).toISOString(),
          dateFin: form.dateFin ? new Date(form.dateFin).toISOString() : undefined,
          allDay: form.allDay,
          categorie: form.categorie,
          couleur: form.couleur,
          rappel: form.rappel ? parseInt(form.rappel) : undefined,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(form.id ? "Événement mis à jour" : "Événement créé");
      setModal(false);
      setForm(emptyForm());
      load();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  }

  async function handleDelete() {
    if (!form.id) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/calendar/${form.id}`, { method: "DELETE" });
      toast.success("Événement supprimé");
      setModal(false);
      setForm(emptyForm());
      load();
    } catch {
      toast.error("Erreur");
    } finally {
      setDeleting(false);
    }
  }

  const upcomingEvents = events
    .filter((e) => new Date(e.dateDebut) >= new Date())
    .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime())
    .slice(0, 5);

  return (
    <div className="flex gap-6">
      <div className="flex-1 bg-white rounded-2xl border border-[#E2E8F0] p-5 calendar-admin">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="fr"
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
          editable
          selectable
          eventClick={handleEventClick}
          select={handleDateSelect}
          events={fcEvents}
          height="auto"
          buttonText={{ today: "Aujourd'hui", month: "Mois", week: "Semaine", day: "Jour" }}
        />
      </div>

      <div className="w-64 shrink-0 space-y-4">
        <button onClick={() => { setForm(emptyForm()); setModal(true); }}
          className="w-full py-2.5 bg-[#C9A84C] text-white rounded-xl font-semibold text-sm hover:bg-[#B8973B] transition-colors">
          + Nouvel événement
        </button>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <h3 className="font-semibold text-[#0F172A] text-sm mb-3">Prochains événements</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-xs text-[#94A3B8]">Aucun événement à venir</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="flex items-start gap-2 text-xs">
                  <span className="mt-0.5">{CAT_ICONS[ev.categorie] ?? "📌"}</span>
                  <div>
                    <p className="font-medium text-[#0F172A]">{ev.titre}</p>
                    <p className="text-[#94A3B8]">{new Date(ev.dateDebut).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <h3 className="font-semibold text-[#0F172A] text-sm mb-3">Catégories</h3>
          <div className="space-y-1.5">
            {CATEGORIES.map((cat) => (
              <div key={cat} className="flex items-center gap-2 text-xs">
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: CAT_COLORS[cat] }} />
                <span className="text-[#64748B]">{CAT_ICONS[cat]} {cat.charAt(0) + cat.slice(1).toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => { setModal(false); setForm(emptyForm()); }}
        titre={form.id ? "Modifier l'événement" : "Nouvel événement"} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="cal-titre">Titre *</label>
            <input id="cal-titre" required value={form.titre} onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="cal-debut">Début *</label>
              <input id="cal-debut" type={form.allDay ? "date" : "datetime-local"} required value={form.dateDebut}
                onChange={(e) => setForm((f) => ({ ...f, dateDebut: e.target.value }))}
                className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="cal-fin">Fin</label>
              <input id="cal-fin" type={form.allDay ? "date" : "datetime-local"} value={form.dateFin}
                onChange={(e) => setForm((f) => ({ ...f, dateFin: e.target.value }))}
                className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm((f) => ({ ...f, allDay: !f.allDay }))}
              className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${form.allDay ? "bg-[#C9A84C]" : "bg-[#E2E8F0]"}`}
              role="switch" aria-checked={form.allDay} aria-label="Toute la journée">
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${form.allDay ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
            <label className="text-sm text-[#374151]">Toute la journée</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="cal-cat">Catégorie</label>
              <select id="cal-cat" value={form.categorie} onChange={(e) => setForm((f) => ({ ...f, categorie: e.target.value, couleur: CAT_COLORS[e.target.value] ?? "#C9A84C" }))}
                className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50">
                {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="cal-rappel">Rappel</label>
              <select id="cal-rappel" value={form.rappel} onChange={(e) => setForm((f) => ({ ...f, rappel: e.target.value }))}
                className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50">
                <option value="">Aucun</option>
                <option value="15">15 min avant</option>
                <option value="60">1 heure avant</option>
                <option value="1440">1 jour avant</option>
                <option value="10080">1 semaine avant</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1" htmlFor="cal-desc">Description</label>
            <textarea id="cal-desc" rows={2} value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 resize-none" />
          </div>
          <div className="flex justify-between pt-2">
            {form.id && (
              <button type="button" onClick={handleDelete} disabled={deleting}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50">
                Supprimer
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm text-[#64748B]">Annuler</button>
              <button type="submit" className="px-6 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-semibold hover:bg-[#B8973B]">
                {form.id ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
