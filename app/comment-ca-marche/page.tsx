import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comment ça marche — Comparer son assurance auto en 4 étapes",
  description:
    "Découvrez comment BearsCheck vous permet de comparer votre assurance auto en 4 étapes simples. Renseignez votre véhicule, votre profil, comparez et souscrivez.",
  alternates: { canonical: "/comment-ca-marche" },
  openGraph: {
    title: "Comment ça marche — Comparer son assurance auto en 4 étapes",
    description: "Comparez votre assurance auto en 4 étapes simples avec BearsCheck.",
    type: "article",
  },
};
import { Car, UserRound, Shield, BarChart3, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BearImage } from "@/components/ui/BearLogo";

interface Step { step: string; icon: ReactNode; title: string; description: string; duration: string }

const STEPS: Step[] = [
  {
    step: "1",
    icon: <Car className="h-7 w-7 text-white" />,
    title: "Renseignez votre véhicule",
    description: "Marque, modèle, année, carburant et valeur du véhicule. Ces informations nous permettent d'identifier les offres adaptées à votre type de voiture.",
    duration: "~1 minute",
  },
  {
    step: "2",
    icon: <UserRound className="h-7 w-7 text-white" />,
    title: "Votre profil conducteur",
    description: "Âge, bonus-malus, historique de sinistres, kilométrage annuel et usage du véhicule. Tout est anonymisé et jamais revendu.",
    duration: "~1 minute",
  },
  {
    step: "3",
    icon: <Shield className="h-7 w-7 text-white" />,
    title: "Vos besoins en couverture",
    description: "Tiers, tiers étendu ou tous risques ? Garanties optionnelles souhaitées (bris de glace, assistance, protection juridique...).",
    duration: "~30 secondes",
  },
  {
    step: "4",
    icon: <BarChart3 className="h-7 w-7 text-white" />,
    title: "Comparez les offres",
    description: "Notre moteur de calcul analyse instantanément les offres de 14 assureurs et les trie par prix croissant. Filtrez selon votre budget.",
    duration: "Immédiat",
  },
  {
    step: "5",
    icon: <CheckCircle2 className="h-7 w-7 text-white" />,
    title: "Souscrivez en ligne",
    description: "Cliquez sur \"Souscrire\" pour être redirigé directement chez l'assureur. Aucun intermédiaire, aucune commission cachée.",
    duration: "~5 minutes",
  },
];

const FAQS = [
  {
    q: "BearsCheck est-il gratuit ?",
    a: "Oui, totalement. La comparaison est gratuite et sans engagement. Nous sommes rémunérés uniquement si vous souscrivez via notre lien, et cela ne change pas le prix que vous payez.",
  },
  {
    q: "Les tarifs affichés sont-ils exacts ?",
    a: "Les tarifs sont des estimations basées sur des données de marché 2025/2026. Ils peuvent varier selon votre profil exact. Le tarif définitif est celui proposé directement par l'assureur lors de votre souscription.",
  },
  {
    q: "Mes données sont-elles protégées ?",
    a: "Absolument. Nous ne revendons jamais vos données à des tiers. Elles sont utilisées uniquement pour calculer vos devis. Vous pouvez demander leur suppression à tout moment conformément au RGPD.",
  },
  {
    q: "Combien de temps prend la comparaison ?",
    a: "Environ 2 minutes pour remplir le formulaire, puis les résultats s'affichent instantanément. La souscription chez l'assureur prend ensuite 5 à 10 minutes.",
  },
  {
    q: "Puis-je changer d'assurance en cours d'année ?",
    a: "Oui ! Depuis la loi Hamon, vous pouvez résilier votre assurance auto à tout moment après 1 an de contrat. BearsCheck vous aide à trouver la meilleure offre pour votre situation.",
  },
];

export default function CommentCaMarchePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-16 sm:py-20 bg-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex justify-center mb-6">
              <BearImage height={80} className="drop-shadow-md" priority />
            </div>
            <Badge variant="gold" className="mb-4">Guide complet</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
              Comment ça marche ?
            </h1>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto mb-8">
              BearsCheck compare les offres de 14 assureurs français en quelques clics. Voici comment fonctionne notre comparateur.
            </p>
            <Link href="/comparer">
              <Button size="lg" className="shadow-lg">Démarrer ma comparaison →</Button>
            </Link>
          </div>
        </section>

        <section className="py-16 bg-[#FAFAFA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col gap-0">
              {STEPS.map((step, index) => (
                <div key={step.step} className="flex gap-6 sm:gap-8">
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C9A84C] shadow-md mt-6">
                      {step.icon}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="w-0.5 bg-[#E5D8BC] flex-1 min-h-[16px] mt-2 mb-0" />
                    )}
                  </div>
                  <Card className="flex-1 my-3 p-6 flex flex-col justify-center min-h-[120px]">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="gold">Étape {step.step}</Badge>
                      <Badge variant="neutral">{step.duration}</Badge>
                    </div>
                    <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">{step.title}</h2>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{step.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-[#1A1A1A] text-center mb-10">Questions fréquentes</h2>
            <div className="flex flex-col gap-4">
              {FAQS.map((faq) => (
                <Card key={faq.q}>
                  <h3 className="font-semibold text-[#1A1A1A] mb-2">{faq.q}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 relative overflow-hidden text-center" style={{ backgroundColor: "#0F172A" }}>
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.18) 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
            aria-hidden="true"
          />
          <div className="max-w-2xl mx-auto px-4 relative z-10">
            <div className="flex justify-center mb-6">
              <BearImage height={88} className="bear-pulse drop-shadow-[0_0_20px_rgba(201,168,76,0.4)]" />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#FFFFFF" }}>Prêt à comparer ?</h2>
            <p className="mb-8" style={{ color: "#94A3B8" }}>2 minutes suffisent pour trouver une meilleure assurance.</p>
            <Link href="/comparer">
              <Button size="lg" className="bg-[#C9A84C] text-white hover:bg-[#b8943f] shadow-lg btn-glow">
                Comparer gratuitement →
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
