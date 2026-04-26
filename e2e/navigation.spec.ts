import { test, expect } from "@playwright/test";

test("home shows the sidebar with brand and nav items", async ({ page }) => {
  await page.goto("/home");
  const sidebar = page.locator("aside");
  await expect(sidebar.getByRole("link", { name: /my prologue/i })).toBeVisible();
  await expect(sidebar.getByRole("button", { name: /^Blogs/i })).toBeVisible();
  await expect(sidebar.getByRole("button", { name: /^Projects/i })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: /^About$/i })).toBeVisible();
});

test("clicking Blogs cascade reveals seed entry and navigates", async ({ page }) => {
  await page.goto("/home");
  const sidebar = page.locator("aside");
  await sidebar.getByRole("button", { name: /^Blogs/i }).click();
  const entry = sidebar.getByRole("link", { name: /Welcome to My Prologue/i });
  await expect(entry).toBeVisible();
  await entry.click();
  await expect(page).toHaveURL(/\/blog\/welcome$/);
});

test("clicking Projects cascade reveals seed entry and navigates", async ({ page }) => {
  await page.goto("/home");
  const sidebar = page.locator("aside");
  await sidebar.getByRole("button", { name: /^Projects/i }).click();
  const entry = sidebar.getByRole("link", { name: "My Prologue", exact: true });
  await entry.click();
  await expect(page).toHaveURL(/\/projects\/my-prologue$/);
});

test("About link navigates to /about", async ({ page }) => {
  await page.goto("/home");
  await page.locator("aside").getByRole("link", { name: /^About$/i }).click();
  await expect(page).toHaveURL(/\/about$/);
});
