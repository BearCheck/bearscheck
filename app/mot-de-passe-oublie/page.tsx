"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BearLogo from "@/components/ui/BearLogo";
import { CheckCircle2 } from "lucide-react";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Veuillez entrer votre adresse email"); return; }
    setLoading(true);
    setError("");
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError("Une erreur est survenue, réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-[#FAFAFA]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <BearLogo size="md" showTagline className="justify-center mb-4" />
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Mot de passe oublié ?</h1>
            <p className="text-sm text-[#6B7280] mt-2">
              Entrez votre adresse email et nous vous enverrons un lien de réinitialisation.
            </p>
          </div>

          <div className="bg-white border border-[#E5D8BC] rounded-2xl p-8 shadow-sm">
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <h2 className="text-lg font-bold text-[#1A1A1A]">Email envoyé !</h2>
                <p className="text-sm text-[#6B7280]">
                  Si un compte existe avec <strong>{email}</strong>, vous recevrez un lien dans quelques minutes. Vérifiez aussi vos spams.
                </p>
                <Link href="/connexion" className="text-[#C9A84C] hover:underline text-sm font-medium">
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <Input
                  label="Adresse email"
                  type="email"
                  placeholder="votre@email.fr"
                  autoComplete="email"
                  value={email}
                  error={error}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                />
                <Button type="submit" className="w-full" loading={loading}>
                  Envoyer le lien →
                </Button>
              </form>
            )}

            {!sent && (
              <p className="text-center text-sm text-[#6B7280] mt-6">
                Vous vous souvenez ?{" "}
                <Link href="/connexion" className="text-[#C9A84C] hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
