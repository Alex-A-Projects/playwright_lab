import { test, expect } from '@playwright/test';

test.describe('09 — Grouped Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('selects an option from inside the Cars optgroup', async ({ page }) => {
    const select = page.getByTestId('grouped-select');
    await expect(select.locator('optgroup')).toHaveCount(3);

    await select.selectOption('suv');

    await expect(select).toHaveValue('suv');
    await expect(page.getByTestId('grouped-select-result')).toContainText(/SUV.*Cars/);
  });
});
