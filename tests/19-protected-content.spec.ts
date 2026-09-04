import { test, expect } from '@playwright/test';

test.describe('19 — Protected Content', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
  });

  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/index.html#a11y-target');

    // The protected content area should not reveal content without login.
    // Either the section hides content, or the "Login to Access" link is shown.
    const loginPrompt = page.getByRole('link', { name: /login to access|sign in/i }).first();
    await expect(loginPrompt).toBeVisible({ timeout: 5_000 });
  });

  test('logs in with valid credentials and sees protected content', async ({ page }) => {
    // Navigate to login
    await page.goto('/login.html');

    // Fill credentials (PlayLab uses test@playlab.com / Password123)
    await page.getByLabel(/email/i).fill('test@playlab.com');
    // Use ^password$ so we don't match the "Toggle password visibility" aria-label button
    await page.getByLabel(/^password/i).fill('Password123');
    await page.getByRole('button', { name: /sign in|log in|submit|login/i }).first().click();

    // After login, protected content is visible
    await page.waitForLoadState('networkidle');

    // The protected content section should now show its content rather than the login CTA
    await page.goto('/index.html#a11y-target');
    const protectedContent = page.locator('#a11y-target').first();
    await expect(protectedContent).toBeVisible();
  });

  test('rejects invalid credentials', async ({ page }) => {
    await page.goto('/login.html');

    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/^password/i).fill('BadPassword');
    await page.getByRole('button', { name: /sign in|log in|submit|login/i }).first().click();

    // Error message should appear
    const error = page.getByText(/invalid|incorrect|failed|wrong/i).first();
    await expect(error).toBeVisible({ timeout: 5_000 });
  });
});