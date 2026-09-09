import { test, expect } from '@playwright/test';

test.describe('33 — Inline Alerts', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#modals');
  });

  test('renders the four inline alert variants on page load', async ({ page }) => {
    await expect(page.getByTestId('alert-success')).toBeVisible();
    await expect(page.getByTestId('alert-error')).toBeVisible();
    await expect(page.getByTestId('alert-warning')).toBeVisible();
    await expect(page.getByTestId('alert-info')).toBeVisible();
  });
});