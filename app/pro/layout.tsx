import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace partenaire",
  description: "Tableau de bord partenaire BearsCheck.",
  robots: { index: false, follow: false },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
