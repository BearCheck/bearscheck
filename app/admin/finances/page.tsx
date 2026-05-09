import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/ui/StatCard";
import { AlertBadge } from "@/components/admin/ui/AlertBadge";

async function getFinanceSummary() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [expenses, revenues, prevExpenses] = await Promise.all([
    prisma.expense.findMany({ where: { dateDepense: { gte: startOfMonth } } }),
    prisma.revenue.findMany({ where: { dateRevenu: { gte: startOfMonth } } }),
    prisma.expense.findMany({ where: { dateDepense: { gte: startOfPrevMonth, lte: endOfPrevMonth } } }),
  ]);

  const totalDepenses = expenses.reduce((s, e) => s + e.montant, 0);
  const totalRevenus = revenues.reduce((s, r) => s + r.montant, 0);
  const prevDepenses = prevExpenses.reduce((s, e) => s + e.montant, 0);
  const benefice = totalRevenus - totalDepenses;
  const cotisations = totalRevenus * 0.214;
  const tresorerie = benefice - cotisations;
  const evolution = prevDepenses > 0 ? ((totalDepenses - prevDepenses) / prevDepenses) * 100 : 0;

  return { totalDepenses, totalRevenus, benefice, cotisations, tresorerie, evolution };
}

export default async function FinancesPage() {
  const { totalDepenses, totalRevenus, benefice, cotisations, tresorerie, evolution } = await getFinanceSummary();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Finances</h1>
        <p className="text-[#64748B] text-sm">Tableau de bord financier BearsCheck</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard titre="Revenus ce mois" valeur={totalRevenus.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="💰" couleur="#10B981" />
        <StatCard titre="Dépenses ce mois" valeur={totalDepenses.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="💳" evolution={evolution} />
        <StatCard titre="Bénéfice net" valeur={benefice.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="📈" couleur={benefice >= 0 ? "#10B981" : "#EF4444"} />
        <StatCard titre="Cotisations à provisionner" valeur={cotisations.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="🏛️" couleur="#C9A84C" />
        <StatCard titre="Trésorerie nette" valeur={tresorerie.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unite="€" icone="💼" couleur={tresorerie >= 0 ? "#10B981" : "#EF4444"} />
      </div>

      {cotisations > 0 && (
        <AlertBadge type="attention" message={`Provisionnez ${cotisations.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} € de cotisations URSSAF ce mois`} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/finances/depenses"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-md transition-shadow group">
          <div className="text-2xl mb-3">💳</div>
          <h2 className="font-bold text-[#0F172A] mb-1 group-hover:text-[#C9A84C] transition-colors">Gestion des dépenses</h2>
          <p className="text-sm text-[#64748B]">Suivre, catégoriser et analyser toutes vos dépenses</p>
          <span className="mt-4 inline-block text-xs text-[#C9A84C] font-semibold">Accéder →</span>
        </Link>
        <Link href="/admin/finances/revenus"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-md transition-shadow group">
          <div className="text-2xl mb-3">💰</div>
          <h2 className="font-bold text-[#0F172A] mb-1 group-hover:text-[#C9A84C] transition-colors">Gestion des revenus</h2>
          <p className="text-sm text-[#64748B]">Enregistrer et suivre toutes vos sources de revenus</p>
          <span className="mt-4 inline-block text-xs text-[#C9A84C] font-semibold">Accéder →</span>
        </Link>
      </div>
    </div>
  );
}
