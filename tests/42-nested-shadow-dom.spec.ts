import { test, expect } from '@playwright/test';

test.describe('42 — Nested Shadow DOM', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#shadow');
  });

  test('clicks a button inside a nested shadow root', async ({ page }) => {
    const innerButton = page.locator('[data-testid="inner-shadow-button"]');
    await innerButton.waitFor({ state: 'visible', timeout: 10_000 });
    await innerButton.click();
    await expect(page.locator('[data-testid="inner-shadow-result"]')).toContainText(/clicked/i);
  });
});