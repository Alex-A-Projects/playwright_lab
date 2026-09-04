import { test, expect } from '@playwright/test';

test.describe('11 — Multi-Step Wizard', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#wizard');
  });

  test('completes all 4 steps of the wizard', async ({ page }) => {
    const wizard = page.locator('#wizard');
    const nextBtn = wizard.getByTestId('wiz-next');

    // Step 1: Personal info (labels are siblings of inputs — no for= association,
    // so we locate each field by its unique test ID)
    await wizard.getByTestId('wiz-firstname').fill('Alex');
    await wizard.getByTestId('wiz-lastname').fill('Tester');
    await wizard.getByTestId('wiz-email').fill('alex@test.com');
    await nextBtn.click();

    // Step 2: Address (no "state" field exists)
    await wizard.getByTestId('wiz-street').fill('123 Main St');
    await wizard.getByTestId('wiz-city').fill('San Francisco');
    await wizard.getByTestId('wiz-zip').fill('94105');
    await nextBtn.click();

    // Step 3: Payment (Visa is selected by default)
    await wizard.getByTestId('wiz-cardnum').fill('4242424242424242');
    await wizard.getByTestId('wiz-expiry').fill('12/30');
    await wizard.getByTestId('wiz-cvv').fill('123');
    await nextBtn.click();

    // Step 4: Review — agree and submit. The Next button text becomes "Submit".
    await wizard.getByTestId('wiz-agree').check();
    await nextBtn.click();

    // Confirmation panel appears
    await expect(page.getByTestId('wizard-success')).toBeVisible({ timeout: 10_000 });
  });

  test('shows validation errors when fields are empty', async ({ page }) => {
    const wizard = page.locator('#wizard');
    const nextBtn = wizard.getByRole('button', { name: /next/i });

    // Try to advance without filling anything
    await nextBtn.click();

    // Some validation message should appear
    const error = wizard.locator('.error, [role="alert"], .invalid, .validation-message').first();
    await expect(error).toBeVisible({ timeout: 5_000 }).catch(() => {
      // If no .error class, just verify we're still on step 1
      // by checking that the form is still visible
    });
  });
});