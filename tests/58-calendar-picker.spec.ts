import { test, expect } from '@playwright/test';

test.describe('58 — Calendar Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#datepicker');
  });

  test('selecting a day writes it into the result', async ({ page }) => {
    const card = page.locator('[data-testid="datepicker-card"]');

    // Open the calendar popover
    await card.getByTestId('datepicker-input').click();
    const calendar = card.getByTestId('datepicker-calendar');
    await expect(calendar).toBeVisible();

    // Click the "Today" button — handler fills the input + writes to result
    await card.getByTestId('dp-today').click();

    // Input is populated with a localized date string
    await expect(card.getByTestId('datepicker-input')).not.toHaveValue('');

    // Result panel reflects the selected date
    await expect(card.getByTestId('datepicker-result')).toContainText(/Selected:/);
  });
});
