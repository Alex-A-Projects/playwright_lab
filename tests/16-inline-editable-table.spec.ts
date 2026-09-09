import { test, expect } from '@playwright/test';

test.describe('16 — Inline Editable Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#tables');
  });

  test('edits a contenteditable cell and recalculates the row total', async ({ page }) => {
    const tables = page.locator('#tables');

    // First quantity cell starts at "1"; update it to "3"
    const qty = tables.getByTestId('edit-qty-1');
    await qty.click();
    await qty.fill('3');
    await qty.press('Tab');

    // Row 1's total updates from $2,499 (1 × 2499) to $7,497 (3 × 2499)
    await expect(tables.getByTestId('edit-total-1')).toHaveText(/\$7,497/);

    // Grand total also reflects the change
    await expect(tables.getByTestId('grand-total')).not.toHaveText(/\$5,446/);
  });
});