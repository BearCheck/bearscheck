import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation de BearsCheck, comparateur d'assurance auto.",
  robots: { index: false, follow: false },
};

export default function CguPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Conditions Générales d&apos;Utilisation</h1>

          <div className="mb-6 p-4 bg-[#F5E6C8] border border-[#E5D8BC] rounded-xl">
            <p className="text-sm text-[#6B7280]">
              <strong className="text-[#1A1A1A]">Important :</strong> BearsCheck est un comparateur d&apos;information. Les tarifs affichés sont des estimations indicatives non contractuelles. BearsCheck n&apos;est pas un assureur ni un courtier en assurance.
            </p>
          </div>

          {[
            { title: "1. Objet", content: "Les présentes CGU définissent les conditions d'utilisation du site BearsCheck (ci-après « le Service »). En utilisant le Service, vous acceptez sans réserve les présentes conditions." },
            { title: "2. Description du service", content: "BearsCheck propose un outil de comparaison d'estimations tarifaires pour l'assurance auto en France. Il ne s'agit pas d'un service de courtage en assurance. Les résultats affichés sont des estimations calculées à partir de données de marché et ne constituent pas des devis contractuels." },
            { title: "3. Accès au service", content: "Le Service est accessible gratuitement à toute personne majeure. BearsCheck se réserve le droit de modifier, interrompre ou supprimer le Service à tout moment." },
            { title: "4. Obligations de l'utilisateur", content: "L'utilisateur s'engage à fournir des informations exactes lors du tunnel de comparaison, à ne pas utiliser le Service à des fins frauduleuses, et à respecter les droits de propriété intellectuelle de BearsCheck." },
            { title: "5. Limitation de responsabilité", content: "BearsCheck ne peut être tenu responsable de l'inexactitude des estimations tarifaires, des décisions d'achat basées sur ces estimations, ou de tout préjudice résultant de l'utilisation du Service." },
            { title: "6. Propriété intellectuelle", content: "Tous les éléments du Service (marque, logo, contenus) sont la propriété exclusive de BearsCheck et protégés par les lois sur la propriété intellectuelle." },
            { title: "7. Droit applicable", content: "Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la juridiction compétente de [VILLE]." },
          ].map((section) => (
            <section key={section.title} className="mb-5">
              <h2 className="text-base font-semibold text-[#1A1A1A] mb-2">{section.title}</h2>
              <p className="text-sm text-[#6B7280] leading-relaxed">{section.content}</p>
            </section>
          ))}

          <p className="text-xs text-[#9CA3AF] mt-8">Dernière mise à jour : mai 2026</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
