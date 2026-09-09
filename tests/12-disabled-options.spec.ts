import { test, expect } from '@playwright/test';

test.describe('12 — Disabled Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('blocks the sold-out plans but accepts Starter', async ({ page }) => {
    await expect(page.getByTestId('plan-pro')).toBeDisabled();
    await expect(page.getByTestId('plan-custom')).toBeDisabled();

    const select = page.getByTestId('disabled-options-select');
    await select.selectOption('starter');

    await expect(select).toHaveValue('starter');
    await expect(page.getByTestId('disabled-options-result')).toContainText('Starter');
  });
});
