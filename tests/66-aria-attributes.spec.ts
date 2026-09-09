import { test, expect } from '@playwright/test';

test.describe('66 — ARIA Attributes', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#a11y');
  });

  test('search input updates the aria-live region with results', async ({ page }) => {
    const search = page.getByRole('searchbox', { name: /search/i });
    await search.fill('an');
    await expect(page.getByTestId('a11y-live-region')).toHaveText(/result/i);
    await search.fill('zzzzz');
    await expect(page.getByTestId('a11y-live-region')).toHaveText(/no results/i);
  });
});
