"use client";

import { useState } from "react";
import { KeyRound, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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

export default function ChangePasswordCard() {
  const [current, setCurrent]   = useState("");
  const [newPwd, setNewPwd]     = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  const strength = getStrength(newPwd);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (strength < 4) { setError("Le nouveau mot de passe doit être au moins Fort."); return; }
    if (newPwd !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur serveur"); return; }
      setSuccess(true);
      setCurrent(""); setNewPwd(""); setConfirm("");
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E5D8BC] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-xl bg-[#F5E6C8] flex items-center justify-center">
          <KeyRound className="h-4 w-4 text-[#C9A84C]" />
        </div>
        <h2 className="font-bold text-[#1A1A1A]">Changer le mot de passe</h2>
      </div>

      {success ? (
        <div className="flex items-center gap-3 py-4 text-green-600">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">Mot de passe modifié avec succès !</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Mot de passe actuel"
            type="password"
            placeholder="Votre mot de passe actuel"
            autoComplete="current-password"
            value={current}
            onChange={(e) => { setCurrent(e.target.value); setError(""); }}
          />

          <div>
            <Input
              label="Nouveau mot de passe"
              type="password"
              placeholder="Choisissez un mot de passe fort"
              autoComplete="new-password"
              value={newPwd}
              onChange={(e) => { setNewPwd(e.target.value); setError(""); }}
            />
            {newPwd.length > 0 && (
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
            label="Confirmer le nouveau mot de passe"
            type="password"
            placeholder="Répétez le mot de passe"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setError(""); }}
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button
            type="submit"
            loading={loading}
            disabled={!current || strength < 4 || !confirm}
            className="w-full sm:w-auto self-start"
          >
            Enregistrer
          </Button>
        </form>
      )}
    </div>
  );
}
