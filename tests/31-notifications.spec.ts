import { test, expect } from '@playwright/test';

test.describe('31 — Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#modals');
  });

  test('shows a toast notification when a toast button is clicked', async ({ page }) => {
    await page.getByTestId('toast-success').click();
    const toast = page.locator('.toast').first();
    await expect(toast).toBeVisible({ timeout: 5_000 });
    await expect(toast).toContainText(/success/i);
  });
});