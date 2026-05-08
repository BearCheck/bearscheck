import { getProSession } from "@/lib/pro-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DollarSign, Clock, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/Card";

async function getCommissions(companyId: string) {
  try {
    const [commissions, paid, pending] = await Promise.all([
      prisma.commission.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        select: { id: true, amount: true, status: true, description: true, createdAt: true, paidAt: true },
      }),
      prisma.commission.aggregate({ where: { companyId, status: "PAID" },    _sum: { amount: true } }),
      prisma.commission.aggregate({ where: { companyId, status: "PENDING" }, _sum: { amount: true } }),
    ]);
    return {
      commissions,
      totalPaid:    paid._sum.amount    ?? 0,
      totalPending: pending._sum.amount ?? 0,
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

export default async function CommissionsProPage() {
  const session = await getProSession();
  if (!session) redirect("/pro/connexion");

  const { commissions, totalPaid, totalPending } = await getCommissions(session.sub);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Commissions</h1>
        <p className="text-[#6B7280] text-sm mt-1">Suivi de vos gains et paiements.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total payé",    value: `${totalPaid.toFixed(2)} €`,    icon: CheckCircle2, color: "bg-emerald-500" },
          { label: "En attente",    value: `${totalPending.toFixed(2)} €`, icon: Clock,        color: "bg-amber-500" },
          { label: "Nb commissions", value: commissions.length,            icon: DollarSign,   color: "bg-[#C9A84C]" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#E5D8BC] flex items-center gap-4">
            <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{s.value}</p>
              <p className="text-xs text-[#6B7280]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <Card className="mb-6 flex items-start gap-3 bg-[#F5E6C8] border-[#E5D8BC]">
        <Info className="h-4 w-4 text-[#C9A84C] shrink-0 mt-0.5" />
        <p className="text-sm text-[#6B7280]">
          Les commissions sont calculées sur chaque souscription validée via votre lien affilié.
          Les paiements sont effectués mensuellement par virement bancaire sur le RIB renseigné dans vos paramètres.
        </p>
      </Card>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5D8BC] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5D8BC]">
          <h2 className="font-semibold text-[#1A1A1A]">Historique des commissions</h2>
        </div>

        {commissions.length === 0 ? (
          <div className="py-16 text-center">
            <DollarSign className="h-10 w-10 text-[#E5D8BC] mx-auto mb-3" />
            <p className="text-[#9CA3AF]">Aucune commission pour le moment</p>
            <p className="text-xs text-[#C9A84C] mt-1">Vos premières commissions apparaîtront ici dès les premières souscriptions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA]">
                  {["Montant", "Description", "Statut", "Date", "Payé le"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F0E8]">
                {commissions.map((c) => {
                  const cfg = STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={c.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-5 py-3 font-bold text-[#1A1A1A]">{c.amount.toFixed(2)} €</td>
                      <td className="px-5 py-3 text-sm text-[#6B7280]">{c.description ?? "Commission affilié"}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#9CA3AF]">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: fr })}
                      </td>
                      <td className="px-5 py-3 text-xs text-[#9CA3AF]">
                        {c.paidAt ? formatDistanceToNow(new Date(c.paidAt), { addSuffix: true, locale: fr }) : "—"}
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
