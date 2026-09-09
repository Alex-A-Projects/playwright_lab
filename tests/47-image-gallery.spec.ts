import { test, expect } from '@playwright/test';

test.describe('47 — Image Gallery with Lightbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#advanced');
  });

  test('clicking a thumbnail opens the lightbox', async ({ page }) => {
    const lightbox = page.getByTestId('lightbox');
    // Lightbox starts hidden
    await expect(lightbox).toBeHidden();

    // Click a thumbnail — handler opens the lightbox
    await page.getByTestId('gallery-item-1').click();
    await expect(lightbox).toBeVisible();

    // The lightbox content holds an <img> element
    const img = page.getByTestId('lightbox-content').locator('img');
    await expect(img).toBeVisible();

    // Close button hides the lightbox again
    await page.getByTestId('lightbox-close').click();
    await expect(lightbox).toBeHidden();
  });
});
