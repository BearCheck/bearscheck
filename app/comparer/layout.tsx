import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparer mon assurance auto — Devis gratuit en 2 min",
  description:
    "Obtenez votre devis d'assurance auto en 2 minutes. Comparez les offres de Direct Assurance, MAIF, AXA, Allianz, Groupama et plus. Gratuit, sans engagement.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/comparer" },
  openGraph: {
    title: "Comparer mon assurance auto — Devis gratuit en 2 min",
    description:
      "Comparez les meilleures offres d'assurance auto en France. Résultats immédiats, 100% gratuit.",
    type: "website",
  },
};

export default function ComparerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
