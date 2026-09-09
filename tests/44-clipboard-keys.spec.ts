import { test, expect } from '@playwright/test';

test.describe('44 — Clipboard & Keys', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/index.html#advanced');
  });

  test('records the key pressed into the key display', async ({ page }) => {
    const input = page.getByTestId('keyboard-input');
    await input.click();
    await page.keyboard.press('a');
    await expect(page.getByTestId('key-display')).toContainText(/Key: "a"/);
  });
});