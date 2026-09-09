import { test, expect } from '@playwright/test';

test.describe('53 — Slow API (Timeout)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#network');
  });

  test('selects the 2s delay and verifies the late response', async ({ page }) => {
    const network = page.locator('#network');

    // Pick the shortest delay so the test finishes fast
    await network.getByTestId('api-delay-select').selectOption('2');
    await network.getByTestId('slow-api-btn').click();

    // Placeholder shows immediately
    await expect(network.getByTestId('slow-api-result')).toContainText(/Waiting|response/i);

    // After ~2s the result fills with a JSON payload mentioning the delay
    await expect(network.getByTestId('slow-api-result')).toContainText(/Response after 2s delay/, {
      timeout: 10_000,
    });
  });
});
