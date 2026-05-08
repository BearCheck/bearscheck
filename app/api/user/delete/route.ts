import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { password, confirmation } = await req.json();
  if (confirmation !== "SUPPRIMER") {
    return NextResponse.json({ error: "Confirmation incorrecte" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });

  if (user.password) {
    if (!password) return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 400 });
  }

  // Anonymise les comparaisons puis supprime le compte
  await prisma.comparison.updateMany({ where: { userId: user.id }, data: { userId: null } });
  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ success: true });
}
