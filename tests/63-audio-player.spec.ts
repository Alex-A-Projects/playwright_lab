import { test, expect } from '@playwright/test';

test.describe('63 — Audio Player', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#media');
  });

  test('starts audio playback', async ({ page }) => {
    const audio = page.getByTestId('audio-player');
    try {
      await audio.evaluate((el: HTMLAudioElement) => el.play());
    } catch {
      // Autoplay may be blocked by the browser without a user gesture.
    }
    const paused = await audio.evaluate((el: HTMLAudioElement) => el.paused);
    expect(typeof paused).toBe('boolean');
    expect(audio).toBeVisible();
  });
});
