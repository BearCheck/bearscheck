"use client";

import { useState, useCallback } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { TaskForm, type TaskData } from "./TaskForm";
import toast from "react-hot-toast";
import { ProgressBar } from "@/components/admin/ui/ProgressBar";

type Task = TaskData & { id: string; sousTaches?: TaskData[] };

const COLUMNS: { key: Task["statut"]; label: string; emoji: string; color: string }[] = [
  { key: "A_FAIRE",  label: "À faire",  emoji: "📋", color: "border-t-slate-400" },
  { key: "EN_COURS", label: "En cours", emoji: "🔄", color: "border-t-blue-500" },
  { key: "EN_PAUSE", label: "En pause", emoji: "⏸️", color: "border-t-amber-500" },
  { key: "TERMINE",  label: "Terminé",  emoji: "✅", color: "border-t-green-500" },
];

interface Props { tasks: Task[]; onRefresh: () => void }

export function RoadmapBoard({ tasks, onRefresh }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const done = tasks.filter((t) => t.statut === "TERMINE").length;
  const globalPct = tasks.length > 0
    ? Math.round(tasks.reduce((s, t) => s + t.progression, 0) / tasks.length)
    : 0;

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const targetCol = over.id as Task["statut"];
    if (!COLUMNS.find((c) => c.key === targetCol)) return;
    try {
      await fetch(`/api/admin/roadmap/${active.id}/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: targetCol }),
      });
      onRefresh();
    } catch {
      toast.error("Erreur lors du déplacement");
    }
  }, [onRefresh]);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette tâche ?")) return;
    await fetch(`/api/admin/roadmap/${id}`, { method: "DELETE" });
    toast.success("Tâche supprimée");
    onRefresh();
  }

  async function handleComplete(id: string) {
    await fetch(`/api/admin/roadmap/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: "TERMINE", progression: 100 }),
    });
    toast.success("Tâche terminée ✅");
    onRefresh();
  }

  function handleEdit(task: Task) {
    setEditTask({
      ...task,
      dateDebut: task.dateDebut ? new Date(task.dateDebut as string).toISOString().slice(0, 10) : "",
      dateFin: task.dateFin ? new Date(task.dateFin as string).toISOString().slice(0, 10) : "",
      dureeEstimee: task.dureeEstimee?.toString() ?? "",
      progression: task.progression ?? 0,
      tags: task.tags ?? [],
    });
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-wrap items-center gap-6">
        <div className="flex gap-4 text-sm">
          <span className="font-semibold text-[#0F172A]">📊 {tasks.length} tâches</span>
          <span className="text-blue-600">🔄 {tasks.filter((t) => t.statut === "EN_COURS").length} en cours</span>
          <span className="text-green-600">✅ {done} terminées</span>
        </div>
        <div className="flex-1 min-w-48">
          <p className="text-xs text-[#64748B] mb-1">Progression globale</p>
          <ProgressBar valeur={globalPct} showLabel animated />
        </div>
        <button onClick={() => { setEditTask(undefined); setFormOpen(true); }}
          className="px-4 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-semibold hover:bg-[#B8973B] transition-colors">
          + Nouvelle tâche
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map(({ key, label, emoji, color }) => {
            const colTasks = tasks.filter((t) => t.statut === key);
            return (
              <div key={key} id={key} className={`bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] border-t-4 ${color} p-3`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#0F172A] text-sm">{emoji} {label}</h3>
                  <span className="bg-white border border-[#E2E8F0] text-[#64748B] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {colTasks.length}
                  </span>
                </div>
                <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 min-h-20">
                    {colTasks.map((task) => (
                      <TaskCard key={task.id} task={task}
                        onEdit={handleEdit} onDelete={handleDelete} onComplete={handleComplete} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>

      <TaskForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditTask(undefined); }}
        onSaved={onRefresh} initial={editTask} />
    </div>
  );
}
