import { prisma } from "@/lib/prisma";
import { Building2, Clock, CheckCircle2, XCircle, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import CompanyActions from "./CompanyActions";

async function getCompanies() {
  try {
    return await prisma.company.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      select: {
        id: true, raisonSociale: true, siret: true, email: true,
        telephone: true, nomResponsable: true, status: true,
        affiliateCode: true, createdAt: true,
        _count: { select: { affiliateEvents: true, commissions: true } },
      },
    });
  } catch {
    return [];
  }
}

const STATUS_CONFIG = {
  PENDING:   { label: "En attente", color: "text-amber-600 bg-amber-50 border-amber-200",   icon: Clock },
  ACTIVE:    { label: "Actif",      color: "text-green-600 bg-green-50 border-green-200",   icon: CheckCircle2 },
  SUSPENDED: { label: "Suspendu",   color: "text-red-600 bg-red-50 border-red-200",         icon: XCircle },
};

export default async function EntreprisesPage() {
  const companies = await getCompanies();
  const pending = companies.filter((c) => c.status === "PENDING");
  const active  = companies.filter((c) => c.status === "ACTIVE");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Entreprises partenaires</h1>
        <p className="text-[#64748B] text-sm mt-1">{companies.length} entreprise{companies.length > 1 ? "s" : ""} au total · {pending.length} en attente · {active.length} actives</p>
      </div>

      {/* Pending — priorité */}
      {pending.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-amber-500" />
            <h2 className="font-semibold text-[#0F172A]">En attente de validation ({pending.length})</h2>
          </div>
          <div className="flex flex-col gap-3">
            {pending.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-amber-200 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold shrink-0">
                      {c.raisonSociale.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">{c.raisonSociale}</p>
                      <p className="text-sm text-[#64748B]">SIRET : {c.siret}</p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#94A3B8]">
                        <span>{c.email}</span>
                        {c.telephone && <span>{c.telephone}</span>}
                        {c.nomResponsable && <span>Resp. : {c.nomResponsable}</span>}
                        <span>Inscrit {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: fr })}</span>
                      </div>
                    </div>
                  </div>
                  <CompanyActions companyId={c.id} status={c.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All companies table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-semibold text-[#0F172A]">Toutes les entreprises</h2>
          <Filter className="h-4 w-4 text-[#CBD5E1]" />
        </div>

        {companies.length === 0 ? (
          <div className="py-16 text-center">
            <Building2 className="h-10 w-10 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-[#94A3B8]">Aucune entreprise inscrite</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  {["Entreprise", "SIRET", "Email", "Code affilié", "Scans", "Statut", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {companies.map((c) => {
                  const cfg = STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={c.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-[#F5E6C8] flex items-center justify-center text-[#C9A84C] font-bold text-xs shrink-0">
                            {c.raisonSociale.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-[#1A1A1A] text-sm">{c.raisonSociale}</p>
                            {c.nomResponsable && <p className="text-xs text-[#94A3B8]">{c.nomResponsable}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#64748B] font-mono">{c.siret}</td>
                      <td className="px-5 py-3 text-sm text-[#64748B]">{c.email}</td>
                      <td className="px-5 py-3">
                        <code className="text-xs bg-[#F5E6C8] text-[#C9A84C] px-2 py-0.5 rounded font-bold">{c.affiliateCode}</code>
                      </td>
                      <td className="px-5 py-3 text-sm text-[#1A1A1A] font-medium">{c._count.affiliateEvents}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <CompanyActions companyId={c.id} status={c.status} compact />
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
