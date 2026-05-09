import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const revenues = await prisma.revenue.findMany({ orderBy: { dateRevenu: "desc" } });
  return NextResponse.json(revenues);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const body = await req.json() as {
    titre: string; montant: number; source: string; dateRevenu: string; description?: string;
  };
  if (!body.titre || !body.montant || !body.source || !body.dateRevenu) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }
  const revenue = await prisma.revenue.create({
    data: {
      titre: body.titre,
      montant: Number(body.montant),
      source: body.source,
      dateRevenu: new Date(body.dateRevenu),
      description: body.description,
    },
  });
  return NextResponse.json(revenue, { status: 201 });
}
