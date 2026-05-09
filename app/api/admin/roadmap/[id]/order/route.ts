import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json() as { ordre?: number; statut?: string };
  try {
    const task = await prisma.roadmapTask.update({
      where: { id },
      data: {
        ...(body.ordre !== undefined && { ordre: body.ordre }),
        ...(body.statut && { statut: body.statut as TaskStatus }),
      },
    });
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
  }
}
