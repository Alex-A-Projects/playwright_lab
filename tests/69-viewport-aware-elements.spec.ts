import { test, expect } from '@playwright/test';

test.describe('69 — Viewport-Aware Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#responsive');
  });

  test('desktop-only and always-visible boxes are shown at desktop width', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/index.html#responsive');
    await expect(page.getByTestId('desktop-only')).toBeVisible();
    await expect(page.getByTestId('always-visible')).toBeVisible();
    await expect(page.getByTestId('viewport-width')).toContainText('1280');
  });
});
