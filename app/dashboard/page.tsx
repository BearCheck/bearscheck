import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart3, Clock, Car, LogOut } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BearImage } from "@/components/ui/BearLogo";
import ChangePasswordCard from "./ChangePasswordCard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const initials = session.user.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session.user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFAFA] py-10 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#C9A84C] flex items-center justify-center text-white text-xl font-bold">
                {initials}
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-0.5">Bienvenue</p>
                <h1 className="text-xl font-bold text-[#1A1A1A]">
                  {session.user.name ?? session.user.email}
                </h1>
              </div>
            </div>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
              <button type="submit" className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </form>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <BarChart3 className="h-5 w-5 text-[#C9A84C]" />, label: "Comparaisons", value: "0" },
              { icon: <Car className="h-5 w-5 text-[#C9A84C]" />, label: "Devis sauvegardés", value: "0" },
              { icon: <Clock className="h-5 w-5 text-[#C9A84C]" />, label: "Dernière activité", value: "—" },
            ].map((s) => (
              <Card key={s.label} className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#F5E6C8] flex items-center justify-center">
                  {s.icon}
                </div>
                <div>
                  <p className="text-xl font-bold text-[#1A1A1A]">{s.value}</p>
                  <p className="text-xs text-[#6B7280]">{s.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty state */}
          <Card className="text-center py-12 mb-6">
            <BearImage height={80} className="mx-auto mb-4 opacity-60" />
            <Badge variant="neutral" className="mb-3">Aucune comparaison</Badge>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">Commencez à comparer</h2>
            <p className="text-sm text-[#6B7280] mb-6 max-w-sm mx-auto">
              Vos futures comparaisons et devis sauvegardés apparaîtront ici.
            </p>
            <Link href="/comparer">
              <Button size="md" className="shadow-sm">Lancer une comparaison →</Button>
            </Link>
          </Card>

          {/* Paramètres du compte */}
          <ChangePasswordCard />
        </div>
      </main>
      <Footer />
    </>
  );
}
