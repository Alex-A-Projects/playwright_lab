import { test, expect } from '@playwright/test';

test.describe('27 — Counter & Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#dynamic');
  });

  test('increments, decrements, and resets the counter', async ({ page }) => {
    const card = page.getByTestId('counter-card');
    const value = card.getByTestId('counter-value');

    await expect(value).toHaveText('0');

    await card.getByTestId('increment-btn').click();
    await card.getByTestId('increment-btn').click();
    await expect(value).toHaveText('2');

    await card.getByTestId('decrement-btn').click();
    await expect(value).toHaveText('1');

    await card.getByTestId('reset-counter-btn').click();
    await expect(value).toHaveText('0');
  });
});