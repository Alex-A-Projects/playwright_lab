import { test, expect } from '@playwright/test';

test.describe('15 — User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#tables');
  });

  test('narrows the user table with the search box', async ({ page }) => {
    const rows = page.getByTestId('table-body').getByRole('row');
    await expect(rows).toHaveCount(5); // default page size is "5 per page"

    await page.getByTestId('table-search').fill('alice');

    await expect(rows).toHaveCount(1);
    await expect(page.getByTestId('table-row-1')).toContainText('alice@example.com');
    await expect(page.getByTestId('table-info')).toContainText(/of 1 entries/);
  });
});
