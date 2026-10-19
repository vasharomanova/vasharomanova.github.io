# Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Віка's one-page Ukrainian landing page (English & Spanish tutoring) as specified.

**Architecture:** A static Astro page made of one component per section. All copy lives in `src/content/uk.ts`, and styling uses CSS custom properties in `src/styles/global.css`. A tiny inline script reveals the chosen language block based on the URL hash. Tests run against the built `dist/index.html` with `node:test`.

**Tech Stack:** Astro 7, plain CSS, `@fontsource/unbounded` and `@fontsource/manrope` (self-hosted fonts), Node 24 `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-19-landing-page-design.md`

## Global Constraints

- Copy comes verbatim from `copy-ukr.md` (git-ignored; only typos and punctuation may be fixed). Components never hard-code copy; they read it from `uk.ts`.
- `telegramUrl = "https://t.me/USERNAME"` is defined once in `uk.ts`.
- Palette: bg `#FFF6EA`, text `#3A2A22`, primary `#E8603C`, sun `#FFD25A`, sea `#2BA39A`; note tints `#FFE69A`, `#FFD0BF`, `#CDEDE9`.
- Fonts: Unbounded 600/700 for headings, Manrope 400/600/700 for body, Cyrillic + Latin subsets only.
- Straight-line decoration only: the awning strip at the top and bottom. No circles or blobs.
- `<html lang="uk">`, one `h1`, an `h2` per section, no top nav.
- No JS framework and no UI library.

## Review Focus

1. Hash present on load (`/#spanish`): the Spanish block opens without a click. Covered by the Task 4 browser check.
2. JS disabled: both language blocks are visible. Covered by the Task 4 test (the blocks have no `hidden` attribute in the HTML; JS hides them).
3. Unknown hash (`#foo`) or no hash: no block opens and nothing throws. Covered by the Task 4 browser check.
4. 320px-wide screen: no horizontal scroll, even with the long Unbounded headings (`overflow-wrap`, clamp font sizes). Covered by the Task 5 check.
5. White text on coral buttons fails AA (`#E8603C` vs `#fff` is about 3.2:1): use a darker coral `#C9471F` for button backgrounds. Covered by the Task 5 Lighthouse run.

---

### Task 1: Scaffold, copy, layout, test harness

**Files:**
- Delete: `src/components/Welcome.astro`, `src/assets/astro.svg`, `src/assets/background.svg`
- Create: `src/content/uk.ts`, `src/styles/global.css`, `tests/page.test.mjs`
- Modify: `src/layouts/Layout.astro`, `src/pages/index.astro`, `package.json`, `public/favicon.svg`; delete `public/favicon.ico`

**Interfaces:**
- Produces: `export const uk` in `uk.ts`, an object with keys `meta {title, description}`, `telegramUrl`, `hero`, `about`, `lessons`, `pricing`, `languages`, `details {english, spanish}`, `footer`. Each holds the strings for that section; list items are `string[]`. Prices are `{label, amount, note}[]`.
- Produces: `Layout.astro` with props `{ title: string; description: string }`.
- Produces: CSS vars `--bg --text --primary --primary-btn --sun --sea --note-1 --note-2 --note-3 --font-head --font-body`, plus classes `.awning`, `.btn`, `.btn--primary`, `.btn--secondary`, `.container`.

- [ ] Step 1: `npm i @fontsource/unbounded @fontsource/manrope`. Add the script `"test": "astro build && node --test tests/"`.
- [ ] Step 2: Write `tests/page.test.mjs`. It reads `dist/index.html` and asserts:
  - it contains `<html lang="uk"`;
  - `<title>` includes "Англійська та іспанська";
  - there is exactly one `<h1`;
  - the meta description and `og:title` exist.
- [ ] Step 3: Run `npm test`. It must fail (the starter page still shows).
- [ ] Step 4: Write `uk.ts` from `copy-ukr.md`, covering every block, including both language-detail blocks. Write `global.css` with the tokens, fonts (import the cyrillic + latin weight files), base typography (`overflow-wrap: anywhere` on headings, `clamp()` sizes), the awning (`repeating-linear-gradient(90deg, primary 0 28px, sun 28px 56px, sea 56px 84px)`, 12px tall), the buttons and `:focus-visible`. Write `Layout.astro` with lang, meta, OG/Twitter tags, the favicon and the global CSS. Make `index.astro` render the Layout with an `h1` from `uk.hero`. Make the favicon a coral "В" on cream.
- [ ] Step 5: Run `npm test`. It must pass.
- [ ] Step 6: Commit "Scaffold landing page: copy, layout, tokens".

### Task 2: StickyNote, TelegramButton, Hero, About

**Files:** Create `src/components/{StickyNote,TelegramButton,Hero,About}.astro`. Modify `index.astro`, `tests/page.test.mjs`.

