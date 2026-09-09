import { test, expect } from '@playwright/test';

test.describe('51 — Fetch Users API', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#network');
  });

  test('fetches users and renders the JSON list', async ({ page }) => {
    const network = page.locator('#network');

    // Trigger the GET against jsonplaceholder.typicode.com/users
    await network.getByTestId('fetch-users-btn').click();

    // Wait for the result to populate (it is JSON-stringified user objects)
    const result = network.getByTestId('fetch-users-result');
    await expect(result).toContainText(/"name"/);
    await expect(result).toContainText(/"email"/);

    // Status badge reports the HTTP 200 + user count
    await expect(network.getByTestId('fetch-users-status')).toContainText(/OK.*users/i);
  });
});
