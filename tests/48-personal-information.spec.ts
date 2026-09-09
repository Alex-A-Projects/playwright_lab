import { test, expect } from '@playwright/test';

test.describe('48 — Personal Information', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#wizard');
  });

  test('advances from Personal to Address step', async ({ page }) => {
    const wizard = page.locator('#wizard');

    // Step 1 should be active at the start
    await expect(wizard.getByTestId('wizard-panel-1')).toBeVisible();
    await expect(wizard.getByTestId('wizard-panel-2')).toBeHidden();

    // Fill required fields on step 1
    await wizard.getByTestId('wiz-firstname').fill('Alex');
    await wizard.getByTestId('wiz-lastname').fill('Tester');
    await wizard.getByTestId('wiz-email').fill('alex@example.com');

    // Click Next — the wizard advances to step 2
    await wizard.getByTestId('wiz-next').click();

    await expect(wizard.getByTestId('wizard-panel-2')).toBeVisible();
    await expect(wizard.getByTestId('wizard-panel-1')).toBeHidden();
  });
});
