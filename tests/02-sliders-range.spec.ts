import { test, expect } from '@playwright/test';

test.describe('02 — Sliders & Range', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('drags the volume range and sets the color picker', async ({ page }) => {
    const volume = page.getByTestId('slider-volume');
    await volume.fill('80');
    await expect(volume).toHaveValue('80');
    await expect(page.getByTestId('volume-value')).toHaveText('80');

    // Color inputs ignore typing, so set the value and dispatch the events the page listens for.
    const color = page.getByTestId('color-picker');
    await color.evaluate((el) => {
      const input = el as HTMLInputElement;
      input.value = '#ff8800';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(color).toHaveValue('#ff8800');
    await expect(page.getByTestId('color-display')).toHaveText('#ff8800');
  });
});
