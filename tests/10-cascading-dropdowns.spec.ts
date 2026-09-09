import { test, expect } from '@playwright/test';

test.describe('10 — Cascading Dropdowns', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('drills continent to country to city', async ({ page }) => {
    const country = page.getByTestId('cascade-country');
    const city = page.getByTestId('cascade-city');
    await expect(country).toBeDisabled();

    // Each selectOption auto-waits for the next select to be repopulated and enabled.
    await page.getByTestId('cascade-continent').selectOption('asia');
    await country.selectOption('japan');
    await city.selectOption('tokyo');

    await expect(page.getByTestId('cascade-result')).toContainText(/Asia.*Japan.*Tokyo/);
  });
});
