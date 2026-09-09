import { test, expect } from '@playwright/test';

test.describe('52 — Submit Data API', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#network');
  });

  test('POSTs a post and shows the success status', async ({ page }) => {
    const network = page.locator('#network');

    await network.getByTestId('post-title').fill('My Test Post');
    await network.getByTestId('post-body').fill('Body content for the test.');
    await network.getByTestId('submit-post-btn').click();

    // Status text reports a successful HTTP 201 Created
    await expect(network.getByTestId('post-status')).toContainText(/Created/i);

    // Result echoes the title we sent
    await expect(network.getByTestId('post-result')).toContainText('My Test Post');
  });
});
