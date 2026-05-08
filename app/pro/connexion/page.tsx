"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { BearImage } from "@/components/ui/BearLogo";

export default function ProConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/pro/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur de connexion");
      } else if (data.status === "PENDING") {
        setError("Votre compte est en attente de validation (24-48h). Revenez bientôt.");
      } else {
        router.push("/pro/dashboard");
        router.refresh();
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-[#FAFAFA]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-2 rounded-2xl bg-[#F5E6C8] flex items-center justify-center">
                <BearImage height={52} />
              </div>
            </div>
            <Badge variant="gold" className="mb-3">Espace Professionnel</Badge>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Connexion Pro</h1>
            <p className="text-sm text-[#6B7280] mt-2">
              Accédez à votre tableau de bord partenaire
            </p>
          </div>

          <div className="bg-white border border-[#E5D8BC] rounded-2xl p-8 shadow-sm">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <Input
                label="Email professionnel"
                type="email"
                placeholder="contact@votre-garage.fr"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <Link href="/mot-de-passe-oublie" className="text-xs text-[#C9A84C] hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion..." : "Accéder au dashboard →"}
              </Button>
            </form>

            <p className="text-center text-sm text-[#6B7280] mt-6">
              Pas encore partenaire ?{" "}
              <Link href="/pro/inscription" className="text-[#C9A84C] hover:underline font-medium">
                Créer un compte pro
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-[#9CA3AF] mt-4">
            Vous êtes un particulier ?{" "}
            <Link href="/connexion" className="text-[#C9A84C] hover:underline">
              Connexion particulier →
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
