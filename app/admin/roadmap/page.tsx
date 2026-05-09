"use client";

import { useState, useEffect, useCallback } from "react";
import { RoadmapBoard } from "@/components/admin/roadmap/RoadmapBoard";
import { Toaster } from "react-hot-toast";
import type { TaskData } from "@/components/admin/roadmap/TaskForm";

type Task = TaskData & { id: string; sousTaches?: TaskData[] };

export default function RoadmapPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/roadmap");
    if (res.ok) setTasks(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-8 space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Roadmap</h1>
        <p className="text-[#64748B] text-sm">Gérez les tâches et suivez la progression du projet</p>
      </div>
      {loading ? (
        <div className="py-12 text-center text-[#94A3B8]">Chargement...</div>
      ) : (
        <RoadmapBoard tasks={tasks} onRefresh={load} />
      )}
    </div>
  );
}
