import { test, expect } from '@playwright/test';

test.describe('32 — Native Dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#modals');
  });

  test('accepts a native confirm dialog and reflects the result', async ({ page }) => {
    page.on('dialog', (dialog) => {
      void dialog.accept();
    });
    await page.getByTestId('native-confirm').click();
    await expect(page.getByTestId('native-result')).toHaveText(/Confirm result:\s*true/, {
      timeout: 5_000,
    });
  });
});