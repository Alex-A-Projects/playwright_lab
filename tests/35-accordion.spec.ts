import { test, expect } from '@playwright/test';

test.describe('35 — Accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#tabsAccordion');
  });

  test('opens a closed accordion panel', async ({ page }) => {
    const header = page.getByTestId('accordion-header-2');
    const body = page.getByTestId('accordion-body-2');
    await expect(body).not.toHaveClass(/open/);
    await header.click();
    await expect(header).toHaveClass(/active/);
    await expect(body).toHaveClass(/open/);
  });
});