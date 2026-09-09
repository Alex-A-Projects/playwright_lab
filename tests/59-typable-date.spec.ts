import { test, expect } from '@playwright/test';

test.describe('59 — Typable Date', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#datepicker');
  });

  test('typing a valid DD-MM-YYYY date updates the result', async ({ page }) => {
    const card = page.locator('[data-testid="typed-date-card"]');

    // Type a valid date — the handler parses it and writes "Typed: ..." to the result
    await card.getByTestId('typed-date-input').fill('15-06-2025');

    await expect(card.getByTestId('typed-date-result')).toContainText(/Typed:.*June.*15.*2025/);
  });
});
