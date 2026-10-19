# Landing page for Viktoriia (Віка): English & Spanish tutor — design

Date: 2026-10-19
Status: approved in brainstorming, pending spec review

## Goal

A single-page site where adult visitors quickly understand what Віка teaches, how lessons go and what they cost, then contact her on Telegram.

Success: a visitor can find the lesson format, the price and the language that fits them, and reach Telegram in one tap from any point of the page.

## Audience and constraints

- Students: adults only (work, travel, life in Spain).
- Page language: Ukrainian only. The structure must allow adding more languages later.
- Lessons: Zoom only, 60 minutes, materials included.
- Price: €20 per 60 min one-to-one; €30 per 60 min for a pair (€15 per person).
- Tech: the existing Astro 7 project, static output, no backend, no extra UI libraries.

## Content

- Source: `copy-ukr.md` (Віка's own text). Use it **verbatim**; only typos and punctuation may be fixed.
- Everything goes into `src/content/uk.ts`: all strings plus the Telegram URL.
- Telegram URL: `https://t.me/USERNAME` placeholder until the username is provided. It is the single source for every "Написати Віці" button.
- Photo: placeholder slot in "Хто я" until a photo is provided.

## Visual design

- **Palette ("Іспанське сонце")**, defined as CSS custom properties in `src/styles/global.css`:
  - background `#FFF6EA` (cream)
  - text `#3A2A22` (dark brown)
  - primary `#E8603C` (coral): main buttons, accents
  - sun `#FFD25A` (yellow): secondary buttons, highlights
  - sea `#2BA39A` (teal): small labels, accents
  - Sticky-note tints: `#FFE69A`, `#FFD0BF`, `#CDEDE9`
- **Fonts:** Unbounded (headings, 600/700) and Manrope (body, 400/600/700), both with Cyrillic, self-hosted (no Google Fonts request at runtime).
- **Decoration:** straight lines only, no circles or blobs. A thin striped "awning" strip (coral / yellow / teal repeating stripes) at the very top and bottom of the page.
- **Info blocks:** sticky notes, rotated by roughly ±2° and cycling through the three tints, with a soft shadow. Used for:
  - the "На моїх заняттях можна…" list (6 notes)
  - the two price cards
  - the two language cards
- Long-form text (intro, "Хто я", the closing paragraphs of "Як проходять уроки", the language details) stays as plain text, not notes.
- Buttons: pill-shaped. Primary is coral with white text ("Написати Віці"); secondary is yellow ("Обрати мову").
- No top navigation menu.

## Page structure (top to bottom)

1. **Hero:** headline, sub-headline, intro paragraph. Buttons: "Написати Віці" (Telegram) and "Обрати мову" (anchor to section 5).
2. **Хто я:** heading, her story, photo slot, plus a short facts row: 11 років англійської · 7 років іспанської · ОНУ ім. І. І. Мечникова.
3. **Як проходять уроки:** intro text, the "можна" list as sticky notes, then the two closing paragraphs as plain text.
4. **Вартість:** heading, two price sticky notes (Індивідуально 20 € / У парі 30 €), and the "materials included" sentence.
5. **Обирайте мову:** two language sticky notes (Англійська / Іспанська), each with its description and button ("Хочу вчити англійську" / "Хочу вчити іспанську").
   - Below them, a **language details** block (`#english` / `#spanish`) from her "англ стр" / "исп стр" copy: headline, intro, "Що будемо робити?", "Як усе працює?", "Вартість" (repeated on purpose), the closing call to action and a "Написати Віці" button.
6. **Footer:** a final "Написати Віці" button and the awning strip.

## Language switch behaviour

- The language buttons are plain links to `#english` and `#spanish`.
- A small inline script:
  - on click, shows the chosen details block, hides the other and scrolls smoothly to it;
  - on load, if the URL hash is `#english` or `#spanish`, opens that block;
  - with no hash, both blocks are hidden until a language is chosen;
  - marks the selected language card visually (`aria-current` / selected style).
- **Without JavaScript**, both details blocks render one after the other (they are hidden only once the script has run), so the content is always reachable.
- Smooth scrolling respects `prefers-reduced-motion`.

## Code structure

```
src/
  content/uk.ts              all Ukrainian copy + telegramUrl
  styles/global.css          tokens, fonts, base styles, awning, note styles
  layouts/Layout.astro       <html lang="uk">, meta, OG tags, fonts, global css
  components/
    Hero.astro
    About.astro
    Lessons.astro
    Pricing.astro
    LanguagePicker.astro     two cards + the switch script
    LanguageDetails.astro    one component, rendered for english and spanish
    Footer.astro
    StickyNote.astro         props: tint index / variant; slot content
    TelegramButton.astro     label from props, href from uk.ts
  pages/index.astro          composes the sections
```

- Remove the starter files `src/components/Welcome.astro`, `src/assets/astro.svg` and `src/assets/background.svg`.
- Components read text from `uk.ts` and never hard-code copy.

## Responsiveness and accessibility

- Mobile-first, working from 320px wide, with no horizontal scroll.
- Sticky-note grids: 1 column on narrow phones, 2 columns from about 480px, up to 3 for the "можна" list on desktop.
- The note rotation is decorative, and is removed under `prefers-reduced-motion`.
- Text contrast meets WCAG AA (body text on cream and on every note tint; white on coral for buttons, using a darker coral if AA fails).
- Visible `:focus-visible` outlines; semantic headings (one `h1`, then `h2` per section); the photo gets an `alt` text.
- Telegram links open in a new tab with `rel="noopener"`.

## SEO and sharing

- `<title>` and meta description in Ukrainian.
- Open Graph and Twitter tags (title, description, image) so the link previews nicely in Telegram. The OG image is a simple static image in the palette; placeholder acceptable for now.
- Favicon in the palette, replacing the Astro favicon.

## Testing / verification

- `astro build` completes with no errors or warnings about the page.
- In Chrome (DevTools MCP), at 375px and 1280px wide:
  - all sections render; no horizontal scroll;
  - "Обрати мову" scrolls to section 5;
  - each language button opens its block and swaps correctly;
  - loading `/#spanish` opens the Spanish block directly;
  - all "Написати Віці" links point to the Telegram URL.
- Lighthouse: Accessibility ≥ 95, Performance ≥ 90 on mobile.

## Out of scope (for now)

Other page languages, analytics, a contact form, hosting and deployment, a CMS, and separate `/english` and `/spanish` pages (possible later, since `LanguageDetails` is already a separate component).

## Open inputs (non-blocking)

- Віка's Telegram username.
- A photo of Віка.
- Optional: an OG preview image.
