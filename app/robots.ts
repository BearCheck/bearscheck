import type { MetadataRoute } from "next";

const BASE_URL = process.env.AUTH_URL ?? "https://bearscheck.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/comparer", "/comment-ca-marche", "/assureurs", "/connexion", "/cgu", "/mentions-legales", "/politique-confidentialite"],
        disallow: ["/admin", "/dashboard", "/pro/dashboard", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
