import { test, expect } from "@playwright/test";

test("/blog lists the seed welcome post", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { name: /Welcome to My Prologue/i })).toBeVisible();
});

test("/blog/welcome renders the MDX body", async ({ page }) => {
  await page.goto("/blog/welcome");
  await expect(page.getByRole("heading", { name: /Welcome to My Prologue/i })).toBeVisible();
  await expect(page.getByText(/PM with seven years/i)).toBeVisible();
});

test("/projects lists the seed my-prologue entry", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: /My Prologue/i })).toBeVisible();
});

test("/projects/my-prologue renders the MDX body", async ({ page }) => {
  await page.goto("/projects/my-prologue");
  await expect(page.getByText(/Cinematic landing/i)).toBeVisible();
});

test("/about renders the skeleton", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: /^About$/ })).toBeVisible();
  await expect(page.getByText(/More soon/i)).toBeVisible();
});
