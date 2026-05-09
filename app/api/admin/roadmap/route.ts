import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TaskStatus, Priority } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const tasks = await prisma.roadmapTask.findMany({
    where: { parentId: null },
    include: { sousTaches: true },
    orderBy: [{ ordre: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const body = await req.json() as {
    titre: string; description?: string; priorite?: string; statut?: string;
    dateDebut?: string; dateFin?: string; dureeEstimee?: number; tags?: string[]; parentId?: string;
  };
  if (!body.titre) {
    return NextResponse.json({ error: "Titre obligatoire" }, { status: 400 });
  }
  const maxOrdre = await prisma.roadmapTask.aggregate({ _max: { ordre: true } });
  const task = await prisma.roadmapTask.create({
    data: {
      titre: body.titre,
      description: body.description,
      priorite: (body.priorite as Priority) ?? "MOYENNE",
      statut: (body.statut as TaskStatus) ?? "A_FAIRE",
      dateDebut: body.dateDebut ? new Date(body.dateDebut) : undefined,
      dateFin: body.dateFin ? new Date(body.dateFin) : undefined,
      dureeEstimee: body.dureeEstimee,
      tags: body.tags ?? [],
      parentId: body.parentId,
      ordre: (maxOrdre._max.ordre ?? 0) + 1,
    },
  });
  return NextResponse.json(task, { status: 201 });
}
