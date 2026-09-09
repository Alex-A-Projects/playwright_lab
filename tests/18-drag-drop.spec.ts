import { test, expect } from '@playwright/test';

test.describe('18 — Drag & Drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#interactions');
  });

  test('drags a task item into the drop zone', async ({ page }) => {
    const card = page.getByTestId('dnd-card');
    const source = card.getByTestId('dnd-item-1');
    const target = card.getByTestId('drop-zone');

    // dragAndDrop uses the page's native DnD plumbing
    await source.dragTo(target);

    // The dragged item leaves the list and appears in the drop zone
    await expect(target).toContainText(/Check emails/);
    await expect(card.getByTestId('dnd-item-1')).toHaveCount(0);
  });
});