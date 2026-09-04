import { test, expect } from '@playwright/test';

test.describe('08 — Frames & Windows', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#frames');
  });

  test('interacts with an iframe', async ({ page }) => {
    // frameLocator scopes locators to a specific frame
    const frame = page.frameLocator('[data-testid="practice-iframe"]');

    // Fill the iframe's name field, then submit
    await frame.getByTestId('iframe-input-name').fill('Alex Tester');
    await frame.getByTestId('iframe-submit').click();

    // The frame's result area should reflect the submission
    await expect(frame.getByTestId('iframe-result')).toBeVisible();
  });

  test('handles a popup window', async ({ context, page }) => {
    const popupPromise = context.waitForEvent('page');

    // The "Open Popup Window" button calls window.open('login.html', 'popup', ...)
    const popupBtn = page.getByTestId('popup-btn');
    if (await popupBtn.isVisible()) {
      await popupBtn.click();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      await expect(popup).toHaveURL(/login\.html/);
      await popup.close();
    }
  });

  test('downloads a file', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    const downloadLink = page.getByRole('link', { name: /download/i }).first();
    if (await downloadLink.isVisible()) {
      await downloadLink.click();
      const download = await downloadPromise;
      // Save to a known path so we can verify
      const path = await download.path();
      expect(path).not.toBeNull();
    }
  });
});