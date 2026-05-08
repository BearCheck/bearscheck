import { getProSession } from "@/lib/pro-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Activity, QrCode, BarChart3, TrendingUp } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

async function getActivity(companyId: string) {
  try {
    const events = await prisma.affiliateEvent.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, type: true, createdAt: true },
    });
    const byType = {
      SCAN:              events.filter((e) => e.type === "SCAN").length,
      COMPARISON:        events.filter((e) => e.type === "COMPARISON").length,
      CONVERSION_INTENT: events.filter((e) => e.type === "CONVERSION_INTENT").length,
    };
    return { events, byType };
  } catch {
    return { events: [], byType: { SCAN: 0, COMPARISON: 0, CONVERSION_INTENT: 0 } };
  }
}

const TYPE_CONFIG = {
  SCAN:               { label: "Scan QR code",      icon: QrCode,    color: "text-blue-600 bg-blue-50 border-blue-200" },
  COMPARISON:         { label: "Comparaison lancée", icon: BarChart3, color: "text-violet-600 bg-violet-50 border-violet-200" },
  CONVERSION_INTENT:  { label: "Intention d'achat",  icon: TrendingUp, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
};

export default async function ActivitePage() {
  const session = await getProSession();
  if (!session) redirect("/pro/connexion");

  const { events, byType } = await getActivity(session.sub);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Activité</h1>
        <p className="text-[#6B7280] text-sm mt-1">Historique complet des interactions via votre lien affilié.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Object.entries(byType).map(([type, count]) => {
          const cfg = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG];
          return (
            <div key={type} className="bg-white rounded-2xl p-5 border border-[#E5D8BC] flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#F5E6C8] flex items-center justify-center shrink-0">
                <cfg.icon className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A]">{count}</p>
                <p className="text-xs text-[#6B7280]">{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-[#E5D8BC] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5D8BC] flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#C9A84C]" />
          <h2 className="font-semibold text-[#1A1A1A]">Derniers événements ({events.length})</h2>
        </div>

        {events.length === 0 ? (
          <div className="py-16 text-center">
            <Activity className="h-10 w-10 text-[#E5D8BC] mx-auto mb-3" />
            <p className="text-[#9CA3AF]">Aucune activité pour le moment</p>
            <p className="text-xs text-[#C9A84C] mt-1">Partagez votre lien ou QR code pour commencer</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F5F0E8]">
            {events.map((ev) => {
              const cfg = TYPE_CONFIG[ev.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.SCAN;
              const Icon = cfg.icon;
              return (
                <div key={ev.id} className="flex items-center gap-4 px-6 py-3 hover:bg-[#FAFAFA]">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color} shrink-0`}>
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                  <div className="flex-1 min-w-0" />
                  <div className="text-right shrink-0">
                    <p className="text-xs text-[#9CA3AF]">
                      {formatDistanceToNow(new Date(ev.createdAt), { addSuffix: true, locale: fr })}
                    </p>
                    <p className="text-[10px] text-[#C9A84C]">
                      {format(new Date(ev.createdAt), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