**Interfaces:**
- `StickyNote.astro` props `{ tint?: 1 | 2 | 3; as?: 'div' | 'li' }` with slot content. It cycles the background `--note-{tint}`, rotation `-2deg / 1.5deg / -1deg` for tints 1/2/3, and a soft shadow. Under `prefers-reduced-motion: reduce` the transform is `none`.
- `TelegramButton.astro` props `{ label: string; variant?: 'primary' | 'secondary' }`. It renders `<a href={uk.telegramUrl} target="_blank" rel="noopener" class="btn ...">`.
- `Hero` has `id="top"`, holds the `h1`, and has two buttons: TelegramButton "Написати Віці" and `<a href="#languages" class="btn btn--secondary">Обрати мову</a>`.
- `About` has `id="about"`, an `h2`, the story, a photo placeholder (`<div role="img" aria-label="Фото Віки">`) and a facts row.

- [ ] Step 1: Add tests:
  - every `a[href^="https://t.me/"]` has `target="_blank"` and `rel` containing `noopener`;
  - at least 2 Telegram links exist;
  - there is a link `href="#languages"`;
  - the text "Хто я така" is present.
- [ ] Step 2: `npm test` must fail.
- [ ] Step 3: Implement the four components and add Hero + About to `index.astro`.
- [ ] Step 4: `npm test` must pass.
- [ ] Step 5: Commit "Add hero and about sections".

### Task 3: Lessons, Pricing

**Files:** Create `src/components/{Lessons,Pricing}.astro`. Modify `index.astro`, tests.

- Lessons: `id="lessons"`, intro paragraphs, a `<ul class="notes">` with the 6 "можна" items as `<StickyNote as="li" tint={i % 3 + 1}>`, then the closing paragraphs as plain text. The notes grid is 1 column below 480px, 2 columns from 480px and 3 from 900px.
- Pricing: `id="pricing"`, an `h2`, two notes (20 € / 30 € with their notes) and the materials sentence.

- [ ] Step 1: Add tests:
  - 6 `li` items inside `#lessons .notes`;
  - `#pricing` contains "20 €" and "30 €";
  - there are no `<h1` elements other than the first.
- [ ] Step 2: `npm test` must fail.
- [ ] Step 3: Implement both components and add them to the page.
- [ ] Step 4: `npm test` must pass.
- [ ] Step 5: Commit "Add lessons and pricing sections".

### Task 4: LanguagePicker, LanguageDetails, Footer, switch script

**Files:** Create `src/components/{LanguagePicker,LanguageDetails,Footer}.astro`. Modify `index.astro`, tests.

**Interfaces:**
- `LanguageDetails.astro` props `{ id: 'english' | 'spanish'; content: typeof uk.details.english }`. It renders `<section id={id} class="lang-details" data-lang-details>` with the headline, intro, "Що будемо робити?", "Як усе працює?", "Вартість", the CTA text and a TelegramButton.
- `LanguagePicker.astro`: `id="languages"`, an `h2`, two StickyNotes, each with its description and `<a href="#english|#spanish" class="btn" data-lang-link>`.
- Script (inline in LanguagePicker), in this order:
  - add `js-lang` to `<html>`. CSS `.js-lang [data-lang-details]:not(.is-open) { display: none }` means no-JS users see both blocks.
  - `open(id)`: set `is-open` on the matching block only; set `aria-current="true"` on the matching link and remove it from the other.
  - on link click, call `open` and `scrollIntoView({behavior: reduce ? 'auto' : 'smooth'})`, and update the hash with `history.replaceState`.
  - on load and on `hashchange`, if the hash is `#english` or `#spanish`, call `open`. Ignore any other hash.
- Footer: an `h2` or CTA text, a TelegramButton and the awning.

- [ ] Step 1: Add tests:
  - `#english` and `#spanish` exist, each with the `data-lang-details` attribute and no `hidden` attribute;
  - there are links to `#english` and `#spanish`;
  - each details block contains the "20 €" text and a Telegram link;
  - the page has at least 4 Telegram links.
- [ ] Step 2: `npm test` must fail.
- [ ] Step 3: Implement the components and the script, and add them to the page.
- [ ] Step 4: `npm test` must pass.
- [ ] Step 5: Browser check (Chrome DevTools MCP against `astro dev --background`):
  - clicking English opens it and Spanish stays hidden;
  - clicking Spanish swaps them;
  - loading `/#spanish` opens Spanish;
  - loading `/#foo` opens neither and logs no console errors.
- [ ] Step 6: Commit "Add language picker, details and footer".

### Task 5: Responsive and accessibility verification

**Files:** Only fixes found here.

- [ ] Step 1: At 320, 375 and 1280px wide: take screenshots and check `document.documentElement.scrollWidth <= innerWidth`.
- [ ] Step 2: Run Lighthouse on mobile. Targets: Accessibility ≥ 95, Performance ≥ 90. Fix contrast issues; button backgrounds use `--primary-btn: #C9471F`.
- [ ] Step 3: `npm test` must pass. Commit "Polish responsive and a11y".
