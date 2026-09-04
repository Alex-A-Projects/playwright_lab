import { test, expect } from '@playwright/test';

test.describe('04 — Shopping', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#shopping');
  });

  test('adds a product to cart and verifies cart count', async ({ page }) => {
    // Find the first "Add to Cart" button
    const addBtn = page.getByRole('button', { name: /add to cart/i }).first();
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.click();

    // The cart count/summary updates — assert it's visible
    const cart = page.locator('#shopping').getByText(/cart|count|items/i).first();
    await expect(cart).toBeVisible();
  });

  test('applies a coupon code', async ({ page }) => {
    const couponInput = page.locator('#shopping input[placeholder*="coupon" i], #shopping input[name*="coupon" i]').first();
    if (await couponInput.isVisible()) {
      await couponInput.fill('SAVE10');
      const applyBtn = page.getByRole('button', { name: /apply/i }).first();
      await applyBtn.click();
      // Discount line should appear
      await expect(page.locator('#shopping').getByText(/discount|applied/i).first()).toBeVisible();
    }
  });

  test('opens the checkout modal and completes the flow', async ({ page }) => {
    const buyNow = page.getByRole('button', { name: /buy now/i }).first();
    await buyNow.scrollIntoViewIfNeeded();
    await buyNow.click();

    // The checkout modal is a div overlay (no role="dialog"), so locate it by its test ID
    const dialog = page.getByTestId('shop-checkout-modal');
    await expect(dialog).toBeVisible();

    // Step 1 — Address: fill shipping info and continue
    await dialog.getByLabel(/name|full name/i).fill('Alex Tester');
    await dialog.getByLabel(/address/i).fill('123 Test Street');
    await dialog.getByTestId('shop-to-payment').click();

    // Step 2 — Payment: choose card, then place the order
    await dialog.getByTestId('pay-option-card').click();
    await dialog.getByTestId('shop-place-order').click();

    // Step 3 — Confirmation appears
    await expect(page.getByText(/order (placed|confirmed|successful)|thank you/i).first()).toBeVisible();
  });
});