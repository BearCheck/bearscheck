import { getProSession } from "@/lib/pro-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { QrCode, TrendingUp, Users, DollarSign, ArrowRight, Activity, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

async function getProStats(companyId: string) {
  try {
    const [scans, comparisons, conversions, commissions, recentEvents] = await Promise.all([
      prisma.affiliateEvent.count({ where: { companyId, type: "SCAN" } }),
      prisma.affiliateEvent.count({ where: { companyId, type: "COMPARISON" } }),
      prisma.affiliateEvent.count({ where: { companyId, type: "CONVERSION_INTENT" } }),
      prisma.commission.aggregate({ where: { companyId }, _sum: { amount: true } }),
      prisma.affiliateEvent.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, type: true, createdAt: true },
      }),
    ]);
    return {
      scans, comparisons, conversions,
      totalCommissions: commissions._sum.amount ?? 0,
      recentEvents,
    };
  } catch {
    return { scans: 0, comparisons: 0, conversions: 0, totalCommissions: 0, recentEvents: [] };
  }
}

const EVENT_LABELS: Record<string, { label: string; color: string }> = {
  SCAN:               { label: "Scan QR code",     color: "text-blue-600 bg-blue-50" },
  COMPARISON:         { label: "Comparaison",       color: "text-violet-600 bg-violet-50" },
  CONVERSION_INTENT:  { label: "Intention d'achat", color: "text-emerald-600 bg-emerald-50" },
};

export default async function ProDashboardPage() {
  const session = await getProSession();
  if (!session) redirect("/pro/connexion");

  const { scans, comparisons, conversions, totalCommissions, recentEvents } = await getProStats(session.sub);
  const affiliateUrl = `${process.env.AUTH_URL ?? "http://localhost:3000"}/comparer?ref=${session.affiliateCode}`;

  const STATS = [
    { label: "Scans QR",      value: scans,       icon: QrCode,      color: "bg-blue-500",    href: "/pro/dashboard/qrcode" },
    { label: "Comparaisons",  value: comparisons,  icon: Users,       color: "bg-violet-500",  href: "/pro/dashboard/activite" },
    { label: "Conversions",   value: conversions,  icon: TrendingUp,  color: "bg-emerald-500", href: "/pro/dashboard/activite" },
    { label: "Commissions",   value: `${totalCommissions.toFixed(2)} €`, icon: DollarSign, color: "bg-[#C9A84C]", href: "/pro/dashboard/commissions" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Bonjour, {session.raisonSociale} 👋</h1>
        <p className="text-[#6B7280] text-sm mt-1">Voici un résumé de votre activité affiliée.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-5 border border-[#E5D8BC] hover:shadow-md transition-shadow group">
            <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center mb-3 shadow-sm`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{s.value}</p>
            <p className="text-xs text-[#6B7280] mt-0.5 flex items-center gap-1">
              {s.label}
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Affiliate link */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#1A1A1A] flex items-center gap-2">
              <QrCode className="h-4 w-4 text-[#C9A84C]" />
              Votre lien affilié
            </h2>
            <Link href="/pro/dashboard/qrcode">
              <Button size="sm" variant="outline">Voir le QR →</Button>
            </Link>
          </div>
          <div className="bg-[#F5E6C8] rounded-xl p-3">
            <p className="text-xs text-[#9CA3AF] mb-1">Lien personnalisé</p>
            <p className="text-sm font-mono text-[#C9A84C] break-all font-medium">{affiliateUrl}</p>
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-[#F5E6C8] text-[#C9A84C] font-bold px-3 py-1.5 rounded-lg text-base tracking-widest">
              {session.affiliateCode}
            </code>
            <p className="text-xs text-[#9CA3AF]">Code à partager</p>
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#1A1A1A] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#C9A84C]" />
              Activité récente
            </h2>
            <Link href="/pro/dashboard/activite">
              <Button size="sm" variant="ghost">Tout voir →</Button>
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
              <Clock className="h-8 w-8 text-[#E5D8BC] mb-2" />
              <p className="text-sm text-[#9CA3AF]">Aucune activité pour le moment</p>
              <p className="text-xs text-[#C9A84C] mt-1">Partagez votre lien pour commencer</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentEvents.map((ev) => {
                const cfg = EVENT_LABELS[ev.type] ?? { label: ev.type, color: "text-gray-600 bg-gray-50" };
                return (
                  <div key={ev.id} className="flex items-center justify-between py-1.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-xs text-[#9CA3AF]">
                      {formatDistanceToNow(new Date(ev.createdAt), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
