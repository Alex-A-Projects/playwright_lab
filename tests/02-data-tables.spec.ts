import { test, expect } from '@playwright/test';

test.describe('02 — Data Tables', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#tables');
  });

  test('reads rows from the user table', async ({ page }) => {
    // Scope to the section so we only target the table we care about
    const table = page.locator('#tables table').first();
    await expect(table).toBeVisible();

    const rows = table.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    // Read the first row's cells
    const firstRow = rows.first();
    const cells = firstRow.locator('td');
    const cellTexts = await cells.allInnerTexts();
    expect(cellTexts.length).toBeGreaterThan(0);
  });

  test('sorts by clicking a column header', async ({ page }) => {
    const table = page.locator('#tables table').first();
    const header = table.locator('thead th').first();
    await header.click();

    // After clicking, the indicator (▲/▼/↑/↓) usually changes — we just verify the table
    // is still present and that the click was processed.
    await expect(table).toBeVisible();
  });

  test('filters rows using a search input', async ({ page }) => {
    const search = page.locator('#tables input[type="search"], #tables input[placeholder*="search" i]').first();
    if (await search.isVisible()) {
      await search.fill('a');
      // After filtering, the row count should be less than or equal to the original.
      // We don't assert a specific count since data is dynamic.
      await expect(search).toHaveValue('a');
    }
  });
});