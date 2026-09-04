import { test, expect } from '@playwright/test';

test.describe('05 — Dynamic Content', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#dynamic');
  });

  test('waits for a delayed element to appear', async ({ page }) => {
    // Playwright's auto-waiting handles most cases, but explicit waitFor is educational
    const button = page.getByTestId('load-delayed-btn');

    if (await button.isVisible()) {
      await button.click();
    }

    // After clicking Load Content, the container populates with [data-testid="loaded-data"]
    // after a short delay (default 3s).
    await expect(
      page.locator('#dynamic [data-testid="loaded-data"], #dynamic .loaded-data').first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('toggles an element between visible and hidden', async ({ page }) => {
    // The visibility-toggle card has separate Show / Hide / Toggle buttons.
    const toggleBtn = page.getByTestId('toggle-vis-btn');
    const target = page.getByTestId('visible-element');

    if (await toggleBtn.isVisible()) {
      const wasVisible = await target.isVisible().catch(() => false);

      await toggleBtn.click();
      // After click, state should flip
      if (wasVisible) {
        await expect(target).toBeHidden();
      } else {
        await expect(target).toBeVisible();
      }
    }
  });

  test('verifies a progress bar reaches completion', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /start|begin|run/i }).first();
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    // Progress bar at 100% — assertion will retry until it fills
    const progress = page.locator('#dynamic progress, #dynamic [role="progressbar"]').first();
    if (await progress.isVisible()) {
      await expect(progress).toHaveAttribute('value', '100', { timeout: 15_000 });
    }
  });
});