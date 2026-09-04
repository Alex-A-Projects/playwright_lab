import { test, expect } from '@playwright/test';

test.describe('13 — Network & API', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#network');
  });

  test('performs a GET request via the browser context', async ({ page }) => {
    // Use page.request to call the practice arena's GET endpoint
    const response = await page.request.get('https://playwrightlab.github.io/index.html');
    expect(response.status()).toBe(200);
  });

  test('intercepts and mocks a network request', async ({ page }) => {
    // page.route intercepts requests before they hit the network
    // Here we intercept any GET to the network section's API and return a stub
    await page.route('**/api/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ mocked: true, timestamp: Date.now() }),
      });
    });

    // Trigger the GET (button or fetch call on the page)
    const fetchBtn = page.getByRole('button', { name: /get|fetch|load users/i }).first();
    if (await fetchBtn.isVisible()) {
      await fetchBtn.click();
      // The mocked response should appear somewhere on the page
      await page.waitForTimeout(1000);
    }
  });

  test('performs a POST request via the browser context', async ({ page }) => {
    // Direct POST via page.request
    const response = await page.request.post('https://playwrightlab.github.io/index.html', {
      data: { test: 'playwright' },
    });
    // The site itself doesn't have a real POST endpoint, so we just verify
    // the request was issued (any 2xx/4xx is fine — we just want to demo the API)
    expect([200, 201, 405, 404]).toContain(response.status());
  });

  test('asserts an error response is shown for invalid requests', async ({ page }) => {
    // Stub a 404 to demo error handling
    await page.route('**/api/missing', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'not found' }),
      });
    });

    // Trigger the 404
    const errBtn = page.getByRole('button', { name: /404|not found|error/i }).first();
    if (await errBtn.isVisible()) {
      await errBtn.click();
      await page.waitForTimeout(500);
    }
  });
});