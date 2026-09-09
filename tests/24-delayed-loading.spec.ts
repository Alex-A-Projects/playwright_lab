import { test, expect } from '@playwright/test';

test.describe('24 — Delayed Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#dynamic');
  });

  test('shows the loaded data after the simulated delay', async ({ page }) => {
    const card = page.getByTestId('delayed-card');

    // Pick the 1-second option so the test stays fast
    await card.getByTestId('delay-select').selectOption('1');

    // Trigger the load — the JS uses setTimeout to inject `loaded-data`
    await card.getByTestId('load-delayed-btn').click();

    // toBeVisible auto-waits past the simulated delay
    await expect(card.locator('[data-testid="loaded-data"]')).toBeVisible();
    await expect(card.locator('[data-testid="loaded-data"]')).toContainText(/Content Loaded/);
  });
});