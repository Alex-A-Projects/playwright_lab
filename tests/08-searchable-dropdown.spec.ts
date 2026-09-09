import { test, expect } from '@playwright/test';

test.describe('08 — Searchable Dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('filters the city list and selects London', async ({ page }) => {
    const input = page.getByTestId('searchable-dropdown-input');
    await input.click();
    await input.fill('lon');

    await expect(page.getByTestId('city-london')).toBeVisible();
    await page.getByTestId('city-london').click();

    await expect(page.getByTestId('searchable-dropdown-result')).toContainText('london');
  });
});
