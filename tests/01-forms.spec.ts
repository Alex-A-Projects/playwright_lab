import { test, expect } from '@playwright/test';

test.describe('01 — Form Elements', () => {
  test.beforeEach(async ({ page }) => {
    // The page under test embeds ad scripts (Google AdSense + highrevenueformat.com)
    // that issue unwanted redirects to ad networks (nn125.com, blxwnnw.com, etc.).
    // Block those third-party ad/tracker requests so the page stays put.
    await page.route(
      /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
      (route) => route.abort()
    );

    await page.goto('/index.html#forms');

  });

  test('fills the registration form using accessible locators', async ({ page }) => {
    // Scope all locators to the #forms section so they don't collide with
    // overlapping fields in the shopping checkout (e.g. "Full Name" / "Phone").
    const forms = page.locator('#forms');

    // getByLabel is the preferred way to interact with form fields
    await forms.getByLabel(/^full name/i).fill('Alex Tester');
    await forms.getByLabel(/email/i).fill('alex@example.com');
    // Use ^password$ so we don't also match the "Toggle password visibility" aria-label
    await forms.getByLabel(/^password/i).fill('Sup3rSecret!');
    await forms.getByLabel(/phone/i).fill('555-123-4567');
    await forms.getByLabel(/date of birth|dob/i).fill('1990-05-15');

    // selectOption works for native <select>
    // The #forms section also contains a disabled #cascadeCountry with the same "Country" label,
    // so we target the primary one explicitly via its unique test ID.
    await forms.getByTestId('select-country').selectOption('United States');

    // Radio groups: getByRole with name
    await forms.getByRole('radio', { name: /female/i }).check();

    // Checkboxes for multi-select skills
    // (Available skills are JavaScript, Python, Java, C# — no TypeScript.)
    await forms.getByRole('checkbox', { name: /javascript/i }).check();
    await forms.getByRole('checkbox', { name: /python/i }).check();

    await forms.getByLabel(/bio/i).fill('Learning Playwright.');
    await forms.getByRole('checkbox', { name: /terms/i }).check();

    // Assertion: form submission triggers a confirmation
    await forms.getByRole('button', { name: /submit|register|sign up/i }).first().click();
    await expect(forms.getByText(/success|registered|thank you/i)).toBeVisible();
  });

  test('interacts with range slider and color picker', async ({ page }) => {
    // Fill accepts string for range inputs; the value attribute is the min..max range
    const slider = page.locator('input[type="range"]').first();
    await slider.fill('7');
    await expect(slider).toHaveValue('7');

    // Color picker — setting value directly via JS, since fill() doesn't work on input[type=color]
    const colorInput = page.locator('input[type="color"]').first();
    await colorInput.evaluate((el: HTMLInputElement) => {
      el.value = '#ff5733';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(colorInput).toHaveValue('#ff5733');
  });
});