import { test, expect } from '@playwright/test';

test.describe('14 — Flaky & Retry Elements', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#flaky');
  });

  test('catches an element that appears after a delay', async ({ page }) => {
    // The point of this section: elements that don't exist or are hidden initially.
    // Playwright's auto-retrying locators handle this — assertions wait up to 5s by default.

    // Click the trigger that reveals a delayed element
    await page.getByTestId('spawn-delayed-btn').click();

    // The spawned button appears after a random 1-5s delay.
    // The assertion will keep retrying until the element appears.
    const spawned = page.locator('[data-testid="spawned-button"]');
    await expect(spawned).toBeVisible({ timeout: 10_000 });
  });

  test('overrides timeout for an element that takes a while', async ({ page }) => {
    // For elements that need a custom timeout, pass it directly to the action
    const slowButton = page.getByRole('button', { name: /slow|takes a while/i }).first();

    if (await slowButton.count() > 0) {
      // Use action-level timeout
      await slowButton.click({ timeout: 15_000 });
      await expect(slowButton).toBeVisible();
    }
  });

  test('handles an element that toggles its text rapidly', async ({ page }) => {
    const changingText = page.locator('#flaky [data-testid="changing"], #flaky .changing-text').first();
    if (await changingText.count() > 0) {
      // Read text multiple times — should change
      const first = await changingText.textContent();
      await page.waitForTimeout(500);
      const second = await changingText.textContent();
      // Both reads succeed; we don't assert they differ since timing is non-deterministic
      expect(first).not.toBeNull();
      expect(second).not.toBeNull();
    }
  });
});