import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json() as {
    titre?: string; montant?: number; source?: string; dateRevenu?: string; description?: string;
  };
  try {
    const revenue = await prisma.revenue.update({
      where: { id },
      data: {
        ...(body.titre && { titre: body.titre }),
        ...(body.montant !== undefined && { montant: Number(body.montant) }),
        ...(body.source && { source: body.source }),
        ...(body.dateRevenu && { dateRevenu: new Date(body.dateRevenu) }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });
    return NextResponse.json(revenue);
  } catch {
    return NextResponse.json({ error: "Revenu introuvable" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await prisma.revenue.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Revenu introuvable" }, { status: 404 });
  }
}
