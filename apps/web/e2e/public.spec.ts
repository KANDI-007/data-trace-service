import { expect, test } from "@playwright/test";

test("accueil affiche le message principal sans défilement horizontal", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("à distance");
  await expect(page.getByRole("link", { name: "Demander mon diagnostic gratuit" }).first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBeFalsy();
});

test("le diagnostic signale un nom manquant et un numéro trop court", async ({ page }) => {
  await page.goto("/diagnostic-gratuit/demande");
  await page.getByLabel("Téléphone / WhatsApp").fill("+228 9");
  await page.getByRole("button", { name: "Demander mon diagnostic gratuit" }).click();
  await expect(page.getByText("Indiquez votre nom et prénoms.")).toBeVisible();
  await expect(page.getByText("Numéro trop court.")).toBeVisible();
});

test("une adresse inconnue propose le retour à l’accueil", async ({ page }) => {
  await page.goto("/page-inconnue");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("n’existe pas");
  await expect(page.getByRole("link", { name: "Retour à l’accueil" })).toBeVisible();
});
