import { test, expect } from '@playwright/test';

test.describe('45 — API & Network', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#advanced');
  });

  test('fetches API data and populates the result display', async ({ page }) => {
    await page.getByTestId('fetch-data-btn').click();
    await expect(page.getByTestId('api-result')).toContainText(/John Doe|Jane Smith|Bob Wilson/, {
      timeout: 5_000,
    });
  });
});