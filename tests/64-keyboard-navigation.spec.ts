import { test, expect } from '@playwright/test';

test.describe('64 — Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#a11y');
  });

  test('Tab moves focus through the a11y buttons', async ({ page }) => {
    const btn1 = page.getByTestId('a11y-btn-1');
    const btn2 = page.getByTestId('a11y-btn-2');
    await btn1.focus();
    await expect(btn1).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(btn2).toBeFocused();
    await expect(page.getByTestId('a11y-key-result')).toBeVisible();
  });
});
