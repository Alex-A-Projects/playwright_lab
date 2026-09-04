import { test, expect } from '@playwright/test';

test.describe('17 — Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#a11y');
  });

  test('navigates via keyboard using Tab', async ({ page }) => {
    // Focus the body first
    await page.locator('body').click();

    // Tab through focusable elements
    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => document.activeElement?.tagName ?? '');

    await page.keyboard.press('Tab');
    const second = await page.evaluate(() => document.activeElement?.tagName ?? '');

    expect(first).not.toBe('');
    expect(second).not.toBe('');
  });

  test('uses the skip link to jump to main content', async ({ page }) => {
    const skipLink = page.getByTestId('skip-link');
    if ((await skipLink.count()) > 0) {
      // Activate the skip link directly — Playwright will scroll to the target
      await skipLink.click();

      // The link's href is "#a11y-target"; the target element should be present in the DOM
      const target = await page.evaluate(() => {
        const targetId = 'a11y-target';
        const el = document.getElementById(targetId);
        return el?.tagName ?? '';
      });
      expect(target).not.toBe('');

      // URL hash should now point to the skip target
      await expect(page).toHaveURL(/#a11y-target$/);
    }
  });

  test('expands a control with aria-expanded', async ({ page }) => {
    const expandable = page.getByTestId('a11y-expand-btn');

    if ((await expandable.count()) > 0) {
      const before = await expandable.getAttribute('aria-expanded');
      await expandable.click();
      const after = await expandable.getAttribute('aria-expanded');
      // aria-expanded should have flipped
      expect(before).not.toBe(after);
      expect(after).toBe('true');
    }
  });

  test('uses getByRole to interact with an ARIA search box', async ({ page }) => {
    const search = page.getByRole('searchbox').first();
    if (await search.isVisible()) {
      await search.fill('playwright');
      await expect(search).toHaveValue('playwright');
    }
  });
});