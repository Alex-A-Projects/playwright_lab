import { test, expect } from '@playwright/test';

test.describe('61 — Date Range', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#datepicker');
  });

  test('calculates duration between start and end dates', async ({ page }) => {
    const card = page.getByTestId('daterange-card');
    await card.getByTestId('range-start').fill('2026-01-10');
    await card.getByTestId('range-end').fill('2026-01-20');
    await card.getByTestId('calc-range-btn').click();
    await expect(card.getByTestId('range-result')).toHaveText(/Duration:\s*10\s*day/i);
  });
});
