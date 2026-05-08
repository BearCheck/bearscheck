"use client";

import { useState } from "react";
import { User, Lock, CreditCard, Save, Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Section = "profil" | "password" | "rib";

export default function ParametresPage() {
  const [active, setActive] = useState<Section>("profil");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const TABS: { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "profil",   label: "Profil",      icon: User },
    { id: "password", label: "Mot de passe", icon: Lock },
    { id: "rib",      label: "RIB / IBAN",  icon: CreditCard },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Paramètres</h1>
        <p className="text-[#6B7280] text-sm mt-1">Gérez les informations de votre compte partenaire.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab nav */}
        <div className="lg:col-span-1">
          <Card className="p-2 flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
                  active === tab.id
                    ? "bg-[#F5E6C8] text-[#C9A84C]"
                    : "text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#1A1A1A]"
                }`}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </Card>
        </div>

        {/* Forms */}
        <div className="lg:col-span-3">
          <Card>
            {active === "profil" && (
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <h2 className="font-bold text-[#1A1A1A] mb-1">Informations de l'entreprise</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Raison sociale" placeholder="Nom de l'entreprise" />
                  <Input label="SIRET" placeholder="14 chiffres" maxLength={14} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Prénom du responsable" placeholder="Prénom" />
                  <Input label="Nom du responsable" placeholder="Nom" />
                </div>
                <Input label="Email professionnel" type="email" placeholder="contact@entreprise.fr" />
                <Input label="Téléphone" type="tel" placeholder="06 12 34 56 78" />
                <Input label="Adresse" placeholder="Adresse de l'établissement" />
                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" loading={saving} className="gap-2">
                    <Save className="h-4 w-4" />
                    {saved ? "Enregistré !" : "Enregistrer"}
                  </Button>
                  {saved && <span className="text-sm text-green-600">✓ Modifications sauvegardées</span>}
                </div>
              </form>
            )}

            {active === "password" && (
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <h2 className="font-bold text-[#1A1A1A] mb-1">Changer le mot de passe</h2>
                <Input label="Mot de passe actuel" type="password" placeholder="••••••••" />
                <div className="relative">
                  <Input
                    label="Nouveau mot de passe"
                    type={showPwd ? "text" : "password"}
                    placeholder="8 caractères minimum"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-8 text-[#9CA3AF] hover:text-[#6B7280]"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" />
                <p className="text-xs text-[#9CA3AF]">Minimum 8 caractères. Utilisez des lettres, chiffres et symboles.</p>
                <Button type="submit" loading={saving} className="w-fit gap-2">
                  <Lock className="h-4 w-4" />
                  {saved ? "Enregistré !" : "Mettre à jour"}
                </Button>
              </form>
            )}

            {active === "rib" && (
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <h2 className="font-bold text-[#1A1A1A] mb-1">Coordonnées bancaires</h2>
                <p className="text-sm text-[#6B7280]">
                  Ces informations servent uniquement au versement de vos commissions.
                </p>
                <Input label="Titulaire du compte" placeholder="Nom complet ou raison sociale" />
                <Input label="IBAN" placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" />
                <Input label="BIC / SWIFT" placeholder="XXXXXXXX" />
                <div className="flex items-center gap-2 p-3 bg-[#F5E6C8] rounded-xl text-xs text-[#6B7280]">
                  <CreditCard className="h-4 w-4 text-[#C9A84C] shrink-0" />
                  Vos coordonnées bancaires sont chiffrées et sécurisées.
                </div>
                <Button type="submit" loading={saving} className="w-fit gap-2">
                  <Save className="h-4 w-4" />
                  {saved ? "Enregistré !" : "Enregistrer"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
