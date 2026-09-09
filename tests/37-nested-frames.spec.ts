import { test, expect } from '@playwright/test';

test.describe('37 — Nested Frames', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#frames');
  });

  test('reaches an element inside the nested frames iframe', async ({ page }) => {
    const outer = page.frameLocator('[data-testid="nested-frames-iframe"]');
    const innerButton = outer.locator('iframe >> inner-button, [data-testid="inner-frame-button"]').first();
    await innerButton.waitFor({ state: 'attached', timeout: 10_000 });
    const count = await innerButton.count();
    expect(count).toBeGreaterThan(0);
  });
});