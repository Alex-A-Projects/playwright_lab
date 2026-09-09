import { test, expect } from '@playwright/test';

test.describe('65 — Skip Link', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#a11y');
  });

  test('skip link navigates to the target content', async ({ page }) => {
    await page.getByTestId('skip-link').click();
    await expect(page).toHaveURL(/#a11y-target$/);
    await expect(page.getByTestId('a11y-target')).toBeVisible();
  });
});
