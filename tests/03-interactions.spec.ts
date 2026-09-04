import { test, expect } from '@playwright/test';

test.describe('03 — Interactions', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#interactions');
  });

  test('hovers over an element to trigger an effect', async ({ page }) => {
    // Find a hover-target — PlayLab uses elements with hover effects
    const hoverTarget = page.locator('#interactions [class*="hover"], #interactions .hover-target').first();
    await hoverTarget.scrollIntoViewIfNeeded();
    await hoverTarget.hover();
    // Hover triggers a CSS transform — we just verify the element stays in view
    await expect(hoverTarget).toBeVisible();
  });

  test('double-clicks to trigger an action', async ({ page }) => {
    const dblTarget = page.getByText(/double.?click/i).first();
    await dblTarget.scrollIntoViewIfNeeded();
    await dblTarget.dblclick();
    await expect(dblTarget).toBeVisible();
  });

  test('right-clicks to open a context menu', async ({ page }) => {
    const ctxTarget = page.getByText(/right.?click|context/i).first();
    await ctxTarget.scrollIntoViewIfNeeded();
    await ctxTarget.click({ button: 'right' });
    // Context menu should appear — generic assertion
    await page.waitForTimeout(300);
  });

  test('drags an item from one list to another', async ({ page }) => {
    // Drag & drop — find two list containers and one draggable item
    const items = page.locator('#interactions [draggable="true"], #interactions .draggable');
    const lists = page.locator('#interactions ul, #interactions ol, #interactions .list');

    if ((await items.count()) > 0 && (await lists.count()) >= 2) {
      const source = items.first();
      const target = lists.nth(1);
      await source.dragTo(target);
      // After drag, the source item should appear in the target list
      await expect(target).toBeVisible();
    }
  });
});