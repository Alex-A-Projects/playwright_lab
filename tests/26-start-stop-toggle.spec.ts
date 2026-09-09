import { test, expect } from '@playwright/test';

test.describe('26 — Start / Stop Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#dynamic');
  });

  test('flips between Start and Stop and updates the status text', async ({ page }) => {
    // The Start/Stop toggle is rendered inside the visibility card.
    const card = page.getByTestId('visibility-card');
    const btn = card.getByTestId('start-stop-btn');
    const status = card.getByTestId('start-stop-status');

    await expect(btn).toHaveText('Start');
    await expect(status).toHaveText(/Stopped/);

    // First click: text becomes "Stop" and status flips to "Running"
    await btn.click();
    await expect(btn).toHaveText('Stop');
    await expect(status).toHaveText(/Running/);

    // Second click: returns to the original state
    await btn.click();
    await expect(btn).toHaveText('Start');
    await expect(status).toHaveText(/Stopped/);
  });
});