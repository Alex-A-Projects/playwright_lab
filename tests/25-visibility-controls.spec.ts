import { test, expect } from '@playwright/test';

test.describe('25 — Visibility Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#dynamic');
  });

  test('toggles the visible element via show / hide buttons', async ({ page }) => {
    const card = page.getByTestId('visibility-card');
    const element = card.getByTestId('visible-element');

    // Starts visible
    await expect(element).toBeVisible();

    // Hide button adds the .hidden class
    await card.getByTestId('hide-btn').click();
    await expect(element).toBeHidden();

    // Show button removes it again
    await card.getByTestId('show-btn').click();
    await expect(element).toBeVisible();
  });
});