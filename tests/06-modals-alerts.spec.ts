import { test, expect } from '@playwright/test';

test.describe('06 — Modals & Alerts', () => {
  test.beforeEach(async ({ page }) => {
    // Block ad/tracker requests that cause unwanted redirects
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#modals');
  });

  test('opens a modal dialog', async ({ page }) => {
    const openBtn = page.getByRole('button', { name: /open modal|show modal/i }).first();
    await openBtn.click();
    const dialog = page.getByRole('dialog').first();
    await expect(dialog).toBeVisible();
  });

  test('closes the modal with the Cancel button', async ({ page }) => {
    const openBtn = page.getByRole('button', { name: /open modal|show modal/i }).first();
    await openBtn.click();
    const dialog = page.getByRole('dialog').first();
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: /cancel|close/i }).first().click();
    await expect(dialog).toBeHidden();
  });

  test('handles a native confirm dialog by accepting', async ({ page }) => {
    // page.on('dialog') must be registered BEFORE the dialog opens
    let dialogType = '';
    let dialogMessage = '';
    page.once('dialog', async (dialog) => {
      dialogType = dialog.type();
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    // The native-confirm button is the one that actually opens a window.confirm()
    const confirmBtn = page.getByTestId('native-confirm');
    await confirmBtn.click();

    // After acceptance, the page writes the result to #nativeResult
    await expect(page.getByTestId('native-result')).toHaveText(/Confirm result:\s*true/, { timeout: 5_000 });
    expect(dialogType).toBe('confirm');
    expect(dialogMessage.length).toBeGreaterThan(0);
  });

  test('handles a native prompt by entering text', async ({ page }) => {
    const promptValue = 'Playwright input';
    page.once('dialog', async (dialog) => {
      // Only respond to a prompt; if anything else pops up, dismiss it
      if (dialog.type() === 'prompt') {
        await dialog.accept(promptValue);
      } else {
        await dialog.accept();
      }
    });

    // The native-prompt button is the one that actually opens a window.prompt()
    const promptBtn = page.getByTestId('native-prompt');
    await promptBtn.click();

    // The page writes the entered value to #nativeResult
    await expect(page.getByTestId('native-result')).toHaveText(/Prompt result:.*Playwright input/, { timeout: 5_000 });
  });

  test('asserts a toast notification appears', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /show toast|success|notify/i }).first();
    await trigger.click();
    // Toasts typically have role=status or role=alert
    const toast = page.locator('[role="status"], [role="alert"], .toast').first();
    await expect(toast).toBeVisible({ timeout: 5_000 });
  });
});