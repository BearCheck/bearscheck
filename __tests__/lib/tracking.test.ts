import { recordAffiliateEvent, recordConversion } from "@/lib/tracking";

const mockFindUnique = jest.fn();
const mockCreateEvent = jest.fn();
const mockCreateCommission = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    company: { findUnique: (...args: unknown[]) => mockFindUnique(...args) },
    affiliateEvent: { create: (...args: unknown[]) => mockCreateEvent(...args) },
    commission: { create: (...args: unknown[]) => mockCreateCommission(...args) },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("recordAffiliateEvent", () => {
  it("retourne null si l'entreprise est introuvable", async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await recordAffiliateEvent("CODE-INCONNU", "COMPARISON");
    expect(result).toBeNull();
    expect(mockCreateEvent).not.toHaveBeenCalled();
  });

  it("retourne null si l'entreprise est SUSPENDED", async () => {
    mockFindUnique.mockResolvedValue({ id: "c1", status: "SUSPENDED" });
    const result = await recordAffiliateEvent("CODE", "SCAN");
    expect(result).toBeNull();
    expect(mockCreateEvent).not.toHaveBeenCalled();
  });

  it("retourne null si l'entreprise est PENDING", async () => {
    mockFindUnique.mockResolvedValue({ id: "c1", status: "PENDING" });
    const result = await recordAffiliateEvent("CODE", "SCAN");
    expect(result).toBeNull();
  });

  it("crée l'événement pour une entreprise ACTIVE", async () => {
    mockFindUnique.mockResolvedValue({ id: "c1", status: "ACTIVE" });
    mockCreateEvent.mockResolvedValue({ id: "ev1" });
    const result = await recordAffiliateEvent("CODE", "COMPARISON", "abc123", "Mozilla/5.0");
    expect(mockCreateEvent).toHaveBeenCalledWith({
      data: { companyId: "c1", type: "COMPARISON", ipHash: "abc123", userAgent: "Mozilla/5.0" },
    });
    expect(result).toEqual({ id: "ev1" });
  });

  it("retourne null si prisma lève une exception", async () => {
    mockFindUnique.mockRejectedValue(new Error("DB error"));
    const result = await recordAffiliateEvent("CODE", "SCAN");
    expect(result).toBeNull();
  });
});

describe("recordConversion", () => {
  it("retourne null si l'entreprise est introuvable", async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await recordConversion("CODE-INCONNU");
    expect(result).toBeNull();
    expect(mockCreateCommission).not.toHaveBeenCalled();
  });

  it("utilise commissionRate si défini", async () => {
    mockFindUnique.mockResolvedValue({ id: "c1", status: "ACTIVE", commissionRate: 25 });
    mockCreateCommission.mockResolvedValue({ id: "comm1", amount: 25 });
    await recordConversion("CODE");
    expect(mockCreateCommission).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ amount: 25 }) })
    );
  });

  it("utilise 10€ par défaut si commissionRate est 0", async () => {
    mockFindUnique.mockResolvedValue({ id: "c1", status: "ACTIVE", commissionRate: 0 });
    mockCreateCommission.mockResolvedValue({ id: "comm1", amount: 10 });
    await recordConversion("CODE");
    expect(mockCreateCommission).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ amount: 10 }) })
    );
  });

  it("utilise la description personnalisée si fournie", async () => {
    mockFindUnique.mockResolvedValue({ id: "c1", status: "ACTIVE", commissionRate: 15 });
    mockCreateCommission.mockResolvedValue({ id: "comm1" });
    await recordConversion("CODE", "Souscription AXA — Tous Risques");
    expect(mockCreateCommission).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ description: "Souscription AXA — Tous Risques" }),
      })
    );
  });

  it("retourne null si prisma lève une exception", async () => {
    mockFindUnique.mockRejectedValue(new Error("DB error"));
    const result = await recordConversion("CODE");
    expect(result).toBeNull();
  });
});
