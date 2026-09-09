import { test, expect } from '@playwright/test';

test.describe('67 — ARIA Expanded / Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#a11y');
  });

  test('toggle button flips aria-expanded and reveals content', async ({ page }) => {
    const toggle = page.getByTestId('a11y-expand-btn');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('a11y-expand-content')).toBeVisible();
  });
});
