import { getProSession } from "@/lib/pro-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, QrCode, Activity, DollarSign, Settings, LogOut, ChevronRight, ExternalLink } from "lucide-react";
import { BearImage } from "@/components/ui/BearLogo";
import Badge from "@/components/ui/Badge";

const NAV = [
  { href: "/pro/dashboard",              label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/pro/dashboard/qrcode",       label: "Mon QR Code",    icon: QrCode },
  { href: "/pro/dashboard/activite",     label: "Activité",       icon: Activity },
  { href: "/pro/dashboard/commissions",  label: "Commissions",    icon: DollarSign },
  { href: "/pro/dashboard/parametres",   label: "Paramètres",     icon: Settings },
];

export default async function ProDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getProSession();
  if (!session) redirect("/pro/connexion");

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-[#E5D8BC]">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[#E5D8BC]">
          <BearImage height={30} className="drop-shadow-sm" />
          <div>
            <p className="text-[#1A1A1A] font-bold text-sm leading-none">BearsCheck</p>
            <p className="text-[#C9A84C] text-[10px] font-semibold mt-0.5 uppercase tracking-wider">Espace Pro</p>
          </div>
        </div>

        {/* Company info */}
        <div className="px-4 py-4 border-b border-[#F0E8D6]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#C9A84C] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {session.raisonSociale.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1A1A1A] truncate">{session.raisonSociale}</p>
              <Badge variant={session.status === "ACTIVE" ? "success" : "neutral"} className="mt-0.5 text-[10px]">
                {session.status === "ACTIVE" ? "Actif" : "En attente"}
              </Badge>
            </div>
          </div>
          <div className="mt-2 px-1">
            <p className="text-[10px] text-[#9CA3AF]">Code affilié</p>
            <code className="text-xs font-bold text-[#C9A84C] tracking-wider">{session.affiliateCode}</code>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F5E6C8] transition-all text-sm font-medium"
            >
              <item.icon className="h-4 w-4 shrink-0 text-[#C9A84C]" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-[#F0E8D6] flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#9CA3AF] hover:text-[#1A1A1A] text-xs transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Voir le site
          </Link>
          <form action="/api/pro/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-colors text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
