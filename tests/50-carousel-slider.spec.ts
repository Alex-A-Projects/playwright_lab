import { test, expect } from '@playwright/test';

test.describe('50 — Carousel / Slider', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#carousel');
  });

  test('next button advances the active slide', async ({ page }) => {
    const carousel = page.locator('#carousel');

    // Stop autoplay so the test does not race the 4s interval
    await carousel.getByTestId('carousel-autoplay').uncheck();

    // Start on slide 1
    await expect(carousel.getByTestId('carousel-status')).toHaveText(/Slide 1 of 4/);

    // Click Next, then verify status text updated
    await carousel.getByTestId('carousel-next').click();
    await expect(carousel.getByTestId('carousel-status')).toHaveText(/Slide 2 of 4/);

    // The matching dot gains the active class
    await expect(carousel.getByTestId('carousel-dot-2')).toHaveClass(/active/);
  });
});
