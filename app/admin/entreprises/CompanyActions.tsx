"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Ban } from "lucide-react";

interface Props {
  companyId: string;
  status: string;
  compact?: boolean;
}

export default function CompanyActions({ companyId, status, compact = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function update(newStatus: string) {
    setLoading(newStatus);
    try {
      await fetch(`/api/admin/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {status !== "ACTIVE" && (
          <button
            onClick={() => update("ACTIVE")}
            disabled={!!loading}
            title="Activer"
            className="h-7 w-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
          </button>
        )}
        {status !== "SUSPENDED" && (
          <button
            onClick={() => update("SUSPENDED")}
            disabled={!!loading}
            title="Suspendre"
            className="h-7 w-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Ban className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={() => update("ACTIVE")}
        disabled={!!loading || status === "ACTIVE"}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <CheckCircle2 className="h-4 w-4" />
        {loading === "ACTIVE" ? "..." : "Approuver"}
      </button>
      <button
        onClick={() => update("SUSPENDED")}
        disabled={!!loading || status === "SUSPENDED"}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm font-medium hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <XCircle className="h-4 w-4" />
        {loading === "SUSPENDED" ? "..." : "Rejeter"}
      </button>
    </div>
  );
}
