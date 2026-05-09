import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
import Link from "next/link";
import { LayoutDashboard, Users, Building2, BarChart3, DollarSign, LogOut, ChevronRight, CreditCard, TrendingUp, CalendarDays, Map, Calculator } from "lucide-react";
import { BearImage } from "@/components/ui/BearLogo";
import { signOut } from "@/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/finances", label: "Finances", icon: CreditCard },
  { href: "/admin/finances/depenses", label: "↳ Dépenses", icon: DollarSign, sub: true },
  { href: "/admin/finances/revenus", label: "↳ Revenus", icon: TrendingUp, sub: true },
  { href: "/admin/impots", label: "Impôts", icon: Calculator },
  { href: "/admin/calendrier", label: "Calendrier", icon: CalendarDays },
  { href: "/admin/roadmap", label: "Roadmap", icon: Map },
  { href: "/admin/entreprises", label: "Entreprises", icon: Building2 },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/comparaisons", label: "Comparaisons", icon: BarChart3 },
  { href: "/admin/commissions", label: "Commissions", icon: DollarSign },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col border-r border-white/10">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
          <BearImage height={32} className="drop-shadow-sm" />
          <div>
            <p className="text-white font-bold text-sm leading-none">BearsCheck</p>
            <p className="text-[#C9A84C] text-[10px] font-medium mt-0.5 uppercase tracking-wider">Admin</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map((item) => (
            <AdminNavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="h-8 w-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {session.user.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{session.user.name ?? "Admin"}</p>
              <p className="text-[#64748B] text-[10px] truncate">{session.user.email}</p>
            </div>
          </div>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#64748B] hover:text-white hover:bg-white/5 transition-colors text-sm"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 bg-[#F8FAFC] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminNavLink({ href, label, icon: Icon, exact, sub }: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean; sub?: boolean }) {
  void exact;
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/8 transition-all font-medium ${sub ? "text-xs pl-5 opacity-80" : "text-sm"}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
    </Link>
  );
}
