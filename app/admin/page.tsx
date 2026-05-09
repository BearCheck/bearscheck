import { prisma } from "@/lib/prisma";
import { Users, Building2, BarChart3, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertBadge } from "@/components/admin/ui/AlertBadge";
import { StatCard } from "@/components/admin/ui/StatCard";
import { ProgressBar } from "@/components/admin/ui/ProgressBar";

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const [
      userCount, companyCount, pendingCount, comparisonCount, conversionCount,
      recentCompanies, expenses, revenues, tasks, taxDeclarations, upcomingEvents,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.company.count({ where: { status: "PENDING" } }),
      prisma.comparison.count(),
      prisma.comparison.count({ where: { converted: true } }),
      prisma.company.findMany({
        orderBy: { createdAt: "desc" }, take: 5,
        select: { id: true, raisonSociale: true, email: true, status: true, createdAt: true },
      }),
      prisma.expense.findMany({ where: { dateDepense: { gte: startOfMonth } } }),
      prisma.revenue.findMany({ where: { dateRevenu: { gte: startOfMonth } } }),
      prisma.roadmapTask.findMany({ where: { parentId: null }, take: 5, orderBy: { createdAt: "desc" } }),
      prisma.taxDeclaration.findMany({ where: { annee: 2026 } }),
      prisma.calendarEvent.findMany({
        where: { dateDebut: { gte: now } },
        orderBy: { dateDebut: "asc" }, take: 5,
      }),
    ]);

    const totalDepenses = expenses.reduce((s, e) => s + e.montant, 0);
    const totalRevenus = revenues.reduce((s, r) => s + r.montant, 0);
    const benefice = totalRevenus - totalDepenses;
    const cotisations = totalRevenus * 0.214;
    const totalCA2026 = taxDeclarations.reduce((s, d) => s + d.chiffreAffaires, 0);
    const pourcentagePlafond = Math.min((totalCA2026 / 77700) * 100, 100);
    const enRetard = taxDeclarations.filter((d) => d.statut === "EN_RETARD");
    const prochaine = taxDeclarations
      .filter((d) => d.statut === "A_PAYER")
      .sort((a, b) => new Date(a.dateLimite).getTime() - new Date(b.dateLimite).getTime())[0];
    const joursProchaine = prochaine
      ? Math.ceil((new Date(prochaine.dateLimite).getTime() - now.getTime()) / 86400000)
      : null;

    return {
      userCount, companyCount, pendingCount, comparisonCount, conversionCount,
      recentCompanies, totalDepenses, totalRevenus, benefice, cotisations,
      pourcentagePlafond, enRetard, prochaine, joursProchaine,
      tasks, upcomingEvents,
    };
  } catch {
    return {
      userCount: 0, companyCount: 0, pendingCount: 0, comparisonCount: 0, conversionCount: 0,
      recentCompanies: [], totalDepenses: 0, totalRevenus: 0, benefice: 0, cotisations: 0,
      pourcentagePlafond: 0, enRetard: [], prochaine: null, joursProchaine: null,
      tasks: [], upcomingEvents: [],
    };
  }
}

