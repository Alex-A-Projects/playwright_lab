import { test, expect } from '@playwright/test';

test.describe('28 — Auto-updating Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#dynamic');
  });

  test('starts ticking automatically once started', async ({ page }) => {
    // The auto-timer lives inside the counter card.
    const card = page.getByTestId('counter-card');
    const display = card.getByTestId('timer-display');

    await expect(display).toHaveText('00:00');

    // Start the setInterval, then wait for the first tick (~1s).
    await card.getByTestId('start-timer-btn').click();
    await expect(display).not.toHaveText('00:00', { timeout: 3_000 });

    // Sanity: the new value looks like a mm:ss timestamp starting with 00:.
    const text = (await display.textContent()) ?? '';
    expect(text).toMatch(/^00:\d{2}$/);

    // Stop the interval so subsequent tests aren't affected.
    await card.getByTestId('stop-timer-btn').click();
  });
});