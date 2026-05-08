"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import BearLogo from "@/components/ui/BearLogo";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5D8BC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Accueil BearsCheck">
          <BearLogo size="sm" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Navigation principale">
          <Link href="/comment-ca-marche" className="text-sm text-[#6B7280] hover:text-[#C9A84C] transition-colors">
            Comment ça marche
          </Link>
          <Link href="/assureurs" className="text-sm text-[#6B7280] hover:text-[#C9A84C] transition-colors">
            Nos assureurs
          </Link>
          <Link href="/pro/inscription" className="text-sm text-[#6B7280] hover:text-[#C9A84C] transition-colors">
            Espace pro
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Mon compte</Button>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/connexion">
                <Button variant="outline" size="sm">Se connecter</Button>
              </Link>
              <Link href="/comparer">
                <Button size="sm">Comparer →</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-[#6B7280] hover:bg-[#FAFAFA]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Menu de navigation"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E5D8BC] bg-white px-4 pb-4">
          <nav className="flex flex-col gap-3 pt-4" aria-label="Navigation mobile">
            <Link href="/comment-ca-marche" className="text-sm text-[#6B7280] py-1" onClick={() => setMenuOpen(false)}>Comment ça marche</Link>
            <Link href="/assureurs" className="text-sm text-[#6B7280] py-1" onClick={() => setMenuOpen(false)}>Nos assureurs</Link>
            <Link href="/pro/inscription" className="text-sm text-[#6B7280] py-1" onClick={() => setMenuOpen(false)}>Espace pro</Link>
            {session ? (
              <>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600">Admin</Button>
                  </Link>
                )}
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Mon compte</Button>
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="text-sm text-[#9CA3AF] py-1 text-left"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/connexion" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Se connecter</Button>
                </Link>
                <Link href="/comparer" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full">Comparer →</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
