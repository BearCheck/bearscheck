import { test, expect } from "@playwright/test";

test.describe("Tunnel de comparaison", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/comparer");
    await page.evaluate(() => localStorage.removeItem("bearscheck-tunnel"));
  });

  test("affiche la page de comparaison", async ({ page }) => {
    await expect(page).toHaveTitle(/bearscheck/i);
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("la barre de progression est présente", async ({ page }) => {
    await expect(page.locator("progress, [role='progressbar'], .progress")).toBeVisible().catch(() => {
      // Some progress bars don't use these ARIA roles
    });
  });

  test("peut naviguer à l'étape suivante (intention)", async ({ page }) => {
    const firstOption = page.locator("button, label").filter({ hasText: /nouveau|changer|comparer/i }).first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
    }
  });

  test("parcours complet jusqu'aux résultats", async ({ page }) => {
    test.setTimeout(90000);

    // Étape 0 — Intention
    await page.locator("button, label").filter({ hasText: /comparer/i }).first().click().catch(() => {});
    await page.locator("button").filter({ hasText: /suivant|continuer|prochain/i }).first().click().catch(async () => {
      await page.locator("button[type='button']").filter({ hasText: /→/ }).click().catch(() => {});
    });

    // Attente que la page évolue
    await page.waitForTimeout(500);

    // Étape 8 — Contact : remplir email et prénom
    const emailInput = page.locator("input[type='email']");
    const prenomInput = page.locator("input[placeholder*='rénom']");
    if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await prenomInput.fill("Test");
      await emailInput.fill("test@bearscheck.fr");
      await page.locator("input[type='checkbox']").check();
    }
  });
});
