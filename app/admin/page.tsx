import { prisma } from "@/lib/prisma";
import { Users, Building2, BarChart3, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

async function getStats() {
  try {
    const [userCount, companyCount, pendingCount, comparisonCount, conversionCount, recentCompanies] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.company.count({ where: { status: "PENDING" } }),
      prisma.comparison.count(),
      prisma.comparison.count({ where: { converted: true } }),
      prisma.company.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, raisonSociale: true, email: true, status: true, createdAt: true },
      }),
    ]);
    return { userCount, companyCount, pendingCount, comparisonCount, conversionCount, recentCompanies };
  } catch {
    return { userCount: 0, companyCount: 0, pendingCount: 0, comparisonCount: 0, conversionCount: 0, recentCompanies: [] };
  }
}

const STATUS_CONFIG = {
  PENDING:   { label: "En attente", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
  ACTIVE:    { label: "Actif",      color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
  SUSPENDED: { label: "Suspendu",   color: "text-red-600 bg-red-50 border-red-200",     icon: XCircle },
};

export default async function AdminDashboardPage() {
  const { userCount, companyCount, pendingCount, comparisonCount, conversionCount, recentCompanies } = await getStats();
  const conversionRate = comparisonCount > 0 ? ((conversionCount / comparisonCount) * 100).toFixed(1) : "0.0";

  const STATS = [
    { label: "Utilisateurs", value: userCount, icon: Users, color: "bg-blue-500", href: "/admin/utilisateurs" },
    { label: "Entreprises", value: companyCount, icon: Building2, color: "bg-[#C9A84C]", sub: pendingCount > 0 ? `${pendingCount} en attente` : undefined, href: "/admin/entreprises" },
    { label: "Comparaisons", value: comparisonCount, icon: BarChart3, color: "bg-violet-500", href: "/admin/comparaisons" },
    { label: "Taux de conversion", value: `${conversionRate}%`, icon: TrendingUp, color: "bg-emerald-500", sub: `${conversionCount} conversions`, href: "/admin/comparaisons" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Vue d'ensemble</h1>
        <p className="text-[#64748B] text-sm mt-1">Tableau de bord administrateur BearsCheck</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center shadow-sm`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <TrendingUp className="h-4 w-4 text-[#CBD5E1] group-hover:text-[#C9A84C] transition-colors" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{s.value}</p>
            <p className="text-sm text-[#64748B] mt-0.5">{s.label}</p>
            {s.sub && (
              <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {s.sub}
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Recent companies */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-semibold text-[#0F172A]">Dernières entreprises</h2>
          <Link href="/admin/entreprises" className="text-xs text-[#C9A84C] hover:underline font-medium">
            Voir tout →
          </Link>
        </div>

        {recentCompanies.length === 0 ? (
          <div className="py-12 text-center">
            <Building2 className="h-8 w-8 text-[#CBD5E1] mx-auto mb-2" />
            <p className="text-sm text-[#94A3B8]">Aucune entreprise pour le moment</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide px-6 py-3">Entreprise</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide px-6 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide px-6 py-3">Statut</th>
                <th className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide px-6 py-3">Inscrit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {recentCompanies.map((c) => {
                const cfg = STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
                const StatusIcon = cfg.icon;
                return (
                  <tr key={c.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#F5E6C8] flex items-center justify-center text-[#C9A84C] font-bold text-xs shrink-0">
                          {c.raisonSociale.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#1A1A1A] text-sm">{c.raisonSociale}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-[#64748B]">{c.email}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-[#94A3B8]">
                      {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: fr })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
