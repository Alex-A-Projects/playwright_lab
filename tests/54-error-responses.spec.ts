import { test, expect } from '@playwright/test';

test.describe('54 — Error Responses', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#network');
  });

  test('triggering a 404 renders the error payload', async ({ page }) => {
    const network = page.locator('#network');

    // Click the 404 button — handler writes JSON to error-api-result
    await network.getByTestId('api-error-404').click();

    // Result contains the status code and the human message
    await expect(network.getByTestId('error-api-result')).toContainText(/"status":\s*404/);
    await expect(network.getByTestId('error-api-result')).toContainText(/Not Found/);
  });
});
