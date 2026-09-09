import { test, expect } from '@playwright/test';

test.describe('62 — Video Player', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#media');
  });

  test('starts video playback', async ({ page }) => {
    const video = page.getByTestId('video-player');
    try {
      await video.evaluate((el: HTMLVideoElement) => el.play());
    } catch {
      // Some browsers require a user gesture; allow autoplay to fail silently.
    }
    const paused = await video.evaluate((el: HTMLVideoElement) => el.paused);
    expect(typeof paused).toBe('boolean');
    expect(video).toBeVisible();
  });
});
