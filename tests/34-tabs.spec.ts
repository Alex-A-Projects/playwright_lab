import { test, expect } from '@playwright/test';

test.describe('34 — Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#tabsAccordion');
  });

  test('switches active tab when a tab button is clicked', async ({ page }) => {
    const featuresBtn = page.getByTestId('tab-btn-2');
    await featuresBtn.click();
    await expect(featuresBtn).toHaveClass(/active/);
    await expect(page.getByTestId('tab-content-2')).toHaveClass(/active/);
  });
});