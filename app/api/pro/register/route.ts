import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

function generateAffiliateCode(raisonSociale: string): string {
  const prefix = raisonSociale.replace(/\s+/g, "").toUpperCase().slice(0, 4);
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${suffix}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      raisonSociale,
      siret,
      email,
      telephone,
      adresse,
      nomResponsable,
      prenomResponsable,
      password,
    } = body as {
      raisonSociale: string;
      siret: string;
      email: string;
      telephone?: string;
      adresse?: string;
      nomResponsable?: string;
      prenomResponsable?: string;
      password: string;
    };

    if (!raisonSociale || !siret || !email || !password) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    if (!/^\d{14}$/.test(siret)) {
      return NextResponse.json(
        { error: "Le SIRET doit contenir 14 chiffres" },
        { status: 400 }
      );
    }

    const existing = await prisma.company.findFirst({
      where: { OR: [{ email }, { siret }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email ou ce SIRET" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const affiliateCode = generateAffiliateCode(raisonSociale);
    const fullName = [prenomResponsable, nomResponsable].filter(Boolean).join(" ");

    await prisma.company.create({
      data: {
        raisonSociale,
        siret,
        email,
        telephone: telephone ?? null,
        adresse: adresse ?? null,
        nomResponsable: fullName || null,
        password: hashed,
        affiliateCode,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { success: true, message: "Demande envoyée. Validation sous 24-48h." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
