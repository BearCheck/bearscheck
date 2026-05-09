import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Budget-Key",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const apiKey = process.env.BUDGET_API_KEY;
  if (apiKey && req.headers.get("X-Budget-Key") === apiKey) return true;
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function GET(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401, headers: corsHeaders() });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    totalComparisons,
    monthComparisons,
    totalConversions,
    monthConversions,
    activeCompanies,
    totalUsers,
    monthUsers,
    totalCommissionsPaid,
    totalCommissionsPending,
    recentComparisons,
    monthlyCommissions,
  ] = await Promise.all([
    prisma.comparison.count(),
    prisma.comparison.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.comparison.count({ where: { converted: true } }),
    prisma.comparison.count({ where: { converted: true, createdAt: { gte: startOfMonth } } }),
    prisma.company.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.commission.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    prisma.commission.aggregate({ where: { status: "PENDING" }, _sum: { amount: true } }),
    prisma.comparison.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, createdAt: true, affiliateCode: true, converted: true, userId: true },
    }),
    // Commissions groupées par mois sur 6 mois
    prisma.commission.findMany({
      where: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } },
      select: { amount: true, status: true, createdAt: true },
    }),
  ]);

  // Comparaisons par mois sur 6 mois
  const comparaisonsByMonth: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    comparaisonsByMonth[key] = await prisma.comparison.count({
      where: {
        createdAt: {
          gte: new Date(d.getFullYear(), d.getMonth(), 1),
          lt: new Date(d.getFullYear(), d.getMonth() + 1, 1),
        },
      },
    });
  }

  // Commissions par mois sur 6 mois
  const commissionsByMonth: Record<string, number> = {};
  monthlyCommissions.forEach((c) => {
    const key = `${c.createdAt.getFullYear()}-${String(c.createdAt.getMonth() + 1).padStart(2, "0")}`;
    commissionsByMonth[key] = (commissionsByMonth[key] || 0) + c.amount;
  });

  return NextResponse.json(
    {
      comparisons: {
        total: totalComparisons,
        month: monthComparisons,
        conversions: totalConversions,
        conversionsMonth: monthConversions,
        conversionRate: totalComparisons > 0 ? ((totalConversions / totalComparisons) * 100).toFixed(1) : "0.0",
        byMonth: comparaisonsByMonth,
        recent: recentComparisons.map((c) => ({
          id: c.id,
          date: c.createdAt.toISOString(),
          affiliateCode: c.affiliateCode,
          converted: c.converted,
          hasUser: !!c.userId,
        })),
      },
      companies: {
        active: activeCompanies,
      },
      users: {
        total: totalUsers,
        month: monthUsers,
      },
      commissions: {
        totalPaid: totalCommissionsPaid._sum.amount ?? 0,
        totalPending: totalCommissionsPending._sum.amount ?? 0,
        byMonth: commissionsByMonth,
      },
    },
    { headers: corsHeaders() }
  );
}
