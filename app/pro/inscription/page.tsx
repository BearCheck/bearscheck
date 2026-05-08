"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Coins, LayoutDashboard, Palette } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BearImage } from "@/components/ui/BearLogo";

interface Benefit { icon: ReactNode; title: string; desc: string }

const BENEFITS: Benefit[] = [
  { icon: <QrCode className="h-5 w-5 text-[#C9A84C]" />, title: "QR code personnalisé", desc: "Généré automatiquement après validation de votre compte." },
  { icon: <Coins className="h-5 w-5 text-[#C9A84C]" />, title: "Commissions sur conversions", desc: "Gagnez des commissions sur chaque souscription issue de votre QR code." },
  { icon: <LayoutDashboard className="h-5 w-5 text-[#C9A84C]" />, title: "Dashboard de suivi", desc: "Suivez vos scans, conversions et commissions en temps réel." },
  { icon: <Palette className="h-5 w-5 text-[#C9A84C]" />, title: "Matériel marketing", desc: "Templates prêts à l'emploi (affiche A4, autocollant, lien affilié)." },
];

export default function ProInscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    raisonSociale: "",
    siret: "",
    prenomResponsable: "",
    nomResponsable: "",
    email: "",
    telephone: "",
    adresse: "",
    password: "",
    cgu: false,
  });

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.cgu) {
      setError("Vous devez accepter les conditions générales.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pro/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'inscription");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/pro/connexion"), 3000);
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24 px-4 bg-[#FAFAFA]">
          <div className="text-center max-w-md">
            <BearImage height={96} className="mx-auto mb-6 drop-shadow-md" />
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3">Demande envoyée !</h1>
            <p className="text-[#6B7280]">
              Notre équipe va examiner votre dossier sous <strong>24-48h</strong>.
              Vous recevrez un email de confirmation dès validation.
            </p>
            <p className="text-xs text-[#9CA3AF] mt-4">Redirection vers la connexion...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 px-4 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="gold" className="mb-4">Espace Professionnel</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-3">
              Devenez partenaire BearsCheck
            </h1>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              Garagistes, concessionnaires, carrossiers — générez des revenus complémentaires en orientant vos clients vers BearsCheck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Les avantages</h2>
              <div className="flex flex-col gap-4">
                {BENEFITS.map((b) => (
                  <Card key={b.title} className="flex gap-4 items-start">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-[#F5E6C8]">{b.icon}</div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A] text-sm">{b.title}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{b.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl text-white text-center" style={{ backgroundColor: "#0F172A" }}>
                <BearImage height={48} className="mx-auto mb-2" />
                <p className="font-bold">Inscription gratuite</p>
                <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>Validation sous 24-48h par notre équipe</p>
              </div>
            </div>

            <div className="bg-white border border-[#E5D8BC] rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-5">Créer votre compte pro</h2>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input
                  label="Raison sociale *"
                  placeholder="Nom de votre entreprise"
                  value={form.raisonSociale}
                  onChange={(e) => update("raisonSociale", e.target.value)}
                  required
                />
                <Input
                  label="SIRET *"
                  placeholder="12345678901234"
                  maxLength={14}
                  value={form.siret}
                  onChange={(e) => update("siret", e.target.value.replace(/\D/g, ""))}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Prénom du responsable"
                    placeholder="Prénom"
                    value={form.prenomResponsable}
                    onChange={(e) => update("prenomResponsable", e.target.value)}
                  />
                  <Input
                    label="Nom du responsable"
                    placeholder="Nom"
                    value={form.nomResponsable}
                    onChange={(e) => update("nomResponsable", e.target.value)}
                  />
                </div>
                <Input
                  label="Email professionnel *"
                  type="email"
                  placeholder="contact@votre-garage.fr"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                />
                <Input
                  label="Téléphone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={form.telephone}
                  onChange={(e) => update("telephone", e.target.value)}
                />
                <Input
                  label="Adresse"
                  placeholder="Adresse de l'établissement"
                  value={form.adresse}
                  onChange={(e) => update("adresse", e.target.value)}
                />
                <Input
                  label="Mot de passe *"
                  type="password"
                  placeholder="Choisissez un mot de passe sécurisé"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                />

                <div className="flex items-start gap-3 mt-1">
                  <input
                    type="checkbox"
                    id="cgu-pro"
                    className="mt-1 h-4 w-4 accent-[#C9A84C] shrink-0"
                    checked={form.cgu}
                    onChange={(e) => update("cgu", e.target.checked)}
                  />
                  <label htmlFor="cgu-pro" className="text-xs text-[#6B7280] cursor-pointer">
                    J&apos;accepte les{" "}
                    <a href="/cgv" className="text-[#C9A84C] hover:underline">conditions générales</a>{" "}
                    et la{" "}
                    <a href="/politique-confidentialite" className="text-[#C9A84C] hover:underline">politique de confidentialité</a>. *
                  </label>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? "Envoi en cours..." : "Envoyer ma demande →"}
                </Button>

                <p className="text-xs text-[#9CA3AF] text-center">
                  Votre compte sera activé après validation manuelle par notre équipe (24-48h).
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
