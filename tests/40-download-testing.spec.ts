import { test, expect } from '@playwright/test';

test.describe('40 — Download Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#advanced');
  });

  test('downloads the test text file', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('download-link').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/test-file\.txt/);
  });
});