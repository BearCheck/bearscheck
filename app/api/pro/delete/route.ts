import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getProSession } from "@/lib/pro-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const session = await getProSession();
  if (!session) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { password, confirmation } = await req.json();
  if (confirmation !== "SUPPRIMER") return NextResponse.json({ error: "Confirmation incorrecte" }, { status: 400 });
  if (!password) return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });

  const company = await prisma.company.findUnique({ where: { email: session.email } });
  if (!company) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });

  const valid = await bcrypt.compare(password, company.password);
  if (!valid) return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 400 });

  await prisma.company.delete({ where: { id: company.id } });

  const cookieStore = await cookies();
  cookieStore.delete("pro_token");

  return NextResponse.json({ success: true });
}
