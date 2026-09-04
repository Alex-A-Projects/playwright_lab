import { test, expect } from '@playwright/test';

test.describe('16 — Media Player', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#media');
  });

  test('plays a video and verifies it is playing', async ({ page }) => {
    const video = page.locator('#media video').first();
    if (await video.isVisible()) {
      // Play via the video element API directly — works around autoplay restrictions
      await video.evaluate((el: HTMLVideoElement) => el.play());

      // Wait for the video to actually start
      await expect.poll(async () => {
        return video.evaluate((el: HTMLVideoElement) => ({
          paused: el.paused,
          currentTime: el.currentTime,
        }));
      }, { timeout: 5_000 }).toMatchObject({ paused: false });
    }
  });

  test('pauses a video via the play/pause button', async ({ page }) => {
    const playPauseBtn = page.locator('#media button[aria-label*="play" i], #media button[aria-label*="pause" i]').first();
    const video = page.locator('#media video').first();

    if (await playPauseBtn.isVisible()) {
      // Start playing
      await video.evaluate((el: HTMLVideoElement) => el.play());
      await page.waitForTimeout(300);

      // Pause via button
      await playPauseBtn.click();

      // Verify paused
      const isPaused = await video.evaluate((el: HTMLVideoElement) => el.paused);
      expect(isPaused).toBe(true);
    }
  });

  test('plays an audio element', async ({ page }) => {
    const audio = page.locator('#media audio').first();
    if (await audio.isVisible()) {
      await audio.evaluate((el: HTMLAudioElement) => el.play());
      await expect.poll(async () => {
        return audio.evaluate((el: HTMLAudioElement) => el.paused);
      }, { timeout: 5_000 }).toBe(false);
    }
  });
});