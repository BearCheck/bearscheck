"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BearLogo from "@/components/ui/BearLogo";

export default function InscriptionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Erreur lors de la création du compte");
      setLoading(false);
      return;
    }

    // Connexion automatique après inscription
    const login = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (login?.error) {
      router.push("/connexion");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-[#FAFAFA]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <BearLogo size="md" showTagline className="justify-center mb-4" />
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Créer votre compte</h1>
            <p className="text-sm text-[#6B7280] mt-2">Sauvegardez et retrouvez vos devis</p>
          </div>

          <div className="bg-white border border-[#E5D8BC] rounded-2xl p-8 shadow-sm">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <Input
                label="Prénom"
                type="text"
                placeholder="Votre prénom"
                autoComplete="given-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Adresse email"
                type="email"
                placeholder="votre@email.fr"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Mot de passe"
                type="password"
                placeholder="8 caractères minimum"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Création..." : "Créer mon compte →"}
              </Button>
            </form>

            <p className="text-center text-sm text-[#6B7280] mt-5">
              Déjà un compte ?{" "}
              <Link href="/connexion" className="text-[#C9A84C] hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
