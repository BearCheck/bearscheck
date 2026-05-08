import Link from "next/link";
import BearLogo from "@/components/ui/BearLogo";

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] border-t border-[#E5D8BC] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <BearLogo showTagline />
            <p className="mt-3 text-xs text-[#6B7280] leading-relaxed">
              BearsCheck est un comparateur d&apos;information indépendant. Nous ne sommes pas un assureur.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Comparer</h4>
            <ul className="space-y-2">
              {[
                { href: "/comparer", label: "Assurance auto" },
                { href: "/comment-ca-marche", label: "Comment ça marche" },
                { href: "/assureurs", label: "Nos partenaires" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[#6B7280] hover:text-[#C9A84C] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Professionnels</h4>
            <ul className="space-y-2">
              {[
                { href: "/pro/inscription", label: "Devenir partenaire" },
                { href: "/pro/connexion", label: "Espace pro" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[#6B7280] hover:text-[#C9A84C] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Légal</h4>
            <ul className="space-y-2">
              {[
                { href: "/mentions-legales", label: "Mentions légales" },
                { href: "/politique-confidentialite", label: "Politique de confidentialité" },
                { href: "/cgu", label: "CGU" },
                { href: "/cgv", label: "CGV" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[#6B7280] hover:text-[#C9A84C] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E5D8BC] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#9CA3AF]">
            © {new Date().getFullYear()} BearsCheck. Tous droits réservés.
          </p>
          <p className="text-xs text-[#9CA3AF] text-center">
            Les tarifs affichés sont des estimations indicatives — pas des devis contractuels.
          </p>
        </div>
      </div>
    </footer>
  );
}
