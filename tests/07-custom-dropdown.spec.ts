import { test, expect } from '@playwright/test';

test.describe('07 — Custom Dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('opens the trigger and selects High priority', async ({ page }) => {
    const trigger = page.getByTestId('custom-dropdown-trigger');
    await trigger.click();
    await expect(page.getByTestId('custom-dropdown-menu')).toBeVisible();

    await page.getByTestId('custom-opt-high').click();

    await expect(page.getByTestId('custom-dropdown-result')).toContainText('high');
    await expect(trigger).toContainText(/High/);
  });
});
