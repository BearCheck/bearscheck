"use client";

import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  dataUrl: string;
  affiliateCode: string;
  affiliateUrl: string;
}

export default function QRCodeClient({ dataUrl, affiliateCode, affiliateUrl }: Props) {
  const [copied, setCopied] = useState(false);

  function downloadQR() {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `bearscheck-qr-${affiliateCode}.png`;
    a.click();
  }

  async function copyLink() {
    await navigator.clipboard.writeText(affiliateUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* QR Code image */}
      <div className="p-4 bg-white rounded-2xl shadow-md border border-[#E5D8BC] inline-flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUrl} alt={`QR Code BearsCheck ${affiliateCode}`} width={240} height={240} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Button size="md" onClick={downloadQR} className="gap-2">
          <Download className="h-4 w-4" />
          Télécharger PNG
        </Button>
        <Button size="md" variant="outline" onClick={copyLink} className="gap-2">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copié !" : "Copier le lien"}
        </Button>
      </div>

      {/* URL display */}
      <div className="w-full max-w-sm bg-[#F5E6C8] rounded-xl p-3 text-center">
        <p className="text-xs text-[#9CA3AF] mb-1">Lien encodé dans le QR</p>
        <p className="text-xs font-mono text-[#C9A84C] break-all">{affiliateUrl}</p>
      </div>
    </div>
  );
}
