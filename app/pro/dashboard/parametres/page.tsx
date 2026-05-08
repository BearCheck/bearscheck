"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, CreditCard, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Section = "profil" | "password" | "rib" | "danger";

function getStrength(pwd: string): number {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}
const S_LABELS = ["Très faible","Très faible","Faible","Moyen","Fort","Très fort"];
const S_COLORS = ["bg-red-500","bg-red-500","bg-orange-400","bg-amber-400","bg-green-500","bg-green-600"];
const S_TEXT   = ["text-red-500","text-red-500","text-orange-500","text-amber-500","text-green-600","text-green-700"];

export default function ParametresPage() {
  const router = useRouter();
  const [active, setActive] = useState<Section>("profil");

  // Profil
  const [raisonSociale, setRaisonSociale] = useState("");
  const [nomResp, setNomResp]             = useState("");
  const [tel, setTel]                     = useState("");
  const [adresse, setAdresse]             = useState("");
  const [profilOk, setProfilOk]           = useState(false);
  const [profilErr, setProfilErr]         = useState("");
  const [profilSaving, setProfilSaving]   = useState(false);

  // Password
  const [current, setCurrent]   = useState("");
  const [newPwd, setNewPwd]     = useState("");
  const [confirm, setConfirm]   = useState("");
  const [pwdOk, setPwdOk]       = useState(false);
  const [pwdErr, setPwdErr]     = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const strength = getStrength(newPwd);

  // RIB
  const [iban, setIban]       = useState("");
  const [ribOk, setRibOk]     = useState(false);
  const [ribErr, setRibErr]   = useState("");
  const [ribSaving, setRibSaving] = useState(false);

  // Suppression
  const [delPwd, setDelPwd]         = useState("");
  const [delConfirm, setDelConfirm] = useState("");
  const [delErr, setDelErr]         = useState("");
  const [delLoading, setDelLoading] = useState(false);

  async function saveProfil(e: React.FormEvent) {
    e.preventDefault();
    setProfilErr(""); setProfilOk(false);
    setProfilSaving(true);
    const res = await fetch("/api/pro/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raisonSociale, nomResponsable: nomResp, telephone: tel, adresse }),
    });
    setProfilSaving(false);
    if (res.ok) { setProfilOk(true); setTimeout(() => setProfilOk(false), 3000); }
    else { const d = await res.json(); setProfilErr(d.error ?? "Erreur"); }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdErr(""); setPwdOk(false);
    if (strength < 4) { setPwdErr("Mot de passe trop faible (Fort minimum)"); return; }
    if (newPwd !== confirm) { setPwdErr("Les mots de passe ne correspondent pas"); return; }
    setPwdSaving(true);
    const res = await fetch("/api/pro/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: newPwd }),
    });
    setPwdSaving(false);
    if (res.ok) {
      setPwdOk(true);
      setCurrent(""); setNewPwd(""); setConfirm("");
      setTimeout(() => setPwdOk(false), 3000);
    } else { const d = await res.json(); setPwdErr(d.error ?? "Erreur"); }
  }

  async function saveRib(e: React.FormEvent) {
    e.preventDefault();
    setRibErr(""); setRibOk(false);
    if (!iban.trim()) { setRibErr("IBAN requis"); return; }
    setRibSaving(true);
    const res = await fetch("/api/pro/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ribIban: iban.trim() }),
    });
    setRibSaving(false);
    if (res.ok) { setRibOk(true); setTimeout(() => setRibOk(false), 3000); }
    else { const d = await res.json(); setRibErr(d.error ?? "Erreur"); }
  }

  async function deleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDelErr("");
    if (delConfirm !== "SUPPRIMER") { setDelErr('Tapez exactement "SUPPRIMER"'); return; }
    setDelLoading(true);
    const res = await fetch("/api/pro/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: delPwd, confirmation: delConfirm }),
    });
    setDelLoading(false);
    if (res.ok) router.push("/pro/connexion?deleted=1");
    else { const d = await res.json(); setDelErr(d.error ?? "Erreur"); }
  }

  const TABS: { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "profil",   label: "Profil entreprise",  icon: User },
    { id: "password", label: "Mot de passe",        icon: Lock },
    { id: "rib",      label: "RIB / IBAN",          icon: CreditCard },
    { id: "danger",   label: "Supprimer le compte", icon: Trash2 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Paramètres</h1>
        <p className="text-[#64748B] text-sm mt-1">Gérez les informations de votre compte partenaire.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-2 flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
                  active === tab.id
                    ? tab.id === "danger" ? "bg-red-50 text-red-600" : "bg-[#F5E6C8] text-[#C9A84C]"
                    : tab.id === "danger" ? "text-red-400 hover:bg-red-50 hover:text-red-600" : "text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#1A1A1A]"
                }`}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">

            {/* PROFIL */}
            {active === "profil" && (
              <form onSubmit={saveProfil} className="flex flex-col gap-4">
                <h2 className="font-bold text-[#1A1A1A] text-lg mb-1">Informations de l'entreprise</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Raison sociale" placeholder="Nom de l'entreprise" value={raisonSociale} onChange={(e) => setRaisonSociale(e.target.value)} />
                  <Input label="Responsable" placeholder="Prénom Nom" value={nomResp} onChange={(e) => setNomResp(e.target.value)} />
                </div>
                <Input label="Téléphone" type="tel" placeholder="06 12 34 56 78" value={tel} onChange={(e) => setTel(e.target.value)} />
                <Input label="Adresse" placeholder="Adresse de l'établissement" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                {profilErr && <p className="text-xs text-red-500">{profilErr}</p>}
                {profilOk && <div className="flex items-center gap-2 text-green-600 text-sm"><CheckCircle2 className="h-4 w-4" /> Enregistré</div>}
                <Button type="submit" loading={profilSaving} className="w-fit">Enregistrer</Button>
              </form>
            )}

            {/* MOT DE PASSE */}
            {active === "password" && (
              <form onSubmit={savePassword} className="flex flex-col gap-4">
                <h2 className="font-bold text-[#1A1A1A] text-lg mb-1">Changer le mot de passe</h2>
                <Input label="Mot de passe actuel" type="password" placeholder="••••••••" autoComplete="current-password" value={current} onChange={(e) => { setCurrent(e.target.value); setPwdErr(""); }} />
                <div>
                  <Input label="Nouveau mot de passe" type="password" placeholder="Fort recommandé" autoComplete="new-password" value={newPwd} onChange={(e) => { setNewPwd(e.target.value); setPwdErr(""); }} />
                  {newPwd.length > 0 && (
                    <div className="mt-2 px-0.5">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4,5].map((l) => (
                          <div key={l} className={`h-1.5 flex-1 rounded-full transition-all ${l <= strength ? S_COLORS[strength] : "bg-[#E5D8BC]"}`} />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${S_TEXT[strength]}`}>{S_LABELS[strength]}</p>
                    </div>
                  )}
                </div>
                <Input label="Confirmer" type="password" placeholder="••••••••" autoComplete="new-password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setPwdErr(""); }} />
                {pwdErr && <p className="text-xs text-red-500">{pwdErr}</p>}
                {pwdOk && <div className="flex items-center gap-2 text-green-600 text-sm"><CheckCircle2 className="h-4 w-4" /> Mot de passe modifié</div>}
                <Button type="submit" loading={pwdSaving} disabled={!current || strength < 4 || !confirm} className="w-fit">Mettre à jour</Button>
              </form>
            )}

            {/* RIB */}
            {active === "rib" && (
              <form onSubmit={saveRib} className="flex flex-col gap-4">
                <h2 className="font-bold text-[#1A1A1A] text-lg mb-1">Coordonnées bancaires</h2>
                <p className="text-sm text-[#6B7280]">Utilisées uniquement pour le versement de vos commissions.</p>
                <Input label="IBAN" placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" value={iban} onChange={(e) => { setIban(e.target.value); setRibErr(""); }} />
                <div className="flex items-center gap-2 p-3 bg-[#F5E6C8] rounded-xl text-xs text-[#6B7280]">
                  <CreditCard className="h-4 w-4 text-[#C9A84C] shrink-0" />
                  Vos coordonnées bancaires sont sécurisées et chiffrées.
                </div>
                {ribErr && <p className="text-xs text-red-500">{ribErr}</p>}
                {ribOk && <div className="flex items-center gap-2 text-green-600 text-sm"><CheckCircle2 className="h-4 w-4" /> IBAN enregistré</div>}
                <Button type="submit" loading={ribSaving} disabled={!iban.trim()} className="w-fit">Enregistrer</Button>
              </form>
            )}

            {/* DANGER */}
            {active === "danger" && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                  <h2 className="font-bold text-[#1A1A1A] text-lg">Supprimer le compte</h2>
                </div>
                <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
                  Cette action est <strong>irréversible</strong>. Votre compte partenaire, votre code affilié et toutes vos données seront définitivement supprimés.
                </p>
                <form onSubmit={deleteAccount} className="flex flex-col gap-4">
                  <Input label="Mot de passe" type="password" placeholder="Confirmez votre identité" value={delPwd} onChange={(e) => { setDelPwd(e.target.value); setDelErr(""); }} />
                  <Input label='Tapez "SUPPRIMER" pour confirmer' placeholder="SUPPRIMER" value={delConfirm} onChange={(e) => { setDelConfirm(e.target.value); setDelErr(""); }} />
                  {delErr && <p className="text-xs text-red-500">{delErr}</p>}
                  <Button type="submit" loading={delLoading} disabled={delConfirm !== "SUPPRIMER" || !delPwd} className="w-fit bg-red-600 hover:bg-red-700 text-white border-0">
                    Supprimer définitivement
                  </Button>
                </form>
              </div>
            )}

          </Card>
        </div>
      </div>
    </div>
  );
}
