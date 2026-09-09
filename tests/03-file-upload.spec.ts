import { test, expect } from '@playwright/test';

test.describe('03 — File Upload', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );
    await page.goto('/index.html#forms');
  });

  test('uploads two in-memory files and lists both', async ({ page }) => {
    // Payloads are built as Uint8Array (what the project's Buffer shim aliases to),
    // so nothing has to exist on disk. The file input is hidden — setInputFiles handles that.
    const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    await page.getByTestId('file-input').setInputFiles([
      { name: 'avatar.png', mimeType: 'image/png', buffer: pngHeader },
      { name: 'resume.pdf', mimeType: 'application/pdf', buffer: new TextEncoder().encode('%PDF-1.4') },
    ]);

    const fileList = page.getByTestId('file-list');
    await expect(fileList).toContainText('avatar.png');
    await expect(fileList).toContainText('resume.pdf');
    await expect(page.getByTestId('file-item-avatar.png')).toBeVisible();
  });
});
