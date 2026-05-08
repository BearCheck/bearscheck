import { getProSession } from "@/lib/pro-auth";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import QRCodeClient from "@/components/pro/QRCodeClient";
import { Card } from "@/components/ui/Card";
import { Printer, Share2, Info } from "lucide-react";

async function generateQR(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: "#1A1A1A", light: "#FFFFFF" },
    errorCorrectionLevel: "H",
  });
}

export default async function QRCodePage() {
  const session = await getProSession();
  if (!session) redirect("/pro/connexion");

  const affiliateUrl = `${process.env.AUTH_URL ?? "http://localhost:3000"}/comparer?ref=${session.affiliateCode}`;
  const dataUrl = await generateQR(affiliateUrl);

  const TIPS = [
    "Imprimez le QR code en A5 minimum pour une meilleure lisibilité.",
    "Placez-le à la caisse, dans la salle d'attente ou sur vos devis.",
    "Chaque scan est enregistré et visible dans votre tableau de bord.",
    "Partagez aussi le lien par SMS ou email à vos clients.",
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Mon QR Code</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Téléchargez et affichez votre QR code pour que vos clients le scannent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code */}
        <Card className="flex flex-col items-center gap-6 py-8">
          <div className="text-center mb-2">
            <p className="font-bold text-[#1A1A1A] text-lg">{session.raisonSociale}</p>
            <p className="text-sm text-[#9CA3AF]">Scannez pour comparer vos assurances</p>
          </div>

          <QRCodeClient
            dataUrl={dataUrl}
            affiliateCode={session.affiliateCode}
            affiliateUrl={affiliateUrl}
          />

          <div className="flex items-center gap-4 text-xs text-[#9CA3AF] pt-2 border-t border-[#F0E8D6] w-full justify-center">
            <span className="flex items-center gap-1"><Printer className="h-3.5 w-3.5" /> Imprimable</span>
            <span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> Partageable</span>
          </div>
        </Card>

        {/* Tips + code */}
        <div className="flex flex-col gap-5">
          {/* Affiliate code */}
          <Card>
            <h2 className="font-bold text-[#1A1A1A] mb-3">Votre code affilié</h2>
            <div className="flex items-center gap-3">
              <code className="bg-[#F5E6C8] text-[#C9A84C] font-bold px-5 py-3 rounded-xl text-2xl tracking-widest">
                {session.affiliateCode}
              </code>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-2">
              Ce code identifie toutes les comparaisons issues de votre QR ou lien.
            </p>
          </Card>

          {/* Tips */}
          <Card>
            <h2 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-[#C9A84C]" />
              Comment bien utiliser votre QR code
            </h2>
            <ul className="flex flex-col gap-3">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#6B7280]">
                  <span className="h-5 w-5 rounded-full bg-[#F5E6C8] text-[#C9A84C] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>

          {/* Stats preview */}
          <Card className="bg-[#0F172A] border-[#0F172A]">
            <p className="text-[#64748B] text-xs font-medium uppercase tracking-wide mb-2">Rappel</p>
            <p className="text-white text-sm">
              Chaque client qui scanne votre QR et souscrit une assurance via BearsCheck vous génère une commission.
            </p>
            <p className="text-[#C9A84C] text-xs mt-2 font-medium">Taux de commission défini par BearsCheck →</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
