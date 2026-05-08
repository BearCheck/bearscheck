import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json() as { status: string };

  const valid = ["ACTIVE", "PENDING", "SUSPENDED"];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  try {
    const company = await prisma.company.update({
      where: { id },
      data: { status: status as "ACTIVE" | "PENDING" | "SUSPENDED" },
    });
    return NextResponse.json({ success: true, status: company.status });
  } catch {
    return NextResponse.json({ error: "Entreprise introuvable" }, { status: 404 });
  }
}
