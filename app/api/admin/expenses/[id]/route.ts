import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ExpenseCategory, ExpenseType } from "@prisma/client";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json() as {
    titre?: string; montant?: number; categorie?: string; type?: string;
    recurrent?: boolean; dateDepense?: string; description?: string;
  };
  try {
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(body.titre && { titre: body.titre }),
        ...(body.montant !== undefined && { montant: Number(body.montant) }),
        ...(body.categorie && { categorie: body.categorie as ExpenseCategory }),
        ...(body.type && { type: body.type as ExpenseType }),
        ...(body.recurrent !== undefined && { recurrent: body.recurrent }),
        ...(body.dateDepense && { dateDepense: new Date(body.dateDepense) }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });
    return NextResponse.json(expense);
  } catch {
    return NextResponse.json({ error: "Dépense introuvable" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await prisma.expense.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Dépense introuvable" }, { status: 404 });
  }
}
