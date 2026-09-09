import { test, expect } from '@playwright/test';

test.describe('14 — Delayed Dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('waits out the 2s load before selecting Electronics', async ({ page }) => {
    const select = page.getByTestId('delayed-select');
    await expect(select).toBeDisabled();

    await page.getByTestId('load-delayed-dropdown-btn').click();

    // No hard wait: selectOption retries until the select is enabled and the option exists.
    await select.selectOption('electronics');

    await expect(page.getByTestId('delayed-dropdown-result')).toContainText('Electronics');
  });
});
