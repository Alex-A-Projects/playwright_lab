import { test, expect } from '@playwright/test';

test.describe('06 — Dropdown Variants', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('renders every dropdown variant card in the grid', async ({ page }) => {
    // The grid wrapper carries an id but no data-testid, so the cards inside are the contract.
    await expect(page.locator('#dropdownsGrid')).toBeVisible();

    const cards = [
      'custom-dropdown-card', 'searchable-dropdown-card', 'grouped-dropdown-card', 'cascading-dropdown-card',
      'checkbox-dropdown-card', 'disabled-options-card', 'focus-dropdown-card', 'delayed-dropdown-card',
    ];
    for (const card of cards) {
      await expect(page.getByTestId(card)).toBeVisible();
    }
  });
});
