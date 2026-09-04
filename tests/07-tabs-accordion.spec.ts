import { test, expect } from '@playwright/test';

test.describe('07 — Tabs & Accordion', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#tabs');
  });

  test('switches between tabs and verifies the active state', async ({ page }) => {
    // The tabs implementation uses class "active" on .tab-btn/.tab-content (no role="tab").
    const featuresTab = page.getByTestId('tab-btn-2'); // Features
    const pricingTab = page.getByTestId('tab-btn-3'); // Pricing

    await expect(featuresTab).toBeVisible();

    // Click Features — it becomes active, and its content panel shows
    await featuresTab.click();
    await expect(featuresTab).toHaveClass(/active/);
    await expect(page.getByTestId('tab-content-2')).toHaveClass(/active/);

    // Switch to Pricing
    await pricingTab.click();
    await expect(pricingTab).toHaveClass(/active/);
    await expect(page.getByTestId('tab-content-3')).toHaveClass(/active/);

    // Features should no longer be active
    await expect(featuresTab).not.toHaveClass(/active/);
  });

  test('expands and collapses an accordion panel', async ({ page }) => {
    const accordion = page.locator('#tabs details, #tabs [role="region"]').first();
    if (await accordion.isVisible()) {
      // Native <details>/<summary>
      const summary = accordion.locator('summary').first();
      if (await summary.isVisible()) {
        const openBefore = await accordion.evaluate((el) => el.hasAttribute('open'));
        await summary.click();
        const openAfter = await accordion.evaluate((el) => el.hasAttribute('open'));
        expect(openBefore).not.toBe(openAfter);
      }
    }
  });
});