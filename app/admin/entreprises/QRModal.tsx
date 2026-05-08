"use client";

import { useState } from "react";
import { QrCode, Download, Copy, Check, X } from "lucide-react";

interface Props {
  companyId: string;
  raisonSociale: string;
}

export default function QRModal({ companyId, raisonSociale }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ dataUrl: string; affiliateUrl: string; affiliateCode: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function openModal() {
    setOpen(true);
    if (data) return;
    setLoading(true);
    const res = await fetch(`/api/admin/companies/${companyId}/qrcode`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  function download() {
    if (!data) return;
    const a = document.createElement("a");
    a.href = data.dataUrl;
    a.download = `qr-bearscheck-${data.affiliateCode}.png`;
    a.click();
  }

  async function copyLink() {
    if (!data) return;
    await navigator.clipboard.writeText(data.affiliateUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-[#F5E6C8] text-[#C9A84C] hover:bg-[#EDD9A3] transition-colors"
      >
        <QrCode className="h-3.5 w-3.5" />
        QR Code
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <p className="font-bold text-[#1A1A1A]">{raisonSociale}</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">QR code affilié</p>
            </div>

            {loading ? (
              <div className="h-48 w-48 flex items-center justify-center">
                <div className="h-8 w-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : data ? (
              <>
                <div className="p-3 bg-white rounded-xl border border-[#E5D8BC] shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.dataUrl} alt={`QR Code ${raisonSociale}`} width={200} height={200} />
                </div>

                <div className="w-full bg-[#F5E6C8] rounded-xl p-3 text-center">
                  <p className="text-[10px] text-[#9CA3AF] mb-1">Lien affilié</p>
                  <p className="text-xs font-mono text-[#C9A84C] break-all">{data.affiliateUrl}</p>
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={download}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-xl hover:bg-[#333] transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </button>
                  <button
                    onClick={copyLink}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#E5D8BC] text-[#6B7280] text-sm font-medium rounded-xl hover:bg-[#FAFAFA] transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copié !" : "Copier lien"}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
