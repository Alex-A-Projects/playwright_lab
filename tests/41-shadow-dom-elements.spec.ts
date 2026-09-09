import { test, expect } from '@playwright/test';

test.describe('41 — Shadow DOM Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#shadow');
  });

  test('interacts with a button inside the shadow root', async ({ page }) => {
    const shadowButton = page.locator('[data-testid="shadow-button"]');
    await shadowButton.waitFor({ state: 'visible', timeout: 10_000 });
    await shadowButton.click();
    await expect(page.locator('[data-testid="shadow-result"]')).toBeVisible();
  });
});