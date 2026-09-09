import { test, expect } from '@playwright/test';

test.describe('39 — Window Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#frames');
  });

  test('opens a new tab and verifies its URL', async ({ context, page }) => {
    const newPagePromise = context.waitForEvent('page');
    await page.getByTestId('new-tab-btn').click();
    const newPage = await newPagePromise;
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/login\.html/);
    await newPage.close();
  });
});