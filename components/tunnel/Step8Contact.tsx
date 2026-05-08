"use client";

import { useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import StepWrapper from "./StepWrapper";
import Input from "@/components/ui/Input";
import { useTunnelStore } from "@/store/tunnelStore";
import { calculateQuotes } from "@/lib/pricingEngine";

function getPasswordStrength(pwd: string): number {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

const STRENGTH_LABELS = ["Très faible", "Très faible", "Faible", "Moyen", "Fort", "Très fort"];
const STRENGTH_COLORS = ["bg-red-500", "bg-red-500", "bg-orange-400", "bg-amber-400", "bg-green-500", "bg-green-600"];
const STRENGTH_TEXT = ["text-red-500", "text-red-500", "text-orange-500", "text-amber-500", "text-green-600", "text-green-700"];

export default function Step8Contact() {
  const { formData, updateFormData, setResults, setCalculating, nextStep, prevStep } = useTunnelStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pwdStrength = formData.password ? getPasswordStrength(formData.password) : 0;
  const pwdEntered = (formData.password?.length ?? 0) > 0;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Adresse email invalide";
    }
    if (!formData.prenom) newErrors.prenom = "Le prénom est obligatoire";
    if (formData.password && formData.password.length > 0 && getPasswordStrength(formData.password) < 4) {
      newErrors.password = "Le mot de passe doit être au moins Fort pour créer un compte";
    }
    if (!formData.rgpdConsent) newErrors.rgpd = "Vous devez accepter la politique de confidentialité";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setCalculating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const results = calculateQuotes(formData);
    setResults(results);
    setCalculating(false);
    nextStep();

    fetch("/api/comparisons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData, results, affiliateCode: formData.affiliateCode }),
    }).catch(() => {});

    if (formData.password && formData.password.length >= 8) {
      fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password, name: formData.prenom }),
      }).catch(() => {});
    }
  };

  return (
    <StepWrapper
      title="Encore un dernier détail"
      subtitle="Renseignez votre contact pour recevoir vos devis."
      onNext={handleSubmit}
      onPrev={prevStep}
      nextLabel="Calculer mes devis →"
      nextDisabled={!formData.rgpdConsent || !formData.email || !formData.prenom}
    >
      <div className="flex flex-col gap-5">
        <div className="p-4 bg-[#F5E6C8] border border-[#E5D8BC] rounded-xl text-sm text-[#6B7280]">
          <p className="font-semibold text-[#1A1A1A] mb-1 flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#C9A84C]" /> Presque terminé !</p>
          <p>Saisissez votre contact pour recevoir vos comparatifs personnalisés. La création de compte est optionnelle.</p>
        </div>

        <Input
          label="Prénom"
          placeholder="Votre prénom"
          value={formData.prenom ?? ""}
          error={errors.prenom}
          autoComplete="given-name"
          onChange={(e) => {
            updateFormData({ prenom: e.target.value });
            setErrors((prev) => ({ ...prev, prenom: "" }));
          }}
        />

        <Input
          label="Adresse email"
          type="email"
          placeholder="votre@email.fr"
          value={formData.email ?? ""}
          error={errors.email}
          autoComplete="email"
          onChange={(e) => {
            updateFormData({ email: e.target.value });
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Mot de passe (optionnel)"
            type="password"
            placeholder="Créez un compte pour sauvegarder vos devis"
            value={formData.password ?? ""}
            autoComplete="new-password"
            hint="Optionnel — créez un compte pour retrouver vos devis plus tard"
            error={errors.password}
            onChange={(e) => {
              updateFormData({ password: e.target.value });
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
          />
          {pwdEntered && (
            <div className="px-0.5">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      level <= pwdStrength ? STRENGTH_COLORS[pwdStrength] : "bg-[#E5D8BC]"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-xs font-medium ${STRENGTH_TEXT[pwdStrength]}`}>
                  {STRENGTH_LABELS[pwdStrength]}
                </p>
                {pwdStrength < 4 && (
                  <p className="text-xs text-[#9CA3AF]">Ajoutez majuscules, chiffres, symboles</p>
                )}
                {pwdStrength >= 4 && (
                  <p className="text-xs text-green-600">✓ Mot de passe accepté</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                className="sr-only"
                checked={formData.rgpdConsent ?? false}
                onChange={(e) => {
                  updateFormData({ rgpdConsent: e.target.checked });
                  setErrors((prev) => ({ ...prev, rgpd: "" }));
                }}
                aria-describedby={errors.rgpd ? "rgpd-error" : undefined}
              />
              <div
                className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors
                  ${formData.rgpdConsent ? "border-[#C9A84C] bg-[#C9A84C]" : "border-[#E5D8BC] group-hover:border-[#C9A84C]"}`}
              >
                {formData.rgpdConsent && (
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-[#6B7280] leading-relaxed">
              J&apos;accepte la{" "}
              <a href="/politique-confidentialite" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] underline hover:no-underline">
                politique de confidentialité
              </a>{" "}
              et les{" "}
              <a href="/cgu" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] underline hover:no-underline">
                CGU de BearsCheck
              </a>
              . *
            </span>
          </label>
          {errors.rgpd && (
            <p id="rgpd-error" className="text-xs text-[#EF4444] ml-8" role="alert">
              {errors.rgpd}
            </p>
          )}
        </div>

        <p className="text-xs text-[#9CA3AF] text-center">
          <Lock className="h-3.5 w-3.5 inline mr-1 align-middle" />Vos données sont sécurisées et ne seront jamais revendues à des tiers.
        </p>
      </div>
    </StepWrapper>
  );
}
