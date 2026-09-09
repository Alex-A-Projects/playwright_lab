import { test, expect } from '@playwright/test';

test.describe('13 — Focus-Gated Dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('mounts the option list on click and selects QA Lead', async ({ page }) => {
    // Options exist in the DOM only while the control is open — assert the empty start state first.
    await expect(page.getByTestId('focus-dropdown-list')).toHaveCount(0);

    await page.getByTestId('focus-dropdown-text').click();
    await expect(page.getByTestId('focus-dropdown-list')).toBeVisible();

    await page.getByTestId('focus-opt-qa-lead').click();

    await expect(page.getByTestId('focus-dropdown-result')).toContainText('QA Lead');
    await expect(page.getByTestId('focus-dropdown-input')).toHaveText('QA Lead');
  });
});
