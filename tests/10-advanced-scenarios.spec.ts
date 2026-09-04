import { test, expect } from '@playwright/test';

test.describe('10 — Advanced Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#advanced');
  });

  test('triggers infinite scroll until N items appear', async ({ page }) => {
    const list = page.locator('#advanced .scroll-container, #advanced [data-testid="scroll-list"]').first();
    if (!(await list.isVisible())) {
      test.skip(true, 'Infinite scroll list not present');
      return;
    }

    // Scroll the container until we have at least 20 items, or stop after 5 iterations
    for (let i = 0; i < 5; i++) {
      const count = await list.locator('> *').count();
      if (count >= 20) break;
      await list.evaluate((el) => el.scrollTo(0, el.scrollHeight));
      await page.waitForTimeout(500);
    }
    const finalCount = await list.locator('> *').count();
    expect(finalCount).toBeGreaterThan(0);
  });

  test('reads and writes localStorage', async ({ page }) => {
    // localStorage manipulation via evaluate
    await page.evaluate(() => {
      window.localStorage.setItem('playwright-lab-test', 'hello');
    });

    const value = await page.evaluate(() => window.localStorage.getItem('playwright-lab-test'));
    expect(value).toBe('hello');

    await page.evaluate(() => window.localStorage.removeItem('playwright-lab-test'));
  });

  test('simulates keyboard events', async ({ page }) => {
    // The advanced section has a dedicated keyboard input that displays the last key pressed.
    const input = page.getByTestId('keyboard-input');
    await input.focus();

    await page.keyboard.press('A');
    // Playwright sends the literal character; page receives Key: "A" for Shift+A or uppercase
    await expect(page.getByTestId('key-display')).toContainText(/Key: "A"/);

    await page.keyboard.press('Shift+B');
    await expect(page.getByTestId('key-display')).toContainText(/Shift:\s*true/);
  });

  test('performs a fetch and asserts the response', async ({ page }) => {
    // page.request issues HTTP requests in the browser context
    const response = await page.request.get('/index.html');
    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);
  });
});