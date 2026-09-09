import { test, expect } from '@playwright/test';

test.describe('19 — Hover Effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#interactions');
  });

  test('reveals the custom tooltip when hovering the trigger button', async ({ page }) => {
    const card = page.getByTestId('hover-card');

    // Tooltip starts hidden via CSS; hover() should toggle it visible.
    const tooltip = card.getByTestId('custom-tooltip');
    await expect(tooltip).toBeHidden();

    await card.getByTestId('tooltip-btn').hover();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(/HTML/);
  });
});