"use client";

import { useState, useEffect } from "react";
import { Cookie, X, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface Prefs { analytics: boolean; affiliate: boolean }

const CATEGORIES = [
  {
    id: "necessary" as const,
    label: "Nécessaires",
    description: "Sessions de connexion, sécurité, fonctionnement du tunnel de comparaison. Ces cookies sont indispensables au site.",
    always: true,
  },
  {
    id: "analytics" as const,
    label: "Analytiques",
    description: "Statistiques de visite anonymisées (pages consultées, durée). Nous aident à améliorer le site. Aucune donnée personnelle transmise.",
    always: false,
  },
  {
    id: "affiliate" as const,
    label: "Affiliation & partenaires",
    description: "Suivi des liens et QR codes de nos partenaires professionnels. Permet d'attribuer les visites à nos partenaires locaux.",
    always: false,
  },
];

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${checked ? "bg-[#C9A84C]" : "bg-[#CBD5E1]"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ analytics: true, affiliate: true });
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bc-cookie-consent");
      if (!saved) setTimeout(() => setShow(true), 600);
    } catch {}
  }, []);

  function save(p: Prefs) {
    try { localStorage.setItem("bc-cookie-consent", JSON.stringify({ ...p, decided: true, date: new Date().toISOString() })); } catch {}
    setShow(false);
    setShowModal(false);
  }

  if (!show) return null;

  return (
    <>
      {/* Modal overlay */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
          onClick={() => setShowModal(false)}
          aria-hidden="true"
        />
      )}

      {/* Preferences modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gestion des cookies"
          className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-[100] bg-white rounded-2xl shadow-2xl border border-[#E5D8BC] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5D8BC]">
            <div className="flex items-center gap-2.5">
              <Cookie className="h-5 w-5 text-[#C9A84C]" />
              <h2 className="font-bold text-[#1A1A1A]">Gestion des cookies</h2>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#1A1A1A] hover:bg-[#F1F5F9] transition-colors"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
              Nous utilisons des cookies pour faire fonctionner le site et améliorer votre expérience.
              Configurez vos préférences ci-dessous.{" "}
              <Link href="/politique-confidentialite" className="text-[#C9A84C] hover:underline" target="_blank" rel="noopener noreferrer">
                Politique de confidentialité
              </Link>
            </p>

            <div className="flex flex-col gap-3">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="border border-[#E5D8BC] rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-[#FAFAFA]">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A] flex-1 text-left"
                      onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                      aria-expanded={expanded === cat.id}
                    >
                      {expanded === cat.id
                        ? <ChevronUp className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0" />
                        : <ChevronDown className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0" />
                      }
                      {cat.label}
                      {cat.always && (
                        <span className="ml-1 text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                          Toujours actif
                        </span>
                      )}
                    </button>
                    <Toggle
                      checked={cat.always ? true : prefs[cat.id as keyof Prefs]}
                      onChange={(v) => setPrefs((p) => ({ ...p, [cat.id]: v }))}
                      disabled={cat.always}
                    />
                  </div>
                  {expanded === cat.id && (
                    <div className="px-4 pb-3 pt-1">
                      <p className="text-xs text-[#6B7280] leading-relaxed">{cat.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-2 px-6 py-4 border-t border-[#E5D8BC] bg-[#FAFAFA]">
            <button
              onClick={() => save({ analytics: true, affiliate: true })}
              className="flex-1 py-2.5 px-4 bg-[#C9A84C] text-white text-sm font-semibold rounded-xl hover:bg-[#b8943f] transition-colors"
            >
              Tout accepter
            </button>
            <button
              onClick={() => save(prefs)}
              className="flex-1 py-2.5 px-4 border border-[#C9A84C] text-[#C9A84C] text-sm font-semibold rounded-xl hover:bg-[#F5E6C8] transition-colors"
            >
              Enregistrer mes choix
            </button>
          </div>
        </div>
      )}

      {/* Bottom banner */}
      {!showModal && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[50] bg-white rounded-2xl shadow-2xl border border-[#E5D8BC] p-5 animate-slide-up">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-[#F5E6C8] flex items-center justify-center shrink-0 mt-0.5">
              <Cookie className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="font-semibold text-[#1A1A1A] text-sm mb-1">Nous utilisons des cookies</p>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Des cookies nécessaires, analytiques et d&apos;affiliation sont utilisés pour améliorer votre expérience et mesurer notre audience.{" "}
                <Link href="/politique-confidentialite" className="text-[#C9A84C] hover:underline" target="_blank" rel="noopener noreferrer">
                  En savoir plus
                </Link>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => save({ analytics: true, affiliate: true })}
              className="flex-1 py-2.5 px-4 bg-[#C9A84C] text-white text-sm font-semibold rounded-xl hover:bg-[#b8943f] transition-colors"
            >
              Tout accepter
            </button>
            <button
              onClick={() => save({ analytics: false, affiliate: false })}
              className="flex-1 py-2.5 px-4 border border-[#E5D8BC] text-[#6B7280] text-sm font-medium rounded-xl hover:bg-[#F8FAFC] transition-colors"
            >
              Tout refuser
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 py-2.5 px-4 border border-[#C9A84C] text-[#C9A84C] text-sm font-medium rounded-xl hover:bg-[#F5E6C8] transition-colors"
            >
              Personnaliser
            </button>
          </div>

          <div className="flex items-center gap-1.5 mt-3 justify-center">
            <ShieldCheck className="h-3 w-3 text-[#9CA3AF]" />
            <p className="text-[10px] text-[#9CA3AF]">Conforme RGPD · BearsCheck · Paul PACKE EI</p>
          </div>
        </div>
      )}
    </>
  );
}
