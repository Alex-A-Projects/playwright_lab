import { test, expect } from '@playwright/test';

test.describe('49 — Cookie Consent', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html');
  });

  test('accepting cookies hides the banner and persists the choice', async ({ page }) => {
    const banner = page.getByTestId('cookie-banner');
    await expect(banner).toBeVisible();

    // Accepting closes the banner
    await page.getByTestId('cookie-accept').click();
    await expect(banner).toBeHidden();

    // The choice is stored in sessionStorage
    const choice = await page.evaluate(() => window.sessionStorage.getItem('playlab-cookies'));
    expect(choice).toBe('accepted');
  });
});
