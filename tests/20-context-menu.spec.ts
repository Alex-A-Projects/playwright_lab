import { test, expect } from '@playwright/test';

test.describe('20 — Context Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#interactions');
  });

  test('right-clicks the area and selects a context action', async ({ page }) => {
    const card = page.getByTestId('context-menu-card');
    const area = card.getByTestId('context-area');
    const menu = card.getByTestId('context-menu');

    await expect(menu).toBeHidden();

    // right-click mounts the menu at the cursor position
    await area.click({ button: 'right' });
    await expect(menu).toBeVisible();

    // Picking "Copy" stamps the result with the action label
    await card.getByTestId('ctx-copy').click();
    await expect(card.getByTestId('context-result')).toHaveText(/copy/i);
  });
});