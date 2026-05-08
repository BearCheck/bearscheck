import { NextRequest, NextResponse } from "next/server";
import { getProSession } from "@/lib/pro-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getProSession();
  if (!session) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { raisonSociale, telephone, adresse, nomResponsable, ribIban } = await req.json();

  await prisma.company.update({
    where: { email: session.email },
    data: {
      ...(raisonSociale?.trim() && { raisonSociale: raisonSociale.trim() }),
      ...(telephone !== undefined && { telephone: telephone || null }),
      ...(adresse !== undefined && { adresse: adresse || null }),
      ...(nomResponsable !== undefined && { nomResponsable: nomResponsable || null }),
      ...(ribIban !== undefined && { ribIban: ribIban || null }),
    },
  });

  return NextResponse.json({ success: true });
}
