import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Car, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

async function getComparisons() {
  try {
    const [total, converted, recent] = await Promise.all([
      prisma.comparison.count(),
      prisma.comparison.count({ where: { converted: true } }),
      prisma.comparison.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true, affiliateCode: true, completed: true,
          converted: true, createdAt: true,
          user: { select: { email: true } },
        },
      }),
    ]);
    return { total, converted, recent };
  } catch {
    return { total: 0, converted: 0, recent: [] };
  }
}

export default async function ComparaisonsPage() {
  const { total, converted, recent } = await getComparisons();
  const rate = total > 0 ? ((converted / total) * 100).toFixed(1) : "0.0";
  const anonymous = recent.filter((c) => !c.user).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Comparaisons</h1>
        <p className="text-[#64748B] text-sm mt-1">Analyse de l'activité du tunnel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total comparaisons", value: total, icon: BarChart3, color: "bg-violet-500" },
          { label: "Conversions", value: converted, icon: CheckCircle2, color: "bg-emerald-500" },
          { label: "Taux de conversion", value: `${rate}%`, icon: TrendingUp, color: "bg-[#C9A84C]" },
          { label: "Utilisateurs anonymes", value: anonymous, icon: Car, color: "bg-slate-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
            <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{s.value}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-semibold text-[#0F172A]">Activité récente</h2>
        </div>

        {recent.length === 0 ? (
          <div className="py-16 text-center">
            <BarChart3 className="h-10 w-10 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-[#94A3B8]">Aucune comparaison pour le moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  {["ID", "Utilisateur", "Code affilié", "Terminé", "Converti", "Date"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {recent.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAFAFA]">
                    <td className="px-5 py-3 font-mono text-xs text-[#94A3B8]">{c.id.slice(0, 8)}…</td>
                    <td className="px-5 py-3 text-sm text-[#64748B]">{c.user?.email ?? <span className="text-[#CBD5E1]">Anonyme</span>}</td>
                    <td className="px-5 py-3">
                      {c.affiliateCode
                        ? <code className="text-xs bg-[#F5E6C8] text-[#C9A84C] px-2 py-0.5 rounded font-bold">{c.affiliateCode}</code>
                        : <span className="text-xs text-[#CBD5E1]">—</span>
                      }
                    </td>
                    <td className="px-5 py-3">
                      {c.completed
                        ? <span className="text-xs text-green-600 font-medium">✓ Oui</span>
                        : <span className="text-xs text-[#94A3B8]">Non</span>}
                    </td>
                    <td className="px-5 py-3">
                      {c.converted
                        ? <span className="text-xs font-bold text-emerald-600">✓ Converti</span>
                        : <span className="text-xs text-[#94A3B8]">—</span>}
                    </td>
                    <td className="px-5 py-3 text-xs text-[#94A3B8]">
                      {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: fr })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
