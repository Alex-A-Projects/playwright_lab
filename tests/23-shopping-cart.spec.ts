import { test, expect } from '@playwright/test';

test.describe('23 — Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#shopping');
  });

  test('adds two products and increments the cart count', async ({ page }) => {
    const shop = page.locator('#shopping');

    // Counter starts at 0
    await expect(shop.getByTestId('shop-cart-count')).toHaveText('0');

    await shop.getByTestId('add-cart-lamborghini').click();
    await shop.getByTestId('add-cart-triumph').click();

    await expect(shop.getByTestId('shop-cart-count')).toHaveText('2');
    await expect(shop.getByTestId('shop-cart-items')).toContainText(/Lamborghini Huracan/);
    await expect(shop.getByTestId('shop-cart-items')).toContainText(/Triumph Speed Triple/);
  });
});