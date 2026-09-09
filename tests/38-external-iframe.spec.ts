import { test, expect } from '@playwright/test';

test.describe('38 — External iFrame', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#frames');
  });

  test('exposes the external iframe with the expected src attribute', async ({ page }) => {
    const externalIframe = page.getByTestId('external-iframe');
    await expect(externalIframe).toHaveAttribute('src', /playwright\.dev/);
  });
});