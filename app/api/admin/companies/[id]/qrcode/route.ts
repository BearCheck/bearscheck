import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const company = await prisma.company.findUnique({
    where: { id },
    select: { affiliateCode: true, raisonSociale: true },
  });

  if (!company) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const baseUrl = process.env.AUTH_URL ?? "https://bearscheck.fr";
  const affiliateUrl = `${baseUrl}/comparer?ref=${company.affiliateCode}`;

  const dataUrl = await QRCode.toDataURL(affiliateUrl, {
    width: 400,
    margin: 2,
    color: { dark: "#1A1A1A", light: "#FFFFFF" },
    errorCorrectionLevel: "H",
  });

  // Renvoie le PNG en base64 + l'URL affilié
  return NextResponse.json({ dataUrl, affiliateUrl, raisonSociale: company.raisonSociale, affiliateCode: company.affiliateCode });
}
