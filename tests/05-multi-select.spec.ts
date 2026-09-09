import { test, expect } from '@playwright/test';

test.describe('05 — Multi-Select', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('selects three frameworks in one call', async ({ page }) => {
    const select = page.getByTestId('multi-select');
    await select.selectOption(['react', 'vue', 'svelte']);

    await expect(select).toHaveValues(['react', 'vue', 'svelte']);
    await expect(page.getByTestId('selected-frameworks')).toContainText(/React.*Vue\.js.*Svelte/);
  });
});
