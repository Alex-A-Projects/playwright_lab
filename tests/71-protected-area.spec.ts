import { test, expect } from '@playwright/test';

test.describe('71 — Protected Area', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    // Seed auth state before navigation so checkAuth() sees the protected area as unlocked.
    await page.addInitScript(() => {
      localStorage.setItem('playlab-auth', 'true');
      localStorage.setItem('playlab-user', 'Alex Tester');
    });
    await page.goto('/index.html#protected');
  });

  test('shows protected content when authenticated', async ({ page }) => {
    await expect(page.getByTestId('protected-content')).toBeVisible();
    await expect(page.getByTestId('protected-user')).toHaveText(/Alex Tester/);
    await expect(page.getByTestId('protected-locked')).toBeHidden();
  });
});
