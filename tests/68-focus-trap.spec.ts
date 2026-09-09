import { test, expect } from '@playwright/test';

test.describe('68 — Focus Trap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#a11y');
  });

  test('keeps keyboard focus inside the trap area', async ({ page }) => {
    const area = page.getByTestId('focus-trap-area');
    await page.getByTestId('focus-trap-open').click();
    await expect(area).toBeVisible();
    const trapSelector = '[data-testid="focus-trap-area"]';
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate((sel: string) => {
        const trap = document.querySelector(sel);
        return !!trap && trap.contains(document.activeElement);
      }, trapSelector);
      expect(inside).toBe(true);
    }
  });
});
