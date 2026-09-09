import { test, expect } from '@playwright/test';

test.describe('17 — Dynamic Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#tables');
  });

  test('renders shuffled columns and rows on load', async ({ page }) => {
    const tables = page.locator('#tables');

    // The fruit table is populated by JS on page load with 5 fruits and
    // 6 shuffled columns. Assert the table mounts with multiple cells.
    const body = tables.getByTestId('dynamic-fruit-body');
    await expect(body).toBeVisible();
    await expect(body.locator('tr')).toHaveCount(5);

    // Head has 6 column headers (Fruit, Color, Weight, Price, Season, Stock)
    const head = tables.getByTestId('dynamic-fruit-head');
    await expect(head.locator('th')).toHaveCount(6);
  });
});