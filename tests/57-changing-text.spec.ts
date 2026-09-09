import { test, expect } from '@playwright/test';

test.describe('57 — Changing Text', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#flaky');
  });

  test('the box text rotates through the candidate phrases', async ({ page }) => {
    const box = page.getByTestId('changing-text-box');

    // Read the initial text, then wait until it differs from it.
    // The handler rotates through 6 strings every 3s, so within ~3s the
    // text is guaranteed to change.
    const initial = await box.textContent();
    await expect(box).not.toHaveText(initial ?? '', { timeout: 10_000 });

    // The "Grab It!" action becomes visible when text equals "Success! Click now".
    // It may already be present if we landed on a cycle that triggered it; otherwise
    // wait. Either way the result text reflects a successful catch once clicked.
    const action = page.getByTestId('changing-text-action');
    await action.click({ timeout: 15_000 });
    await expect(page.getByTestId('changing-text-result')).toHaveText(/You caught it!/);
  });
});
