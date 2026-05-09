"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ProgressBar } from "@/components/admin/ui/ProgressBar";
import type { TaskData } from "./TaskForm";

const PRIORITY_CFG: Record<string, { label: string; color: string; bg: string }> = {
  CRITIQUE: { label: "Critique", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  HAUTE:    { label: "Haute",    color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  MOYENNE:  { label: "Moyenne",  color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  BASSE:    { label: "Basse",    color: "text-green-700", bg: "bg-green-50 border-green-200" },
};

const PRIORITY_EMOJI: Record<string, string> = {
  CRITIQUE: "🔴", HAUTE: "🟠", MOYENNE: "🟡", BASSE: "🟢",
};

interface Props {
  task: TaskData & { id: string; sousTaches?: TaskData[] };
  onEdit: (t: TaskData & { id: string }) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete, onComplete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const pc = PRIORITY_CFG[task.priorite] ?? PRIORITY_CFG.MOYENNE;

  const daysLeft = task.dateFin
    ? Math.ceil((new Date(task.dateFin).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div ref={setNodeRef} style={style} {...attributes}
      className="bg-white rounded-xl border border-[#E2E8F0] p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing select-none">
      <div className="flex items-start gap-2 mb-2" {...listeners}>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#0F172A] text-sm leading-tight truncate">{task.titre}</p>
          {task.description && <p className="text-xs text-[#94A3B8] mt-0.5 line-clamp-2">{task.description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${pc.bg} ${pc.color}`}>
          {PRIORITY_EMOJI[task.priorite]} {pc.label}
        </span>
        {task.dureeEstimee && (
          <span className="text-xs text-[#94A3B8]">⏱ {task.dureeEstimee}h</span>
        )}
        {daysLeft !== null && task.statut !== "TERMINE" && (
          <span className={`text-xs font-medium ${daysLeft < 0 ? "text-red-600" : daysLeft <= 3 ? "text-amber-600" : "text-[#94A3B8]"}`}>
            {daysLeft < 0 ? `⚠️ ${Math.abs(daysLeft)}j de retard` : `📅 ${daysLeft}j restants`}
          </span>
        )}
      </div>

      {task.progression > 0 && (
        <div className="mb-2">
          <ProgressBar valeur={task.progression} showLabel size="sm" />
        </div>
      )}

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 bg-[#F5E6C8] text-[#C9A84C] rounded font-medium">{tag}</span>
          ))}
          {task.tags.length > 3 && <span className="text-xs text-[#94A3B8]">+{task.tags.length - 3}</span>}
        </div>
      )}

      {task.sousTaches && task.sousTaches.length > 0 && (
        <p className="text-xs text-[#94A3B8] mb-2">
          {task.sousTaches.filter((s) => s.statut === "TERMINE").length}/{task.sousTaches.length} sous-tâches
        </p>
      )}

      <div className="flex items-center gap-1 pt-1 border-t border-[#F1F5F9]">
        <button onClick={() => onEdit(task)} className="flex-1 text-xs py-1 text-[#64748B] hover:text-[#C9A84C] transition-colors" aria-label="Modifier la tâche">
          ✏️ Éditer
        </button>
        {task.statut !== "TERMINE" && (
          <button onClick={() => onComplete(task.id)} className="flex-1 text-xs py-1 text-[#64748B] hover:text-green-600 transition-colors" aria-label="Marquer comme terminé">
            ✅ Terminer
          </button>
        )}
        <button onClick={() => onDelete(task.id)} className="text-xs py-1 px-2 text-[#64748B] hover:text-red-600 transition-colors" aria-label="Supprimer la tâche">
          🗑️
        </button>
      </div>
    </div>
  );
}
