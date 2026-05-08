import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getProSession } from "@/lib/pro-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getProSession();
  if (!session) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  if (newPassword.length < 8) return NextResponse.json({ error: "Mot de passe trop court" }, { status: 400 });

  const company = await prisma.company.findUnique({ where: { email: session.email } });
  if (!company) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, company.password);
  if (!valid) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.company.update({ where: { id: company.id }, data: { password: hashed } });

  return NextResponse.json({ success: true });
}
