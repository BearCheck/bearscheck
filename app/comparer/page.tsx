"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { LockKeyhole, Info } from "lucide-react";
import BearLogo from "@/components/ui/BearLogo";
import ProgressBar from "@/components/tunnel/ProgressBar";
import BearLoader from "@/components/tunnel/BearLoader";
import { useTunnelStore } from "@/store/tunnelStore";

import Step0Intention from "@/components/tunnel/Step0Intention";
import Step1Vehicule from "@/components/tunnel/Step1Vehicule";
import Step2Utilisation from "@/components/tunnel/Step2Utilisation";
import Step3Conducteur from "@/components/tunnel/Step3Conducteur";
import Step4Historique from "@/components/tunnel/Step4Historique";
import Step5ConducteurSecondaire from "@/components/tunnel/Step5ConducteurSecondaire";
import Step6Couverture from "@/components/tunnel/Step6Couverture";
import Step7Garanties from "@/components/tunnel/Step7Garanties";
import Step8Contact from "@/components/tunnel/Step8Contact";
import ResultsPage from "@/components/tunnel/ResultsPage";

const STEPS = [
  Step0Intention,
  Step1Vehicule,
  Step2Utilisation,
  Step3Conducteur,
  Step4Historique,
  Step5ConducteurSecondaire,
  Step6Couverture,
  Step7Garanties,
  Step8Contact,
];

function TunnelContent() {
  const searchParams = useSearchParams();
  const { currentStep, totalSteps, isCalculating, formData, updateFormData } = useTunnelStore();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      updateFormData({ affiliateCode: ref });
      document.cookie = `bearscheck_ref=${ref}; max-age=${30 * 24 * 3600}; path=/; SameSite=Lax`;
      fetch("/api/track/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateCode: ref, type: "COMPARISON" }),
      }).catch(() => {});
    }
  }, [searchParams, updateFormData]);

  const isResults = currentStep >= STEPS.length;
  const StepComponent = STEPS[currentStep];

  const getPartnerName = () => {
    if (!formData.affiliateCode) return undefined;
    return formData.affiliateCode.replace("BCK-GAR-", "Partenaire #");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5D8BC]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" aria-label="Retour à l'accueil">
              <BearLogo size="sm" />
            </Link>
            <div />
          </div>
          {!isResults && (
            <ProgressBar current={currentStep} total={totalSteps} affiliatePartner={getPartnerName()} />
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="max-w-2xl mx-auto w-full px-4 py-8 flex-1">
          {isCalculating ? (
            <BearLoader />
          ) : isResults ? (
            <ResultsPage />
          ) : (
            <div className="slide-in-right">
              <StepComponent />
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-[#E5D8BC] py-4">
        <div className="max-w-2xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[#9CA3AF]">
          <span>© {new Date().getFullYear()} BearsCheck</span>
          <a href="/mentions-legales" className="hover:text-[#C9A84C]">Mentions légales</a>
          <a href="/politique-confidentialite" className="hover:text-[#C9A84C]">Confidentialité</a>
          <span className="text-[#E5D8BC]">|</span>
          <span className="flex items-center gap-1"><LockKeyhole className="h-3 w-3" /> Connexion sécurisée</span>
          <span className="w-full text-center flex items-center justify-center gap-1"><Info className="h-3 w-3" /> Tarifs indicatifs — non contractuels</span>
        </div>
      </footer>
    </div>
  );
}

export default function ComparerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <BearLoader />
      </div>
    }>
      <TunnelContent />
    </Suspense>
  );
}
