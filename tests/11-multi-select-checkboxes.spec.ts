import { test, expect } from '@playwright/test';

test.describe('11 — Multi-Select Checkboxes', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('checks three toppings without closing the dropdown', async ({ page }) => {
    await page.getByTestId('checkbox-dropdown-trigger').click();
    await expect(page.getByTestId('checkbox-dropdown-menu')).toBeVisible();

    await page.getByTestId('topping-cheese').click();
    await page.getByTestId('topping-mushrooms').click();
    await page.getByTestId('topping-olives').click();

    await expect(page.getByTestId('checkbox-dropdown-result')).toContainText(/cheese.*mushrooms.*olives/);
  });
});
