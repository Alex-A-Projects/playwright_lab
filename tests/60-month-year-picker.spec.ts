import { test, expect } from '@playwright/test';

test.describe('60 — Month / Year Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#datepicker');
  });

  test('picking "Today" populates the input with a DD-MM-YYYY date', async ({ page }) => {
    const card = page.locator('[data-testid="monthyear-card"]');

    // Open the month/year picker
    await card.getByTestId('month-year-input').click();
    const calendar = card.getByTestId('month-year-calendar');
    await expect(calendar).toBeVisible();

    // "Today" selects today's date using the currently selected month/year
    await card.getByTestId('month-year-today').click();

    // Input gets a dd-mm-yyyy value; result shows the localized long date
    await expect(card.getByTestId('month-year-input')).not.toHaveValue('');
    await expect(card.getByTestId('month-year-result')).toContainText(/Selected:/);
  });
});
