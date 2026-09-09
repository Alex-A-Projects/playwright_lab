# playwright_lab

A Playwright practice arena — a collection of end-to-end tests written against the
[PlayLab](https://playwrightlab.github.io) practice site, covering common (and a few
uncommon) web-automation scenarios.

The goal of this repo is **not** to ship a product — it's a hands-on lab for
exploring Playwright's API surface: accessible locators, network interception,
shadow DOM, iframes, accessibility, responsive viewports, and more.

## Stack

- [Playwright Test](https://playwright.dev/docs/intro) `@playwright/test` `^1.62.1`
- TypeScript (`strict: true`, `target: ES2022`)
- Chromium (Desktop Chrome) as the active project
- HTML + list reporters

## Getting started

```bash
# Install dependencies
npm install

# Install Playwright browsers (only Chromium is configured)
npx playwright install chromium

# Run the full suite
npx playwright test

# Run a single spec by name pattern
npx playwright test 01-forms

# Run in headed mode to watch the browser
npx playwright test --headed

# Open the HTML report after a run
npx playwright show-report
```

## Project layout

```
playwright_lab/
├── playwright.config.ts      # Test runner config (base URL, projects, reporters)
├── tsconfig.json             # TypeScript config for tests and config
├── package.json
└── tests/                    # 71 spec files, one per UI tile on the practice site
    ├── 01-registration-form.spec.ts
    ├── 02-sliders-range.spec.ts
    ├── 03-file-upload.spec.ts
    ├── ...                   # see table below for the full list (71 total)
    └── 71-protected-area.spec.ts
```

## Test scenarios at a glance

One file per UI tile on the [PlayLab](https://playwrightlab.github.io) practice site — 71 specs total. Each file holds a single `test()` scoped to its section anchor, so the suite reads top-to-bottom in the same order the page presents its widgets.

| # | File | Section | What it exercises |
|---|------|---------|-------------------|
| 01 | `01-registration-form.spec.ts` | `#forms` | Filling the full registration form via accessible locators and asserting the success banner |
| 02 | `02-sliders-range.spec.ts` | `#forms` | Range slider + native color picker |
| 03 | `03-file-upload.spec.ts` | `#forms` | `setInputFiles` with in-memory buffers; asserts `file-list` populates |
| 04 | `04-auto-suggest.spec.ts` | `#forms` | Type-and-filter autocomplete; picks a suggestion and asserts the selected tag |
| 05 | `05-multi-select.spec.ts` | `#forms` | Native `<select multiple>`; selects 3 frameworks and asserts the result |
| 06 | `06-dropdown-variants.spec.ts` | `#forms` | Asserts all 8 dropdown-variant cards are mounted |
| 07 | `07-custom-dropdown.spec.ts` | `#forms` | Click-to-open custom dropdown with styled `<li>` options |
| 08 | `08-searchable-dropdown.spec.ts` | `#forms` | Type-to-filter list, then pick a city |
| 09 | `09-grouped-options.spec.ts` | `#forms` | `<select>` with `<optgroup>` — verifies option + group label both appear |
| 10 | `10-cascading-dropdowns.spec.ts` | `#forms` | Continent → country → city, each step auto-waits for the next select to enable |
| 11 | `11-multi-select-checkboxes.spec.ts` | `#forms` | Checkbox-style multi-select inside a styled dropdown |
| 12 | `12-disabled-options.spec.ts` | `#forms` | Asserts `<option disabled>` are blocked, enabled options still work |
| 13 | `13-focus-gated-dropdown.spec.ts` | `#forms` | Options mount into DOM only while focused (OrangeHRM-style) |
| 14 | `14-delayed-dropdown.spec.ts` | `#forms` | 2-second simulated API load before the select becomes usable |
| 15 | `15-user-management.spec.ts` | `#tables` | User table with search; asserts row filtering |
| 16 | `16-inline-editable-table.spec.ts` | `#tables` | Inline cell editing — edit quantity, assert row total updates |
| 17 | `17-dynamic-table.spec.ts` | `#tables` | Table that mounts on demand; asserts rows and columns |
| 18 | `18-drag-drop.spec.ts` | `#interactions` | `dragTo` from a list into a drop zone |
| 19 | `19-hover-effects.spec.ts` | `#interactions` | Hover-triggered tooltip |
| 20 | `20-context-menu.spec.ts` | `#interactions` | Right-click context menu; click an item and assert result |
| 21 | `21-toggle-buttons.spec.ts` | `#interactions` | B/I/U toggles inside the context-menu card |
| 22 | `22-available-offers.spec.ts` | `#shopping` | Coupon chips; applies `FLAT10` and asserts confirmation |
| 23 | `23-shopping-cart.spec.ts` | `#shopping` | Add-to-cart updates count and items list |
| 24 | `24-delayed-loading.spec.ts` | `#dynamic` | Select a delay, click load, assert content appears |
| 25 | `25-visibility-controls.spec.ts` | `#dynamic` | Show/hide buttons toggle element visibility |
| 26 | `26-start-stop-toggle.spec.ts` | `#dynamic` | Start/Stop control inside the visibility card |
| 27 | `27-counter-timer.spec.ts` | `#dynamic` | Increment, decrement, reset a counter |
| 28 | `28-auto-updating-timer.spec.ts` | `#dynamic` | Timer that ticks on its own |
| 29 | `29-progress-indicators.spec.ts` | `#dynamic` | Click start; progress bar fills 0% → 100% |
| 30 | `30-modal-dialogs.spec.ts` | `#modals` | Open, assert, close a modal overlay |
| 31 | `31-notifications.spec.ts` | `#modals` | Toast buttons render success/error/warning/info toasts |
| 32 | `32-native-dialogs.spec.ts` | `#modals` | `window.confirm()` handled via `page.on('dialog')` |
| 33 | `33-inline-alerts.spec.ts` | `#modals` | Static success/error/warning/info alerts visible on load |
| 34 | `34-tabs.spec.ts` | `#tabsAccordion` | Click each tab, assert matching panel becomes active |
| 35 | `35-accordion.spec.ts` | `#tabsAccordion` | Click headers to expand/collapse sections |
| 36 | `36-iframe.spec.ts` | `#frames` | `frameLocator` into a same-origin iframe |
| 37 | `37-nested-frames.spec.ts` | `#frames` | Chained `frameLocator` for iframe-inside-iframe |
| 38 | `38-external-iframe.spec.ts` | `#frames` | External iframe (asserts `src` since X-Frame-Options may block interaction) |
| 39 | `39-window-handling.spec.ts` | `#frames` | Open new tab with `context.waitForEvent('page')` |
| 40 | `40-download-testing.spec.ts` | `#advanced` | `page.waitForEvent('download')`; assert filename |
| 41 | `41-shadow-dom-elements.spec.ts` | `#shadow` | Click into an open shadow root |
| 42 | `42-nested-shadow-dom.spec.ts` | `#shadow` | Pierce nested shadow roots |
| 43 | `43-infinite-scroll.spec.ts` | `#advanced` | Scroll container to bottom, assert items load |
| 44 | `44-clipboard-keys.spec.ts` | `#advanced` | Type via keyboard, observe keystroke display |
| 45 | `45-api-network.spec.ts` | `#network` | Click fetch-data button, assert result div populates |
| 46 | `46-local-storage.spec.ts` | `#advanced` | Read/write/clear a key on `window.localStorage` |
| 47 | `47-image-gallery.spec.ts` | `#advanced` | Click thumbnail, assert lightbox opens with image |
| 48 | `48-personal-information.spec.ts` | `#wizard` | Fill wizard step 1, click Next, assert step 2 active |
| 49 | `49-cookie-consent.spec.ts` | header banner | Click accept, assert banner hidden and `playlab-cookies` set |
| 50 | `50-carousel-slider.spec.ts` | `#carousel` | Disable autoplay, click next, assert slide 2 of 4 active |
| 51 | `51-fetch-users-api.spec.ts` | `#network` | Click Fetch Users, assert JSON result + status |
| 52 | `52-submit-data-api.spec.ts` | `#network` | Fill title + body, submit POST, assert "Created" status |
| 53 | `53-slow-api-timeout.spec.ts` | `#network` | Pick a delay, click call, wait for the response |
| 54 | `54-error-responses.spec.ts` | `#network` | Trigger 404, assert error JSON in result |
| 55 | `55-random-appear.spec.ts` | `#flaky` | Poll for a randomly-timed element to appear |
| 56 | `56-delayed-button.spec.ts` | `#flaky` | Click spawn, wait for dynamically inserted button, click it |
| 57 | `57-changing-text.spec.ts` | `#flaky` | Capture initial text, assert it changes, click action when it appears |
| 58 | `58-calendar-picker.spec.ts` | `#datepicker` | Open popover, click "today", assert input populated |
| 59 | `59-typable-date.spec.ts` | `#datepicker` | Type a date string, assert parsed result |
| 60 | `60-month-year-picker.spec.ts` | `#datepicker` | Open calendar, click "today" in month/year view |
| 61 | `61-date-range.spec.ts` | `#datepicker` | Fill start + end, click calc, assert duration |
| 62 | `62-video-player.spec.ts` | `#media` | Play a `<video>` element, assert `paused === false` |
| 63 | `63-audio-player.spec.ts` | `#media` | Play an `<audio>` element, assert `paused === false` |
| 64 | `64-keyboard-navigation.spec.ts` | `#a11y` | Tab between buttons, assert focus moves and result updates |
| 65 | `65-skip-link.spec.ts` | `#a11y` | Click skip link, assert URL has `#a11y-target` and target visible |
| 66 | `66-aria-attributes.spec.ts` | `#a11y` | Use `getByRole('searchbox')`, assert live region update |
| 67 | `67-aria-expanded-controls.spec.ts` | `#a11y` | Click expand button, assert `aria-expanded` flips to `"true"` |
| 68 | `68-focus-trap.spec.ts` | `#a11y` | Tab inside a trapped area, assert focus stays inside |
| 69 | `69-viewport-aware-elements.spec.ts` | `#responsive` | Default viewport, assert desktop-only and always-visible render |
| 70 | `70-responsive-layout-change.spec.ts` | `#responsive` | Switch between 375×667 and 1280×720, assert visibility flips |
| 71 | `71-protected-area.spec.ts` | `#protected` | Seed auth via `addInitScript`, assert protected content unlocks |

## Configuration highlights

See [playwright.config.ts](playwright.config.ts):

- **`baseURL`** is `https://playwrightlab.github.io` — specs navigate via
  `page.goto('/index.html#section')`.
- **Single project: Chromium / Desktop Chrome.** Add more devices under
  `projects:` if you want Firefox or WebKit coverage.
- **CI-aware settings:** `forbidOnly`, retries (`2`), and `workers: 1` kick in
  automatically when `process.env.CI` is set. Locally, tests run in parallel with
  the default worker count.
- **Reporters:** `list` for the terminal, `html` (saved to `playwright-report/`,
  never auto-opened).
- **Per-test artifacts:**
  - `trace: 'on-first-retry'` — capture a trace only when a retry happens.
  - `screenshot: 'only-on-failure'` — screenshot failed assertions.
  - `video: 'retain-on-failure'` — keep video for failed tests.
- **Timeouts:** `actionTimeout: 10s`, `navigationTimeout: 30s`.

## A note about ads on the practice site

The PlayLab pages embed third-party ad scripts (Google AdSense,
`highrevenueformat.com`, etc.) that can redirect you to ad networks
(`nn125.com`, `blxwnnw.com`, …). Every spec that touches a page blocks these
hosts in `beforeEach`:

```ts
await page.route(
  /googlesyndication\.com|googletagmanager\.com|doubleclick\.net|highrevenueformat\.com|nn125\.com|blxwnnw\.com/,
  (route) => route.abort()
);
```

If you add new specs, copy the same `page.route` block so the page doesn't
bounce you mid-test.

## Conventions used in the tests

- **Prefer accessible locators** first:
  - `page.getByRole('button', { name: /submit/i })`
  - `page.getByLabel(/email/i)`
  - `page.getByTestId('...')` when DOM structure doesn't expose a role/label.
- **Scope locators** to the section under test (e.g. `page.locator('#forms')`)
  when the page has multiple similar fields across sections.
- **Regex labels** (`/^password$/`) are used to disambiguate from related
  controls (e.g. a "Toggle password visibility" button).
- **Color inputs** don't accept `fill()` — set the value via `evaluate` and
  dispatch `input` + `change` events.

## Useful scripts

```bash
# Run a single test by title (grep)
npx playwright test -g "fills the registration form"

# Re-run only the tests that failed in the last run
npx playwright test --last-failed

# Debug interactively
npx playwright test --debug

# Generate tests (codegen)
npx playwright codegen https://playwrightlab.github.io
```

## Reporting & artifacts

After a run, look in:

- `playwright-report/` — HTML report (`npx playwright show-report`)
- `test-results/` — per-test artifacts on failure (screenshots, videos, traces)

Both directories are gitignored.

## Contributing

This is a personal practice repo — open a PR or just edit locally. If you add
a new spec:

1. Number it (`NN-kebab-case-name.spec.ts`) so it slots into the existing
   1–71 order. The numbering follows the order widgets appear on the practice
   site.
2. Block the ad hosts in `beforeEach` (copy the regex from any existing spec).
3. Prefer accessible locators; fall back to `getByTestId` only when needed.
4. Keep tests self-contained — one `test()` per file, no shared state.

## License

ISC (per [package.json](package.json)).
