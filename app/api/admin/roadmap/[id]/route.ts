import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus, Priority } from "@prisma/client";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json() as {
    titre?: string; description?: string; priorite?: string; statut?: string;
    dateDebut?: string; dateFin?: string; dureeEstimee?: number;
    progression?: number; tags?: string[];
  };
  try {
    const task = await prisma.roadmapTask.update({
      where: { id },
      data: {
        ...(body.titre && { titre: body.titre }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.priorite && { priorite: body.priorite as Priority }),
        ...(body.statut && { statut: body.statut as TaskStatus }),
        ...(body.dateDebut !== undefined && { dateDebut: body.dateDebut ? new Date(body.dateDebut) : null }),
        ...(body.dateFin !== undefined && { dateFin: body.dateFin ? new Date(body.dateFin) : null }),
        ...(body.dureeEstimee !== undefined && { dureeEstimee: body.dureeEstimee }),
        ...(body.progression !== undefined && { progression: body.progression }),
        ...(body.tags && { tags: body.tags }),
      },
    });
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await prisma.roadmapTask.deleteMany({ where: { parentId: id } });
    await prisma.roadmapTask.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Tâche introuvable" }, { status: 404 });
  }
}
