"use client";

import { CalendarView } from "@/components/admin/calendrier/CalendarView";
import { Toaster } from "react-hot-toast";

export default function CalendrierPage() {
  return (
    <div className="p-8 space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Calendrier</h1>
        <p className="text-[#64748B] text-sm">Gérez vos événements, échéances et réunions</p>
      </div>
      <CalendarView />
    </div>
  );
}