const STATUS_CONFIG = {
  PENDING:   { label: "En attente", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
  ACTIVE:    { label: "Actif",      color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
  SUSPENDED: { label: "Suspendu",   color: "text-red-600 bg-red-50 border-red-200",     icon: XCircle },
};

const PRIORITY_EMOJI: Record<string, string> = {
  CRITIQUE: "🔴", HAUTE: "🟠", MOYENNE: "🟡", BASSE: "🟢",
};

export default async function AdminDashboardPage() {
  const {
    userCount, companyCount, pendingCount, comparisonCount, conversionCount,
    recentCompanies, totalDepenses, totalRevenus, benefice, cotisations,
    pourcentagePlafond, enRetard, prochaine, joursProchaine,
    tasks, upcomingEvents,
  } = await getStats();

  const conversionRate = comparisonCount > 0 ? ((conversionCount / comparisonCount) * 100).toFixed(1) : "0.0";

  const STATS = [
    { label: "Utilisateurs", value: userCount, icon: Users, color: "bg-blue-500", href: "/admin/utilisateurs" },
    { label: "Entreprises", value: companyCount, icon: Building2, color: "bg-[#C9A84C]", sub: pendingCount > 0 ? `${pendingCount} en attente` : undefined, href: "/admin/entreprises" },
    { label: "Comparaisons", value: comparisonCount, icon: BarChart3, color: "bg-violet-500", href: "/admin/comparaisons" },
    { label: "Taux de conversion", value: `${conversionRate}%`, icon: TrendingUp, color: "bg-emerald-500", sub: `${conversionCount} conversions`, href: "/admin/comparaisons" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Vue d&apos;ensemble</h1>
        <p className="text-[#64748B] text-sm mt-1">Tableau de bord administrateur BearsCheck</p>
      </div>

      {enRetard.length > 0 && (
        <AlertBadge type="erreur" message={`${enRetard.length} déclaration(s) fiscale(s) en retard !`} action="Voir" />
      )}
      {joursProchaine !== null && joursProchaine <= 30 && joursProchaine > 0 && (
        <AlertBadge type="attention" message={`Déclaration T${prochaine?.trimestre} dans ${joursProchaine} jours`} />
      )}
      {pourcentagePlafond >= 80 && (
        <AlertBadge type="attention" message={`Plafond micro-entreprise atteint à ${pourcentagePlafond.toFixed(0)}%`} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0F172A]">💼 Santé financière (ce mois)</h2>
            <Link href="/admin/finances" className="text-xs text-[#C9A84C] hover:underline">Détails →</Link>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <StatCard titre="Revenus" valeur={totalRevenus.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="💰" couleur="#10B981" />
              <StatCard titre="Dépenses" valeur={totalDepenses.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="💳" couleur="#EF4444" />
            </div>
            <div className="bg-[#F8FAFC] rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Bénéfice net</span>
                <span className={`font-bold ${benefice >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {benefice >= 0 ? "+" : ""}{benefice.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">À provisionner (URSSAF)</span>
                <span className="font-bold text-amber-600">- {cotisations.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €</span>
              </div>
              <div className="h-px bg-[#E2E8F0]" />
              <div className="flex justify-between">
                <span className="font-semibold text-[#0F172A]">Trésorerie nette</span>
                <span className={`font-bold text-lg ${(benefice - cotisations) >= 0 ? "text-[#C9A84C]" : "text-red-600"}`}>
                  {(benefice - cotisations).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0F172A]">📅 Prochains événements</h2>
            <Link href="/admin/calendrier" className="text-xs text-[#C9A84C] hover:underline">Voir tout →</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-[#94A3B8]">Aucun événement à venir</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F8FAFC]">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{ backgroundColor: ev.couleur + "20", border: `1px solid ${ev.couleur}40` }}>
                    {ev.categorie === "FISCAL" ? "💰" : ev.categorie === "DEADLINE" ? "⏰" : "📌"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{ev.titre}</p>
                    <p className="text-xs text-[#94A3B8]">
                      {new Date(ev.dateDebut).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0F172A]">🗺️ Tâches en cours</h2>
            <Link href="/admin/roadmap" className="text-xs text-[#C9A84C] hover:underline">Roadmap →</Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-sm text-[#94A3B8]">Aucune tâche</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8FAFC]">
                  <span className="text-sm shrink-0">{PRIORITY_EMOJI[t.priorite] ?? "🟡"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A] truncate">{t.titre}</p>
                    <ProgressBar valeur={t.progression} size="sm" showLabel />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="font-semibold text-[#0F172A]">Dernières entreprises</h2>
            <Link href="/admin/entreprises" className="text-xs text-[#C9A84C] hover:underline font-medium">Voir tout →</Link>
          </div>
          {recentCompanies.length === 0 ? (
            <div className="py-8 text-center">
              <Building2 className="h-8 w-8 text-[#CBD5E1] mx-auto mb-2" />
              <p className="text-sm text-[#94A3B8]">Aucune entreprise</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {recentCompanies.map((c) => {
                const cfg = STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
                const StatusIcon = cfg.icon;
                return (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAFAFA] transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-[#F5E6C8] flex items-center justify-center text-[#C9A84C] font-bold text-xs shrink-0">
                      {c.raisonSociale.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1A1A1A] text-sm truncate">{c.raisonSociale}</p>
                      <p className="text-xs text-[#94A3B8]">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
