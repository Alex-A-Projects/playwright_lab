import { test, expect } from '@playwright/test';

test.describe('30 — Modal Dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#modals');
  });

  test('opens and closes the modal dialog', async ({ page }) => {
    const card = page.getByTestId('modals-card');
    const overlay = page.getByTestId('modal-overlay');

    await expect(overlay).toBeHidden();

    await card.getByTestId('open-modal-btn').click();
    await expect(overlay).toBeVisible();
    await expect(overlay.getByTestId('modal-title')).toHaveText(/Modal Title|Sample Modal/);

    // The overlay's close button hides the overlay again.
    await page.getByTestId('modal-close').click();
    await expect(overlay).toBeHidden();
  });
});