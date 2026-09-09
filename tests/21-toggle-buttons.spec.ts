import { test, expect } from '@playwright/test';

test.describe('21 — Toggle Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#interactions');
  });

  test('toggles B/I/U formatting buttons inside the context-menu card', async ({ page }) => {
    // No dedicated toggle-buttons card on the page; the B/I/U buttons live
    // inside the context-menu card (#interactions).
    const card = page.getByTestId('context-menu-card');

    const bold = card.getByTestId('toggle-bold');
    const italic = card.getByTestId('toggle-italic');

    await bold.click();
    await expect(bold).toHaveClass(/active/);

    await italic.click();
    await expect(italic).toHaveClass(/active/);
  });
});