import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

interface UpdateItem {
  id: string;
  ordre: number;
  statut: string;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { updates } = await req.json() as { updates: UpdateItem[] };
  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  await prisma.$transaction(
    updates.map((u) =>
      prisma.roadmapTask.update({
        where: { id: u.id },
        data: { ordre: u.ordre, statut: u.statut as TaskStatus },
      })
    )
  );

  return NextResponse.json({ success: true });
}
