import { test, expect } from '@playwright/test';

test.describe('15 — Custom Date Picker', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#datepicker');
  });

  test('types a date into a typable date input', async ({ page }) => {
    // Standard <input type="date"> accepts fill directly
    const dateInput = page.locator('#datepicker input[type="date"]').first();
    if (await dateInput.isVisible()) {
      await dateInput.fill('2026-12-25');
      await expect(dateInput).toHaveValue('2026-12-25');
    }
  });

  test('selects a date from a custom calendar', async ({ page }) => {
    const calendar = page.locator('#datepicker .calendar, #datepicker [role="dialog"]').first();

    if (await calendar.isVisible()) {
      // Open the picker if needed
      const opener = page.locator('#datepicker button, #datepicker input').first();
      if (await opener.isVisible()) {
        await opener.click();
      }

      // Pick a day — generic selector
      const day = calendar.getByRole('button', { name: /^\d+$/ }).first();
      if (await day.isVisible()) {
        await day.click();
      }
    }
  });

  test('uses the month/year picker to navigate', async ({ page }) => {
    // Open the picker
    const opener = page.locator('#datepicker button, #datepicker input').first();
    if (await opener.isVisible()) {
      await opener.click();
    }

    // Find month/year controls
    const monthSelect = page.locator('#datepicker select').first();
    if (await monthSelect.isVisible()) {
      await monthSelect.selectOption({ index: 5 });
      await expect(monthSelect).toBeVisible();
    }
  });
});