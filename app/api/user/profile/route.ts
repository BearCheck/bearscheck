import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Nom invalide" }, { status: 400 });

  await prisma.user.update({
    where: { email: session.user.email },
    data: { name: name.trim() },
  });

  return NextResponse.json({ success: true });
}
