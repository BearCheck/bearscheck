import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et traitement des données personnelles de BearsCheck.",
  robots: { index: false, follow: false },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Politique de confidentialité</h1>

          {[
            {
              title: "1. Responsable du traitement",
              content: "BearsCheck est édité par Paul PACKE, entreprise individuelle (SIRET 944 810 696 00012), 12 Rue de l'Octroi, 54000 Nancy. Contact : info@bearscheck.com"
            },
            {
              title: "2. Données collectées",
              content: "Nous collectons les données que vous nous fournissez lors du tunnel de comparaison : prénom, email, informations sur votre véhicule et profil conducteur. Ces données sont nécessaires au calcul des estimations tarifaires. Nous collectons également des données techniques (adresse IP hashée, navigateur) à des fins statistiques."
            },
            {
              title: "3. Finalités du traitement",
              content: "Vos données sont utilisées pour : calculer et afficher des estimations d'assurance auto, vous envoyer vos résultats par email (avec votre accord), améliorer nos services, vous contacter si vous avez créé un compte."
            },
            {
              title: "4. Base légale",
              content: "Le traitement est fondé sur votre consentement explicite (case à cocher RGPD lors du tunnel) et sur l'intérêt légitime de BearsCheck pour l'amélioration de ses services."
            },
            {
              title: "5. Durée de conservation",
              content: "Vos données de comparaison sont conservées 12 mois. Les données de compte sont conservées jusqu'à la suppression de votre compte. Les données de cookies statistiques sont conservées 13 mois maximum."
            },
            {
              title: "6. Partage des données",
              content: "Vos données ne sont jamais vendues à des tiers. Elles peuvent être transmises aux assureurs uniquement lorsque vous cliquez sur \"Souscrire\" (redirection directe). Nos sous-traitants (hébergeur, email) sont contractuellement engagés à respecter le RGPD."
            },
            {
              title: "7. Vos droits",
              content: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition. Pour l'exercer : info@bearscheck.com ou via le bouton \"Supprimer mon compte\" dans votre espace personnel. En cas de litige, vous pouvez saisir la CNIL (cnil.fr)."
            },
            {
              title: "8. Cookies",
              content: "Nous utilisons des cookies fonctionnels (nécessaires au tunnel), des cookies analytiques (statistiques anonymes) et des cookies d'affiliation (tracking QR code). Vous pouvez gérer vos préférences via la bannière cookies affichée lors de votre première visite."
            },
          ].map((section) => (
            <section key={section.title} className="mb-6">
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">{section.title}</h2>
              <p className="text-sm text-[#6B7280] leading-relaxed">{section.content}</p>
            </section>
          ))}

          <p className="text-xs text-[#9CA3AF] mt-8">Dernière mise à jour : mai 2025</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
