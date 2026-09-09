import { test, expect } from '@playwright/test';

test.describe('46 — Local Storage', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#advanced');
  });

  test('sets, reads, and clears a localStorage entry', async ({ page }) => {
    const advanced = page.locator('#advanced');

    // Fill key + value, then click Set
    await advanced.getByTestId('storage-key').fill('playlab-fav');
    await advanced.getByTestId('storage-value').fill('Playwright');
    await advanced.getByTestId('set-storage-btn').click();

    // Result displays "Set: key = value"
    const result = advanced.getByTestId('storage-result');
    await expect(result).toContainText(/Set:.*playlab-fav.*Playwright/);

    // Round-trip via localStorage to confirm the write hit the browser store
    const stored = await page.evaluate(() => window.localStorage.getItem('playlab-fav'));
    expect(stored).toBe('Playwright');

    // Get on the same key echoes the value back
    await advanced.getByTestId('get-storage-btn').click();
    await expect(result).toContainText(/playlab-fav.*=.*Playwright/);

    // Clear All wipes every key
    await advanced.getByTestId('clear-storage-btn').click();
    const after = await page.evaluate(() => window.localStorage.getItem('playlab-fav'));
    expect(after).toBeNull();
  });
});
