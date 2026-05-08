import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { randomBytes } from "crypto";
import { rateLimiters, getIP, applyRateLimit } from "@/lib/rate-limit";
import { proRegisterSchema } from "@/lib/validations";
import { logSecurityEvent } from "@/lib/security-logs";

function generateAffiliateCode(raisonSociale: string): string {
  const prefix = raisonSociale.replace(/\s+/g, "").toUpperCase().slice(0, 4);
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${suffix}`;
}

export async function POST(req: Request) {
  const ip = getIP(req);
  const limited = await applyRateLimit(rateLimiters.inscription, ip);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = proRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const {
      raisonSociale,
      siret,
      email,
      telephone,
      adresse,
      nomResponsable,
      prenomResponsable,
      password,
    } = parsed.data;

    const existing = await prisma.company.findFirst({
      where: { OR: [{ email }, { siret }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email ou ce SIRET" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);
    const affiliateCode = generateAffiliateCode(raisonSociale);
    const fullName = [prenomResponsable, nomResponsable].filter(Boolean).join(" ");

    const company = await prisma.company.create({
      data: {
        raisonSociale,
        siret,
        email,
        telephone: telephone || null,
        adresse: adresse || null,
        nomResponsable: fullName || null,
        password: hashed,
        affiliateCode,
        status: "PENDING",
      },
    });

    await logSecurityEvent("ACCOUNT_CREATED", { ip, metadata: { type: "pro", companyId: company.id } });

    return NextResponse.json(
      { success: true, message: "Demande envoyée. Validation sous 24-48h." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
