import { test, expect } from '@playwright/test';

test.describe('12 — Carousel / Slider', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#carousel');
  });

  test('advances to the next slide', async ({ page }) => {
    const carousel = page.locator('#carousel');
    // Pause autoplay so it doesn't race with our click
    await carousel.getByTestId('carousel-autoplay').uncheck();

    await carousel.getByTestId('carousel-next').click();
    // Slide 2 should now be the active one
    await expect(carousel.getByTestId('carousel-slide-2')).toHaveClass(/active/);
    await expect(carousel.getByTestId('carousel-status')).toContainText('Slide 2 of');
  });

  test('jumps to a specific slide via indicator', async ({ page }) => {
    const carousel = page.locator('#carousel');
    // Pause autoplay so the dot we click doesn't get overridden
    await carousel.getByTestId('carousel-autoplay').uncheck();

    await carousel.getByTestId('carousel-dot-3').click();
    await expect(carousel.getByTestId('carousel-slide-3')).toHaveClass(/active/);
    await expect(carousel.getByTestId('carousel-status')).toContainText('Slide 3 of');
  });

  test('respects autoplay (slides rotate on a timer)', async ({ page }) => {
    const carousel = page.locator('#carousel');
    // Autoplay starts on by default; capture the starting slide text
    const status = carousel.getByTestId('carousel-status');
    const startText = (await status.textContent()) ?? '';

    // Autoplay interval is 4000ms; wait long enough for at least one advance
    await expect(status).not.toHaveText(startText, { timeout: 6_000 });

    // The carousel should still be visible — autoplay shouldn't break it
    await expect(carousel).toBeVisible();
  });
});