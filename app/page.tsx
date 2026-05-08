import Link from "next/link";
import type { ReactNode } from "react";
import JsonLd from "@/components/seo/JsonLd";
import {
  Car, UserRound, BarChart3, CheckCircle2,
  ShieldCheck, Zap, Target, Smartphone, Award, MessageCircle, Globe,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { BearImage } from "@/components/ui/BearLogo";

interface Step { step: string; title: string; description: string; icon: ReactNode }
interface Advantage { icon: ReactNode; title: string; desc: string }

const STEPS: Step[] = [
  { step: "1", title: "Renseignez votre véhicule", description: "Marque, modèle, année, carburant. 2 minutes suffisent.", icon: <Car className="h-8 w-8 text-white" /> },
  { step: "2", title: "Votre profil conducteur", description: "Âge, bonus-malus, historique. Tout est anonymisé.", icon: <UserRound className="h-8 w-8 text-white" /> },
  { step: "3", title: "Comparez les offres", description: "Résultats immédiats. Triés par prix et qualité.", icon: <BarChart3 className="h-8 w-8 text-white" /> },
  { step: "4", title: "Souscrivez en ligne", description: "Directement chez l'assureur. Sans intermédiaire.", icon: <CheckCircle2 className="h-8 w-8 text-white" /> },
];

const ADVANTAGES: Advantage[] = [
  { icon: <ShieldCheck className="h-5 w-5 text-[#C9A84C]" />, title: "100% sécurisé", desc: "Vos données sont protégées et jamais revendues." },
  { icon: <Zap className="h-5 w-5 text-[#C9A84C]" />, title: "Résultats en 2 min", desc: "Le comparatif le plus rapide du marché." },
  { icon: <Target className="h-5 w-5 text-[#C9A84C]" />, title: "Sans engagement", desc: "Comparez librement, souscrivez quand vous voulez." },
  { icon: <Smartphone className="h-5 w-5 text-[#C9A84C]" />, title: "100% en ligne", desc: "Depuis votre mobile, tablette ou ordinateur." },
  { icon: <Award className="h-5 w-5 text-[#C9A84C]" />, title: "Marché complet", desc: "Toutes les grandes compagnies françaises." },
  { icon: <MessageCircle className="h-5 w-5 text-[#C9A84C]" />, title: "Support dédié", desc: "Une question ? Notre équipe répond sous 24h." },
];


export default function HomePage() {
  const BASE_URL = process.env.AUTH_URL ?? "https://bearscheck.fr";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BearsCheck",
    url: BASE_URL,
    description: "Comparateur d'assurance auto en France — résultats en 2 minutes, gratuit et sans engagement.",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/comparer` },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "BearsCheck",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/bearscheck-logo.png` },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Comment fonctionne BearsCheck ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BearsCheck compare en temps réel les offres des principaux assureurs auto français. Renseignez votre véhicule et votre profil conducteur (2 minutes), puis obtenez instantanément une liste d'offres triées par prix. Cliquez sur 'Souscrire' pour finaliser directement chez l'assureur.",
        },
      },
      {
        "@type": "Question",
        name: "BearsCheck est-il gratuit ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, l'utilisation de BearsCheck est entièrement gratuite et sans engagement. Nous sommes rémunérés par les assureurs uniquement en cas de souscription via notre plateforme.",
        },
      },
      {
        "@type": "Question",
        name: "Quels assureurs sont comparés ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BearsCheck compare les offres de MAIF, AXA, Allianz, Groupama, Direct Assurance, GMF, Matmut, Maaf, Luko, Lovys, Amaguiz, Macif, MMA et Generali.",
        },
      },
      {
        "@type": "Question",
        name: "Mes données personnelles sont-elles protégées ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. BearsCheck respecte le RGPD. Vos données ne sont jamais revendues à des tiers. Consultez notre politique de confidentialité pour en savoir plus.",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={faqSchema} />
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden bg-white py-16 sm:py-24 min-h-[90vh] flex items-center">
          {/* Dot grid background */}
          <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" aria-hidden="true" />

          {/* Gradient blobs */}
          <div
            className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none blob-animate"
            style={{ background: "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 65%)", transform: "translate(25%, -25%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none blob-animate-slow"
            style={{ background: "radial-gradient(circle, rgba(245,230,200,0.25) 0%, transparent 70%)", transform: "translate(-30%, 20%)" }}
            aria-hidden="true"
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

              {/* Left — text */}
              <div className="flex-1 text-center lg:text-left">
                <div className="fade-up fade-up-1">
                  <Badge variant="gold" className="mb-5">
                    <Globe className="h-3 w-3" />
                    Comparateur 100% français
                  </Badge>
                </div>
                <h1
                  className="fade-up fade-up-2 text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.1] mb-6"
                  style={{ fontFamily: "var(--font-syne), Georgia, serif" }}
                >
                  Trouvez la meilleure
                  <br />
                  <span className="text-[#C9A84C]">assurance auto</span>
                  <br />en 2 minutes
                </h1>
                <p className="fade-up fade-up-3 text-lg sm:text-xl text-[#6B7280] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Comparez les offres des principales assurances françaises et économisez jusqu&apos;à{" "}
                  <strong className="text-[#1A1A1A]">437€ par an</strong>.
                </p>
                <div className="fade-up fade-up-4 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link href="/comparer">
                    <Button size="lg" className="w-full sm:w-auto shadow-lg btn-glow">
                      Comparer gratuitement →
                    </Button>
                  </Link>
                  <Link href="/comment-ca-marche">
                    <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                      Comment ça marche ?
                    </Button>
                  </Link>
                </div>
                <div className="fade-up fade-up-5 mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-sm text-[#6B7280]">
                  {["Gratuit", "Sans engagement", "Résultats immédiats"].map((item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-[#22C55E] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — logo + stats */}
              <div className="fade-up fade-up-3 flex-shrink-0 flex flex-col items-center gap-6">
                {/* Logo card */}
                <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#F5E6C8] via-white to-[#FAFAFA] shadow-xl border border-[#E5D8BC] card-lift">
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ background: "radial-gradient(circle at 60% 40%, rgba(201,168,76,0.08) 0%, transparent 60%)" }}
                    aria-hidden="true"
                  />
                  <BearImage height={140} className="bear-pulse relative z-10 drop-shadow-lg" priority />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                  {[
                    { value: "14", label: "Assureurs comparés" },
                    { value: "2 min", label: "Pour comparer" },
                    { value: "437€", label: "Économisés en moyenne/an" },
                    { value: "Gratuit", label: "Sans engagement" },
                  ].map((stat, i) => (
                    <Card key={stat.label} className="text-center py-3 px-2 card-lift count-up" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                      <p className="text-xl font-bold text-[#C9A84C] font-[family-name:var(--font-jetbrains)]">{stat.value}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{stat.label}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DISCLAIMER ===== */}
        <div className="bg-[#F5E6C8] border-y border-[#E5D8BC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-start gap-3">
            <svg className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-[#6B7280]">
              <strong className="text-[#1A1A1A]">Information importante :</strong> Les tarifs affichés sont des estimations indicatives basées sur des données de marché 2025/2026. Ils ne constituent pas un devis contractuel. BearsCheck est un comparateur d&apos;information, pas un assureur.
            </p>
          </div>
        </div>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 sm:py-24 bg-[#FAFAFA]" id="comment-ca-marche">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <Badge variant="gold" className="mb-3">Simple &amp; rapide</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-2">Comment ça marche ?</h2>
              <p className="text-[#6B7280] mt-3 max-w-xl mx-auto">Comparez les meilleures offres du marché en 4 étapes simples.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {STEPS.map((step, index) => (
                <div key={step.step} className="relative flex flex-col items-center text-center h-full">
                  {index < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-[#E5D8BC] z-0" aria-hidden="true" />
                  )}
                  <div className="relative z-10 flex flex-col items-center w-full h-full bg-white rounded-2xl p-6 shadow-sm border border-[#E5D8BC] card-lift">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9A84C] shadow-md mb-5">
                      {step.icon}
                    </div>
                    <Badge variant="gold" className="mb-3">Étape {step.step}</Badge>
                    <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/comparer">
                <Button size="lg" className="shadow-lg btn-glow">Démarrer ma comparaison →</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== ADVANTAGES ===== */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A]">Pourquoi choisir BearsCheck ?</h2>
              <p className="text-[#6B7280] mt-3">Un comparateur pensé pour être simple, rapide et transparent.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ADVANTAGES.map((adv) => (
                <Card key={adv.title} hover className="flex gap-4 items-start card-lift">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5E6C8]">
                    {adv.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A] mb-1">{adv.title}</h3>
                    <p className="text-sm text-[#6B7280]">{adv.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="py-16 sm:py-28 relative overflow-hidden" style={{ backgroundColor: "#0F172A" }}>
          {/* Gold glow at bottom */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.18) 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          {/* Top gold line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
            aria-hidden="true"
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <BearImage height={96} className="bear-pulse drop-shadow-[0_0_20px_rgba(201,168,76,0.4)]" />
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5"
              style={{ color: "#FFFFFF", fontFamily: "var(--font-syne), Georgia, serif" }}
            >
              Prêt à économiser sur<br />votre assurance ?
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
              Rejoignez des milliers d&apos;automobilistes qui ont trouvé une meilleure assurance en 2 minutes.
            </p>
            <Link href="/comparer">
              <Button size="lg" className="bg-[#C9A84C] text-white hover:bg-[#b8943f] shadow-lg btn-glow">
                Comparer gratuitement →
              </Button>
            </Link>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs" style={{ color: "#64748B" }}>
              {["Gratuit", "Sans engagement", "Résultats immédiats"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-[#C9A84C] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRO SECTION ===== */}
        <section className="py-12 bg-white border-t border-[#E5D8BC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">Vous êtes un professionnel de l&apos;automobile ?</h3>
                <p className="text-sm text-[#6B7280]">Garagiste, concessionnaire, carrossier... Rejoignez notre réseau d&apos;affiliés et générez des commissions.</p>
              </div>
              <Link href="/pro/inscription" className="shrink-0">
                <Button variant="outline" size="md">Devenir partenaire →</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
