import { test, expect } from "@playwright/test";

test.describe("Tracking affilié", () => {
  test("le code affilié est enregistré dans le cookie quand ?ref= est présent", async ({ page }) => {
    await page.goto("/comparer?ref=BCK-GAR-TEST");

    const cookies = await page.context().cookies();
    const refCookie = cookies.find((c) => c.name === "bearscheck_ref");
    expect(refCookie).toBeDefined();
    expect(refCookie?.value).toBe("BCK-GAR-TEST");
  });

  test("le code affilié est visible dans l'URL encodée dans la barre de progression", async ({ page }) => {
    await page.goto("/comparer?ref=BCK-GAR-TEST");
    await expect(page.getByText(/Partenaire #/i)).toBeVisible();
  });

  test("sans ?ref=, aucun cookie bearscheck_ref n'est créé", async ({ page }) => {
    await page.goto("/comparer");
    await page.waitForTimeout(500);

    const cookies = await page.context().cookies();
    const refCookie = cookies.find((c) => c.name === "bearscheck_ref");
    expect(refCookie).toBeUndefined();
  });

  test("la page /comparer charge correctement avec un code affilié", async ({ page }) => {
    const response = await page.goto("/comparer?ref=BCK-GAR-DEMO");
    expect(response?.status()).toBe(200);
  });
});
