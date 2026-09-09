import { test, expect } from '@playwright/test';

test.describe('01 — Registration Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('fills every field and submits successfully', async ({ page }) => {
    await page.getByTestId('input-fullname').fill('Ada Lovelace');
    await page.getByTestId('input-email').fill('ada@example.com');
    await page.getByTestId('input-password').fill('Sup3rSecret!');
    await page.getByTestId('input-phone').fill('+1 (555) 010-0199');
    await page.getByTestId('input-dob').fill('1990-12-10');
    await page.getByTestId('select-country').selectOption('uk');
    await page.getByTestId('radio-female').check();
    await page.getByTestId('check-js').check();
    await page.getByTestId('check-python').check();
    await page.getByTestId('textarea-bio').fill('QA engineer who automates everything.');
    await page.getByTestId('check-terms').check();
    await page.getByTestId('btn-register').click();

    await expect(page.getByTestId('form-success')).toBeVisible();
    await expect(page.getByTestId('form-success')).toContainText(/success/i);
  });
});
