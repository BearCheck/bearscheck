import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CgvPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Conditions Générales de Vente</h1>

          {[
            { title: "1. Objet", content: "Les présentes CGV s'appliquent aux prestations commerciales de BearsCheck, notamment aux contrats d'affiliation avec les professionnels de l'automobile (garages, concessionnaires)." },
            { title: "2. Contrat d'affiliation", content: "L'inscription en tant que partenaire affilié est gratuite. Les commissions sont calculées selon les tarifs définis dans l'accord commercial individuel. Le montant de commission par défaut est de 0€ jusqu'à signature d'un accord commercial." },
            { title: "3. Commissions", content: "Les commissions sont calculées sur la base des conversions attribuées selon le modèle \"last click\" avec une fenêtre d'attribution de 30 jours. Le seuil minimum de versement est de 50€. Les virements sont effectués manuellement par BearsCheck." },
            { title: "4. Prix et facturation", content: "Le Service de comparaison est gratuit pour les particuliers. Les partenaires affiliés font l'objet d'une convention commerciale séparée définissant les modalités de rémunération." },
            { title: "5. Résiliation", content: "Chaque partie peut mettre fin au contrat d'affiliation avec un préavis de 30 jours par email. Les commissions acquises avant la résiliation restent dues." },
            { title: "6. Droit applicable", content: "Les présentes CGV sont régies par le droit français." },
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
