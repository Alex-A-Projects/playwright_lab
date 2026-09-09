import { test, expect } from '@playwright/test';

test.describe('56 — Delayed Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#flaky');
  });

  test('spawned button appears after the delay and can be clicked', async ({ page }) => {
    const container = page.getByTestId('delayed-btn-container');

    // Kick off the random 1–5s delay
    await page.getByTestId('spawn-delayed-btn').click();

    // The spawned button is created with data-testid="spawned-button".
    // It is dynamically inserted, so use a locator with that testid inside the container.
    const spawned = container.locator('[data-testid="spawned-button"]');
    await expect(spawned).toBeVisible({ timeout: 10_000 });

    // Clicking it replaces the container with a "Button was clicked!" message
    await spawned.click();
    await expect(container).toContainText(/Button was clicked!/);
  });
});
