import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de BearsCheck, comparateur d'assurance auto.",
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto prose prose-sm">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Mentions légales</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">1. Éditeur du site</h2>
            <p className="text-[#6B7280]">
              BearsCheck est édité par [RAISON SOCIALE À COMPLÉTER], société [FORME JURIDIQUE] au capital de [MONTANT] €,
              immatriculée au RCS de [VILLE] sous le numéro [NUMÉRO SIRET].
              <br /><br />
              Siège social : [ADRESSE COMPLÈTE]<br />
              Email : contact@bearscheck.fr<br />
              Téléphone : [NUMÉRO]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">2. Hébergeur</h2>
            <p className="text-[#6B7280]">
              Le site BearsCheck est hébergé par Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, États-Unis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">3. Activité</h2>
            <p className="text-[#6B7280]">
              BearsCheck est un comparateur d&apos;information sur les assurances auto. Il ne s&apos;agit pas d&apos;un assureur, ni d&apos;un courtier en assurance.
              Les tarifs affichés sont des estimations indicatives et ne constituent pas des devis contractuels.
              <br /><br />
              BearsCheck n&apos;est pas immatriculé à l&apos;ORIAS en qualité d&apos;intermédiaire en assurance.
              Si vous souhaitez souscrire un contrat d&apos;assurance, vous serez redirigé directement vers l&apos;assureur concerné.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">4. Propriété intellectuelle</h2>
            <p className="text-[#6B7280]">
              L&apos;ensemble du contenu du site BearsCheck (textes, images, logos, graphismes) est la propriété exclusive de BearsCheck
              et est protégé par le droit d&apos;auteur. Toute reproduction sans autorisation est interdite.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-3">5. Liens hypertextes</h2>
            <p className="text-[#6B7280]">
              BearsCheck ne peut être tenu responsable des contenus des sites vers lesquels des liens sont proposés.
            </p>
          </section>

          <p className="text-xs text-[#9CA3AF] mt-8">Dernière mise à jour : mai 2026</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
