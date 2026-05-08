import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Nos assureurs partenaires — MAIF, AXA, Allianz, Groupama et plus",
  description:
    "Découvrez tous les assureurs auto comparés par BearsCheck : MAIF, AXA, Allianz, Groupama, Direct Assurance, GMF, Matmut, MMA et plus encore.",
  alternates: { canonical: "/assureurs" },
  openGraph: {
    title: "Nos assureurs partenaires — MAIF, AXA, Allianz, Groupama et plus",
    description:
      "BearsCheck compare les offres de 14 assureurs auto pour trouver la meilleure couverture au meilleur prix.",
    type: "article",
  },
};
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BearImage } from "@/components/ui/BearLogo";

const ASSUREURS = [
  { name: "MAIF", type: "Mutuelle", formule: "Tous Risques", satisfaction: 4.7, depuis: "1934", points_forts: ["Service client reconnu", "Couverture complète", "Garantie conducteur incluse"] },
  { name: "Groupama", type: "Mutuelle", formule: "Tous Risques", satisfaction: 4.5, depuis: "1900", points_forts: ["Réseau d'agences national", "Offres famille", "Assistance 0km"] },
  { name: "Macif", type: "Mutuelle", formule: "Tiers", satisfaction: 4.4, depuis: "1960", points_forts: ["Tarifs compétitifs", "Assistance 0km", "Fidélité récompensée"] },
  { name: "GMF", type: "Assureur", formule: "Tous Risques", satisfaction: 4.4, depuis: "1934", points_forts: ["Spécialiste fonctionnaires", "Garantie conducteur", "Protection juridique"] },
  { name: "Allianz", type: "Assureur", formule: "Tiers étendu", satisfaction: 4.3, depuis: "1890", points_forts: ["Présence internationale", "Garanties étendues", "Assistance premium"] },
  { name: "Axa", type: "Assureur", formule: "Tiers étendu", satisfaction: 4.2, depuis: "1816", points_forts: ["Leader mondial", "Réseau partenaires", "Application mobile"] },
  { name: "Generali", type: "Assureur", formule: "Tous Risques", satisfaction: 4.3, depuis: "1831", points_forts: ["Couverture européenne", "Véhicule de remplacement", "Devis rapide"] },
  { name: "Lovys", type: "Néo-assureur", formule: "Tiers", satisfaction: 4.2, depuis: "2018", points_forts: ["100% digital", "Sans engagement", "Résiliation facile"] },
  { name: "Luko", type: "Néo-assureur", formule: "Tiers", satisfaction: 4.3, depuis: "2018", points_forts: ["Application intuitive", "Remboursement rapide", "Transparent"] },
  { name: "Direct Assurance", type: "Direct", formule: "Tiers", satisfaction: 4.1, depuis: "1992", points_forts: ["Prix bas", "Souscription rapide", "100% en ligne"] },
  { name: "Matmut", type: "Mutuelle", formule: "Tiers étendu", satisfaction: 4.1, depuis: "1961", points_forts: ["Mutuelle indépendante", "Tarifs stables", "Réseau agences"] },
  { name: "Maaf", type: "Mutuelle", formule: "Tiers étendu", satisfaction: 4.0, depuis: "1950", points_forts: ["Historique solide", "Offres modulables", "Bons de réduction"] },
  { name: "Amaguiz", type: "Direct", formule: "Tiers", satisfaction: 3.9, depuis: "2008", points_forts: ["Assurance à la carte", "Prix transparent", "Personnalisable"] },
  { name: "MMA", type: "Assureur", formule: "Tous Risques", satisfaction: 4.2, depuis: "1828", points_forts: ["Expertise longue durée", "Protection juridique", "Assistance complète"] },
];

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`h-3.5 w-3.5 ${i < Math.round(score) ? "text-[#C9A84C]" : "text-[#E5D8BC]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function AssureursPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-16 sm:py-20 bg-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex justify-center mb-6">
              <BearImage height={80} className="drop-shadow-md" priority />
            </div>
            <Badge variant="gold" className="mb-4">Marché complet</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
              Nos assureurs partenaires
            </h1>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto mb-8">
              BearsCheck compare les offres de {ASSUREURS.length} assureurs et mutuelles françaises pour vous garantir les meilleurs prix.
            </p>
            <Link href="/comparer">
              <Button size="lg" className="shadow-lg">Comparer tous les assureurs →</Button>
            </Link>
          </div>
        </section>

        <section className="py-12 bg-[#FAFAFA]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ASSUREURS.map((assureur) => (
                <Card key={assureur.name} hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-[#F5E6C8] flex items-center justify-center text-[#C9A84C] font-bold text-sm shrink-0">
                        {assureur.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1A1A]">{assureur.name}</p>
                        <p className="text-xs text-[#9CA3AF]">Depuis {assureur.depuis}</p>
                      </div>
                    </div>
                    <Badge variant="neutral">{assureur.type}</Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <StarRating score={assureur.satisfaction} />
                    <span className="text-sm font-medium text-[#1A1A1A]">{assureur.satisfaction}/5</span>
                  </div>

                  <ul className="flex flex-col gap-1 mb-3">
                    {assureur.points_forts.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <svg className="h-3.5 w-3.5 text-[#22C55E] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {point}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-t border-[#E5D8BC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-[#9CA3AF] mb-4">
              Les avis de satisfaction sont basés sur des données agrégées de sources publiques (Trustpilot, Google Reviews, enquêtes de satisfaction 2024).
              BearsCheck n&apos;est affilié à aucun assureur en particulier.
            </p>
            <Link href="/comparer">
              <Button size="md">Comparer gratuitement →</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
