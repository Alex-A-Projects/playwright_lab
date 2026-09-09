import { test, expect } from '@playwright/test';

test.describe('22 — Available Offers', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#shopping');
  });

  test('lists coupon chips and applies FLAT10', async ({ page }) => {
    const shop = page.locator('#shopping');

    // All three chips render up front
    await expect(shop.getByTestId('coupon-chip-FLAT10')).toBeVisible();
    await expect(shop.getByTestId('coupon-chip-SPEED20')).toBeVisible();
    await expect(shop.getByTestId('coupon-chip-FIRST500')).toBeVisible();

    // Apply the FLAT10 coupon via the input + apply button
    await shop.getByTestId('shop-coupon-input').fill('FLAT10');
    await shop.getByTestId('shop-apply-coupon').click();

    // Coupon message confirms it was applied
    await expect(shop.locator('#shopCouponMsg')).toContainText(/applied|FLAT10|10%/i);
  });
});