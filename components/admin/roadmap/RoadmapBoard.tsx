"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, useDroppable,
  type DragEndEvent, type DragOverEvent, type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "./TaskCard";
import { TaskForm, type TaskData } from "./TaskForm";
import toast from "react-hot-toast";
import { ProgressBar } from "@/components/admin/ui/ProgressBar";

type Statut = "A_FAIRE" | "EN_COURS" | "EN_PAUSE" | "TERMINE" | "ANNULE";
type Task = TaskData & { id: string; sousTaches?: TaskData[] };

const COLUMNS: { key: Statut; label: string; emoji: string; color: string }[] = [
  { key: "A_FAIRE",  label: "À faire",  emoji: "📋", color: "border-t-slate-400" },
  { key: "EN_COURS", label: "En cours", emoji: "🔄", color: "border-t-blue-500" },
  { key: "EN_PAUSE", label: "En pause", emoji: "⏸️", color: "border-t-amber-500" },
  { key: "TERMINE",  label: "Terminé",  emoji: "✅", color: "border-t-green-500" },
];

const COLUMN_KEYS = new Set(COLUMNS.map((c) => c.key));

function DroppableColumn({ id, children, isOver }: { id: string; children: React.ReactNode; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`min-h-20 space-y-2 transition-colors rounded-xl ${isOver ? "bg-[#C9A84C]/10 ring-2 ring-[#C9A84C]/30" : ""}`}>
      {children}
    </div>
  );
}

interface Props { tasks: Task[]; onRefresh: () => void }

export function RoadmapBoard({ tasks, onRefresh }: Props) {
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();

  // Sync local state when parent refreshes
  useEffect(() => {
    setLocalTasks([...tasks].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0)));
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const activeTask = activeId ? localTasks.find((t) => t.id === activeId) : null;
  const done = localTasks.filter((t) => t.statut === "TERMINE").length;
  const globalPct = localTasks.length > 0
    ? Math.round(localTasks.reduce((s, t) => s + (t.progression ?? 0), 0) / localTasks.length)
    : 0;

  function findColumn(id: string): Statut | null {
    if (COLUMN_KEYS.has(id as Statut)) return id as Statut;
    return localTasks.find((t) => t.id === id)?.statut ?? null;
  }

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) { setOverColumnId(null); return; }

    const activeId = String(active.id);
    const overId = String(over.id);

    const overCol = findColumn(overId);
    setOverColumnId(overCol);

    if (!overCol) return;

    const activeTask = localTasks.find((t) => t.id === activeId);
    if (!activeTask || activeTask.statut === overCol) return;

    // Optimistically move the task to the new column while dragging
    setLocalTasks((prev) => {
      const withoutActive = prev.filter((t) => t.id !== activeId);
      const updated = { ...activeTask, statut: overCol };

      // Insert before overTask if hovering over a task, else append
      if (!COLUMN_KEYS.has(overId as Statut)) {
        const overIdx = withoutActive.findIndex((t) => t.id === overId);
        if (overIdx !== -1) {
          const next = [...withoutActive];
          next.splice(overIdx, 0, updated);
          return next;
        }
      }
      return [...withoutActive, updated];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTasks]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverColumnId(null);

    if (!over) {
      // Revert to server state
      setLocalTasks([...tasks].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0)));
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeTask = localTasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const overCol = findColumn(overId);
    if (!overCol) return;

    let finalTasks = [...localTasks];

    if (activeTask.statut === overCol && !COLUMN_KEYS.has(overId as Statut)) {
      // Same column — reorder
      const colTasks = finalTasks.filter((t) => t.statut === overCol);
      const activeIdx = colTasks.findIndex((t) => t.id === activeId);
      const overIdx = colTasks.findIndex((t) => t.id === overId);

      if (activeIdx !== -1 && overIdx !== -1 && activeIdx !== overIdx) {
        const reordered = arrayMove(colTasks, activeIdx, overIdx);
        const reorderedIds = new Set(reordered.map((t) => t.id));
        finalTasks = [
          ...finalTasks.filter((t) => !reorderedIds.has(t.id)),
          ...reordered,
        ];
      }
    }
    // Cross-column was already handled optimistically in handleDragOver

    setLocalTasks(finalTasks);

    // Collect all affected columns and build update payload
    const affectedCols = new Set([activeTask.statut, overCol]);
    const updates: { id: string; ordre: number; statut: string }[] = [];

    for (const col of affectedCols) {
      finalTasks
        .filter((t) => t.statut === col)
        .forEach((t, i) => updates.push({ id: t.id, ordre: i, statut: t.statut as string }));
    }

    try {
      const res = await fetch("/api/admin/roadmap/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
      setLocalTasks([...tasks].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTasks, tasks]);

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
      {/* Header stats */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-wrap items-center gap-6">
        <div className="flex gap-4 text-sm">
          <span className="font-semibold text-[#0F172A]">📊 {localTasks.length} tâches</span>
          <span className="text-blue-600">🔄 {localTasks.filter((t) => t.statut === "EN_COURS").length} en cours</span>
          <span className="text-green-600">✅ {done} terminées</span>
        </div>
        <div className="flex-1 min-w-48">
          <p className="text-xs text-[#64748B] mb-1">Progression globale</p>
          <ProgressBar valeur={globalPct} showLabel animated />
        </div>
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span>↕ Glisser pour réordonner</span>
        </div>
        <button
          onClick={() => { setEditTask(undefined); setFormOpen(true); }}
          className="px-4 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-semibold hover:bg-[#B8973B] transition-colors"
        >
          + Nouvelle tâche
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map(({ key, label, emoji, color }) => {
            const colTasks = localTasks.filter((t) => t.statut === key);
            const isOver = overColumnId === key;

            return (
              <div
                key={key}
                className={`rounded-2xl border border-[#E2E8F0] border-t-4 ${color} p-3 transition-colors ${isOver ? "bg-[#F5E6C8]/40" : "bg-[#F8FAFC]"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#0F172A] text-sm">{emoji} {label}</h3>
                  <span className="bg-white border border-[#E2E8F0] text-[#64748B] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {colTasks.length}
                  </span>
                </div>

                <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <DroppableColumn id={key} isOver={isOver && colTasks.length === 0}>
                    {colTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onComplete={handleComplete}
                      />
                    ))}
                    {colTasks.length === 0 && (
                      <p className="text-xs text-[#CBD5E1] text-center py-4 select-none">
                        Déposer ici
                      </p>
                    )}
                  </DroppableColumn>
                </SortableContext>
              </div>
            );
          })}
        </div>

        {typeof document !== "undefined" && createPortal(
          <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
            {activeTask && (
              <div className="rotate-1 opacity-90 scale-105">
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onComplete={() => {}}
                />
              </div>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      <TaskForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditTask(undefined); }}
        onSaved={onRefresh}
        initial={editTask}
      />
    </div>
  );
}
