import { prisma } from "./prisma";

export async function recordAffiliateEvent(
  affiliateCode: string,
  type: "SCAN" | "COMPARISON" | "CONVERSION_INTENT",
  ipHash?: string,
  userAgent?: string
) {
  try {
    const company = await prisma.company.findUnique({
      where: { affiliateCode },
      select: { id: true, status: true },
    });
    if (!company || company.status !== "ACTIVE") return null;
    return await prisma.affiliateEvent.create({
      data: { companyId: company.id, type, ipHash, userAgent },
    });
  } catch {
    return null;
  }
}

export async function recordConversion(affiliateCode: string, description?: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { affiliateCode },
      select: { id: true, status: true, commissionRate: true },
    });
    if (!company || company.status !== "ACTIVE") return null;
    const amount = company.commissionRate > 0 ? company.commissionRate : 10;
    return await prisma.commission.create({
      data: {
        companyId: company.id,
        amount,
        description: description ?? "Commission affiliation BearsCheck",
      },
    });
  } catch {
    return null;
  }
}
