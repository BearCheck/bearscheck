import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ExpenseCategory, ExpenseType } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const expenses = await prisma.expense.findMany({ orderBy: { dateDepense: "desc" } });
  return NextResponse.json(expenses);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const body = await req.json() as {
    titre: string; montant: number; categorie: string; type: string;
    recurrent?: boolean; dateDepense: string; description?: string;
  };
  if (!body.titre || !body.montant || !body.categorie || !body.type || !body.dateDepense) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }
  const expense = await prisma.expense.create({
    data: {
      titre: body.titre,
      montant: Number(body.montant),
      categorie: body.categorie as ExpenseCategory,
      type: body.type as ExpenseType,
      recurrent: body.recurrent ?? false,
      dateDepense: new Date(body.dateDepense),
      description: body.description,
    },
  });
  return NextResponse.json(expense, { status: 201 });
}
