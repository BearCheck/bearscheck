import { prisma } from "@/lib/prisma";
import { DollarSign, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

async function getCommissions() {
  try {
    const [commissions, totalPaid, totalPending] = await Promise.all([
      prisma.commission.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
        include: { company: { select: { raisonSociale: true } } },
      }),
      prisma.commission.aggregate({ where: { status: "PAID" },    _sum: { amount: true } }),
      prisma.commission.aggregate({ where: { status: "PENDING" }, _sum: { amount: true } }),
    ]);
    return {
      commissions,
      totalPaid:    totalPaid._sum.amount    ?? 0,
      totalPending: totalPending._sum.amount ?? 0,
    };
  } catch {
    return { commissions: [], totalPaid: 0, totalPending: 0 };
  }
}

const STATUS_CONFIG = {
  PENDING:     { label: "En attente",  color: "text-amber-600 bg-amber-50 border-amber-200",   icon: Clock },
  IN_PROGRESS: { label: "En cours",   color: "text-blue-600 bg-blue-50 border-blue-200",       icon: TrendingUp },
  PAID:        { label: "Payé",        color: "text-green-600 bg-green-50 border-green-200",   icon: CheckCircle2 },
};

export default async function CommissionsPage() {
  const { commissions, totalPaid, totalPending } = await getCommissions();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Commissions</h1>
        <p className="text-[#64748B] text-sm mt-1">Suivi des paiements aux partenaires</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total payé",    value: `${totalPaid.toFixed(2)} €`,    icon: CheckCircle2, color: "bg-emerald-500" },
          { label: "En attente",    value: `${totalPending.toFixed(2)} €`, icon: Clock,        color: "bg-amber-500" },
          { label: "Nb commissions", value: commissions.length,            icon: DollarSign,   color: "bg-[#C9A84C]" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#E2E8F0] flex items-center gap-4">
            <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F172A]">{s.value}</p>
              <p className="text-xs text-[#64748B]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-semibold text-[#0F172A]">Historique</h2>
        </div>

        {commissions.length === 0 ? (
          <div className="py-16 text-center">
            <DollarSign className="h-10 w-10 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-[#94A3B8]">Aucune commission pour le moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  {["Entreprise", "Montant", "Description", "Statut", "Date"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {commissions.map((c) => {
                  const cfg = STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={c.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-[#F5E6C8] flex items-center justify-center text-[#C9A84C] font-bold text-xs shrink-0">
                            {c.company.raisonSociale.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-[#1A1A1A]">{c.company.raisonSociale}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-bold text-[#1A1A1A]">{c.amount.toFixed(2)} €</td>
                      <td className="px-5 py-3 text-sm text-[#64748B]">{c.description ?? "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#94A3B8]">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: fr })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
