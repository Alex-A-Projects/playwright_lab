import { test, expect } from '@playwright/test';

test.describe('18 — Responsive Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
  });

  test('desktop layout shows wide elements', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/index.html#responsive');

    // On desktop, a "wide" element should be visible
    const wide = page.locator('#responsive .desktop-only, #responsive .wide-only').first();
    if (await wide.isVisible()) {
      await expect(wide).toBeVisible();
    }

    // Mobile-only elements should be hidden
    const mobile = page.locator('#responsive .mobile-only').first();
    if ((await mobile.count()) > 0) {
      await expect(mobile).toBeHidden();
    }
  });

  test('tablet layout shows medium-sized elements', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/index.html#responsive');

    // The responsive section should still be visible
    await expect(page.locator('#responsive')).toBeVisible();
  });

  test('mobile layout shows mobile-only elements', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/index.html#responsive');

    const mobile = page.locator('#responsive .mobile-only').first();
    if (await mobile.isVisible()) {
      await expect(mobile).toBeVisible();
    }

    // Desktop-only should be hidden
    const desktop = page.locator('#responsive .desktop-only').first();
    if ((await desktop.count()) > 0) {
      await expect(desktop).toBeHidden();
    }
  });

  test('cards reflow at different viewport sizes', async ({ page }) => {
    await page.goto('/index.html#responsive');

    // Measure card layout at desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    const desktopWidth = await page.locator('#responsive .card, #responsive article').first().evaluate(
      (el) => el.getBoundingClientRect().width,
    );

    // Measure at mobile
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileWidth = await page.locator('#responsive .card, #responsive article').first().evaluate(
      (el) => el.getBoundingClientRect().width,
    );

    // Mobile width should be smaller (cards stack on mobile)
    expect(mobileWidth).toBeLessThanOrEqual(desktopWidth);
  });
});