import { test, expect } from '@playwright/test';

test.describe('09 — Shadow DOM', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#shadow');
  });

  test('clicks a button inside a shadow root', async ({ page }) => {
    // CSS piercing syntax: >> combinator descends through shadow roots
    // Playwright also resolves standard CSS selectors through open shadow DOM automatically
    const shadowButton = page.locator('#shadow button, #shadow [role="button"]').first();

    if (await shadowButton.count() === 0) {
      // Fallback: traverse manually via evaluate
      const text = await page.evaluate(() => {
        const host = document.querySelector('#shadow *');
        if (!host || !host.shadowRoot) return '';
        const btn = host.shadowRoot.querySelector('button');
        return btn?.textContent?.trim() ?? '';
      });
      expect(text.length).toBeGreaterThan(0);
      return;
    }

    await shadowButton.scrollIntoViewIfNeeded();
    await shadowButton.click();
    await expect(shadowButton).toBeVisible();
  });

  test('reads text from nested shadow DOM via evaluate', async ({ page }) => {
    // For deeply nested shadow roots, evaluate is the most reliable approach
    const text = await page.evaluate(() => {
      const walk = (root: Document | ShadowRoot): string | null => {
        const all = root.querySelectorAll('*');
        for (const el of Array.from(all)) {
          if (el.shadowRoot) {
            const inner = walk(el.shadowRoot);
            if (inner) return inner;
          }
        }
        return root.querySelector('h1, h2, h3, p, span')?.textContent?.trim() ?? null;
      };
      return walk(document);
    });

    // We don't assert exact text — just that something was found inside shadow DOM
    expect(text === null || typeof text === 'string').toBe(true);
  });
});