import { NextRequest, NextResponse } from "next/server";
import { getProSession } from "@/lib/pro-auth";
import { prisma } from "@/lib/prisma";
import { rateLimiters, getIP, applyRateLimit } from "@/lib/rate-limit";
import { proProfileSchema } from "@/lib/validations";

export async function PATCH(req: NextRequest) {
  const session = await getProSession();
  if (!session) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const ip = getIP(req);
  const limited = await applyRateLimit(rateLimiters.general, ip);
  if (limited) return limited;

  const body = await req.json();
  const parsed = proProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { raisonSociale, telephone, adresse, nomResponsable, ribIban } = parsed.data;

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
