import { test, expect } from '@playwright/test';

test.describe('29 — Progress Indicators', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#dynamic');
  });

  test('fills the progress bar after Simulate Download is clicked', async ({ page }) => {
    const card = page.getByTestId('progress-card');
    const bar = card.getByTestId('progress-bar');

    await expect(bar).toHaveText('0%');

    // Kick off the interval that grows width/textContent in ~15% steps.
    await card.getByTestId('start-progress-btn').click();

    // Wait for the bar to leave 0% (random walk, but always > 0 quickly).
    await expect(bar).not.toHaveText('0%', { timeout: 3_000 });

    // Eventually it reaches 100% (the interval completes in ≤ ~3s).
    await expect(bar).toHaveText('100%', { timeout: 5_000 });
  });
});