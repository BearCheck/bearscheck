import { prisma } from "@/lib/prisma";
import { Users, Shield, UserRound, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, email: true, name: true, role: true,
        createdAt: true, emailVerified: true,
        _count: { select: { comparisons: true } },
      },
    });
  } catch {
    return [];
  }
}

const ROLE_CONFIG = {
  USER:          { label: "Utilisateur",  color: "text-blue-600 bg-blue-50 border-blue-200" },
  COMPANY_ADMIN: { label: "Pro",          color: "text-[#C9A84C] bg-[#F5E6C8] border-[#E5D8BC]" },
  ADMIN:         { label: "Admin",        color: "text-violet-600 bg-violet-50 border-violet-200" },
};

export default async function UtilisateursPage() {
  const users = await getUsers();
  const admins = users.filter((u) => u.role === "ADMIN").length;
  const verified = users.filter((u) => u.emailVerified).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Utilisateurs</h1>
        <p className="text-[#64748B] text-sm mt-1">
          {users.length} utilisateur{users.length > 1 ? "s" : ""} · {verified} vérifié{verified > 1 ? "s" : ""} · {admins} admin{admins > 1 ? "s" : ""}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total", value: users.length, icon: Users, color: "bg-blue-500" },
          { label: "Vérifiés", value: verified, icon: Shield, color: "bg-emerald-500" },
          { label: "Admins", value: admins, icon: UserRound, color: "bg-violet-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#E2E8F0] flex items-center gap-4">
            <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F172A]">{s.value}</p>
              <p className="text-xs text-[#64748B]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-semibold text-[#0F172A]">Liste des utilisateurs</h2>
          <Search className="h-4 w-4 text-[#CBD5E1]" />
        </div>

        {users.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-10 w-10 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-[#94A3B8]">Aucun utilisateur inscrit</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  {["Utilisateur", "Email", "Rôle", "Comparaisons", "Inscrit", "Vérifié"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {users.map((u) => {
                  const roleCfg = ROLE_CONFIG[u.role as keyof typeof ROLE_CONFIG] ?? ROLE_CONFIG.USER;
                  const initials = u.name
                    ? u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : u.email[0].toUpperCase();
                  return (
                    <tr key={u.id} className="hover:bg-[#FAFAFA]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {initials}
                          </div>
                          <span className="font-medium text-[#1A1A1A] text-sm">{u.name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-[#64748B]">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full border ${roleCfg.color}`}>
                          {roleCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-[#1A1A1A]">{u._count.comparisons}</td>
                      <td className="px-5 py-3 text-xs text-[#94A3B8]">
                        {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true, locale: fr })}
                      </td>
                      <td className="px-5 py-3">
                        {u.emailVerified ? (
                          <span className="inline-flex text-xs font-medium text-green-600">✓ Oui</span>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">Non</span>
                        )}
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
