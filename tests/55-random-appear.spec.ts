import { test, expect } from '@playwright/test';

test.describe('55 — Random Appear', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#flaky');
  });

  test('the random box eventually becomes visible', async ({ page }) => {
    const box = page.getByTestId('random-appear-box');
    const log = page.getByTestId('random-appear-log');

    // The page toggles a "hidden-state" class every 2s. Over a few cycles
    // the box is guaranteed to be visible, so polling for the text works.
    await expect(log).toHaveText(/Visible/, { timeout: 10_000 });

    // And while the log says "Visible", the inner text is rendered
    await expect(box).toContainText(/Now you see me!/);
  });
});
