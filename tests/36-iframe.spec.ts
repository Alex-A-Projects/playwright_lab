import { test, expect } from '@playwright/test';

test.describe('36 — iFrame', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#frames');
  });

  test('interacts with an element inside the practice iframe', async ({ page }) => {
    const frame = page.frameLocator('[data-testid="practice-iframe"]');
    const submit = frame.getByTestId('iframe-submit');
    await submit.waitFor({ state: 'visible', timeout: 10_000 });
    await submit.click();
    await expect(frame.getByTestId('iframe-result')).toBeVisible();
  });
});