import { test, expect } from '@playwright/test';

test.describe('04 — Auto-Suggest', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('picks a suggestion and renders it as a tag', async ({ page }) => {
    // Suggestions are mounted on input and torn down on blur, so never lose focus mid-flow.
    await page.getByTestId('autocomplete-input').fill('java');
    await expect(page.getByTestId('autocomplete-option-java')).toBeVisible();

    await page.getByTestId('autocomplete-option-javascript').click();

    await expect(page.getByTestId('selected-tags')).toContainText('JavaScript');
    await expect(page.getByTestId('tag-javascript')).toBeVisible();
  });
});
