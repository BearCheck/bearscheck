"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BearLogo from "@/components/ui/BearLogo";
import { CheckCircle2, AlertTriangle } from "lucide-react";

function getStrength(pwd: string): number {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}
const LABELS = ["Très faible", "Très faible", "Faible", "Moyen", "Fort", "Très fort"];
const COLORS = ["bg-red-500", "bg-red-500", "bg-orange-400", "bg-amber-400", "bg-green-500", "bg-green-600"];
const TEXT   = ["text-red-500", "text-red-500", "text-orange-500", "text-amber-500", "text-green-600", "text-green-700"];

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const strength = getStrength(password);
  const pwdEntered = password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 4) { setError("Le mot de passe doit être au moins Fort."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur serveur"); return; }
      setDone(true);
      setTimeout(() => router.push("/connexion"), 3000);
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <p className="text-sm text-[#6B7280]">Lien invalide ou expiré.</p>
        <Link href="/mot-de-passe-oublie" className="text-[#C9A84C] hover:underline text-sm font-medium">
          Faire une nouvelle demande
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h2 className="text-lg font-bold text-[#1A1A1A]">Mot de passe modifié !</h2>
        <p className="text-sm text-[#6B7280]">Redirection vers la connexion…</p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <Input
          label="Nouveau mot de passe"
          type="password"
          placeholder="Choisissez un mot de passe fort"
          autoComplete="new-password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
        />
        {pwdEntered && (
          <div className="px-0.5 mt-2">
            <div className="flex gap-1 mb-1">
              {[1,2,3,4,5].map((l) => (
                <div key={l} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${l <= strength ? COLORS[strength] : "bg-[#E5D8BC]"}`} />
              ))}
            </div>
            <p className={`text-xs font-medium ${TEXT[strength]}`}>{LABELS[strength]}</p>
          </div>
        )}
      </div>
      <Input
        label="Confirmer le mot de passe"
        type="password"
        placeholder="Répétez le mot de passe"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => { setConfirm(e.target.value); setError(""); }}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button type="submit" className="w-full" loading={loading} disabled={strength < 4 || !confirm}>
        Enregistrer le nouveau mot de passe
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-[#FAFAFA]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <BearLogo size="md" showTagline className="justify-center mb-4" />
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Nouveau mot de passe</h1>
            <p className="text-sm text-[#6B7280] mt-2">Choisissez un mot de passe fort pour sécuriser votre compte.</p>
          </div>
          <div className="bg-white border border-[#E5D8BC] rounded-2xl p-8 shadow-sm">
            <Suspense fallback={<p className="text-sm text-center text-[#6B7280]">Chargement…</p>}>
              <ResetForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
