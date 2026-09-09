import { test, expect } from '@playwright/test';

test.describe('43 — Infinite Scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#advanced');
  });

  test('loads more items when scrolling to the bottom of the list', async ({ page }) => {
    const container = page.getByTestId('scroll-container');
    const initialCount = await container.locator('[data-testid^="scroll-item-"]').count();
    await container.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await page.waitForTimeout(1200);
    const finalCount = await container.locator('[data-testid^="scroll-item-"]').count();
    expect(finalCount).toBeGreaterThan(initialCount);
  });
});