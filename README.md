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
└── tests/                    # Spec files — one describe block per scenario
    ├── 01-forms.spec.ts
    ├── 02-data-tables.spec.ts
    ├── 03-interactions.spec.ts
    ├── 04-shopping.spec.ts
    ├── 05-dynamic-content.spec.ts
    ├── 06-modals-alerts.spec.ts
    ├── 07-tabs-accordion.spec.ts
    ├── 08-frames-windows.spec.ts
    ├── 09-shadow-dom.spec.ts
    ├── 10-advanced-scenarios.spec.ts
    ├── 11-wizard.spec.ts
    ├── 12-carousel.spec.ts
    ├── 13-network-api.spec.ts
    ├── 14-flaky-elements.spec.ts
    ├── 15-date-picker.spec.ts
    ├── 16-media-player.spec.ts
    ├── 17-accessibility.spec.ts
    ├── 18-responsive.spec.ts
    └── 19-protected-content.spec.ts
```

## Test scenarios at a glance

| # | File | What it exercises |
|---|------|-------------------|
| 01 | `01-forms.spec.ts` | Form filling via accessible locators (`getByLabel`, `getByRole`), range sliders, color picker |
| 02 | `02-data-tables.spec.ts` | Table parsing, row/column traversal |
| 03 | `03-interactions.spec.ts` | Drag-and-drop, hover, keyboard input |
| 04 | `04-shopping.spec.ts` | Checkout-style flow with overlapping labels |
| 05 | `05-dynamic-content.spec.ts` | Elements that mount/unmount after load |
| 06 | `06-modals-alerts.spec.ts` | Native `dialog` handlers, modal dialogs |
| 07 | `07-tabs-accordion.spec.ts` | Tab panels and collapsible sections |
| 08 | `08-frames-windows.spec.ts` | `iframe` scoping, multi-window flows |
| 09 | `09-shadow-dom.spec.ts` | Piercing open and closed shadow roots |
| 10 | `10-advanced-scenarios.spec.ts` | File upload/download, large forms |
| 11 | `11-wizard.spec.ts` | Multi-step wizard navigation and state |
| 12 | `12-carousel.spec.ts` | Carousel/slider controls |
| 13 | `13-network-api.spec.ts` | `page.request`, request mocking via `page.route` |
| 14 | `14-flaky-elements.spec.ts` | Strategies for slow/race-condition UI |
| 15 | `15-date-picker.spec.ts` | Date input variations |
| 16 | `16-media-player.spec.ts` | HTML5 media controls |
| 17 | `17-accessibility.spec.ts` | Keyboard nav, skip links, ARIA roles |
| 18 | `18-responsive.spec.ts` | Multi-viewport checks |
| 19 | `19-protected-content.spec.ts` | Auth-gated UI |

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

1. Number it (`20-...spec.ts`) to match the existing order.
2. Block the ad hosts in `beforeEach`.
3. Prefer accessible locators; fall back to `getByTestId` only when needed.
4. Keep tests self-contained — no shared mutable state across files.

## License

ISC (per [package.json](package.json)).
