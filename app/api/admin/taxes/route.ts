import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TaxStatus } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const declarations = await prisma.taxDeclaration.findMany({ orderBy: [{ annee: "desc" }, { trimestre: "desc" }] });
  return NextResponse.json(declarations);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const body = await req.json() as {
    trimestre: number; annee: number; chiffreAffaires: number;
    dateLimite: string; datePaiement?: string; statut?: string;
  };
  const TAUX = 0.214;
  const cotisations = body.chiffreAffaires * TAUX;
  const decl = await prisma.taxDeclaration.upsert({
    where: { trimestre_annee: { trimestre: body.trimestre, annee: body.annee } } as never,
    update: {
      chiffreAffaires: body.chiffreAffaires,
      cotisations,
      ...(body.datePaiement && { datePaiement: new Date(body.datePaiement) }),
      ...(body.statut && { statut: body.statut as TaxStatus }),
    },
    create: {
      trimestre: body.trimestre,
      annee: body.annee,
      chiffreAffaires: body.chiffreAffaires,
      cotisations,
      dateLimite: new Date(body.dateLimite),
      ...(body.datePaiement && { datePaiement: new Date(body.datePaiement) }),
      statut: (body.statut as TaxStatus) ?? "A_PAYER",
    },
  });
  return NextResponse.json(decl, { status: 201 });
}
