import { test, expect } from '@playwright/test';

test.describe('70 — Responsive Layout Change', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
  });

  test('switches between mobile-only and desktop-only visibility at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/index.html#responsive');
    await expect(page.getByTestId('mobile-only')).toBeVisible();
    await expect(page.getByTestId('desktop-only')).toBeHidden();

    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByTestId('desktop-only')).toBeVisible();
    await expect(page.getByTestId('mobile-only')).toBeHidden();
  });
});
