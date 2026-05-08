import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const BASE_URL = process.env.AUTH_URL ?? "https://bearscheck.fr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "BearsCheck — Comparateur d'assurance auto",
    template: "%s | BearsCheck",
  },
  description:
    "Comparez les meilleures assurances auto en France en 2 minutes. Trouvez la couverture idéale au meilleur prix parmi Direct Assurance, MAIF, AXA, Allianz et plus.",
  keywords: [
    "assurance auto",
    "comparateur assurance auto",
    "devis assurance voiture",
    "assurance auto pas cher",
    "meilleure assurance auto France",
    "tous risques pas cher",
  ],
  authors: [{ name: "BearsCheck", url: BASE_URL }],
  creator: "BearsCheck",
  publisher: "BearsCheck",
  formatDetection: { email: false, telephone: false },
  alternates: { canonical: BASE_URL, languages: { "fr-FR": BASE_URL } },
  openGraph: {
    title: "BearsCheck — Comparateur d'assurance auto",
    description:
      "Comparez les meilleures assurances auto en France en 2 minutes. Gratuit, sans engagement.",
    type: "website",
    locale: "fr_FR",
    siteName: "BearsCheck",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "BearsCheck — Comparateur d'assurance auto",
    description: "Comparez les meilleures assurances auto en France en 2 minutes.",
    site: "@bearscheck",
    creator: "@bearscheck",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${syne.variable} ${inter.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
