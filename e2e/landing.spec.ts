import { test, expect } from "@playwright/test";

test("landing renders title and click hint", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/MY PROLOGUE/i)).toBeVisible();
  await expect(page.getByText(/click anywhere to enter/i)).toBeVisible();
});

test("clicking anywhere navigates to /home", async ({ page }) => {
  await page.goto("/");
  await page.locator('[role="button"][aria-label="Enter site"]').click();
  await expect(page).toHaveURL(/\/home$/);
});

test("pressing Enter on the landing navigates to /home", async ({ page }) => {
  await page.goto("/");
  await page.locator('[role="button"][aria-label="Enter site"]').focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/home$/);
});

test("reduced-motion users see the poster, not a video element", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.locator('img[alt*="pug"]')).toBeVisible();
  await context.close();
});
