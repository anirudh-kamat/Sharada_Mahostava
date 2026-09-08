# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Site

No build step. Open `index.html` directly in a browser, or use VS Code Live Server for live reload. There are no dependencies to install.

## Architecture

Static multi-page website for Mangaluru Sarvajanika Shree Sharada Mahotsava (Sri Venkataramana Temple festival).

**Pages:** `index.html` (home), `gallery.html` (Alankar photos), `deepalankar-photos.html`, `history.html`, `contact.html`, `donation.html` (Kanike), `announcements.html`, `live.html`

**CSS layering:** Three files loaded via media queries in every page's `<head>`:
- `styles.css` — base styles, loaded unconditionally
- `styles.mobile.css` — overrides at `max-width: 768px`
- `styles.desktop.css` — overrides at `min-width: 1024px`

**JavaScript (`script.js`):** Single shared file loaded with `defer` on every page. Handles: hero slideshow, logo modal, gallery image/video modal with carousel navigation, YouTube iframe embeds (with nocookie fallback), dropdown menus, mobile nav toggle, touch swipe, keyboard navigation. All functions exposed on `window` for use by inline `onclick` attributes in HTML.

**Images:** All `.webp`, stored in `images/`. Naming convention: `SLIDE*` (hero slideshow), `A*` (Alankar gallery), `D*` (Deepalankar gallery), `SO*` (general), `L1.webp` (logo), `QR1.webp` (QR code). Portrait images with names `D14`, `A12`, `A15`–`A21` are hardcoded in `script.js:186–194` to receive a 270° rotation transform in the gallery modal.

**YouTube embeds:** Use `<iframe class="yt-embed" data-video-id="...">`. The `initializeYouTubeEmbeds()` function in `script.js` builds the `src` at runtime with the current `window.location.origin` to avoid cross-origin errors. A `.yt-local-fallback` element in the same container acts as a fallback if the YouTube player errors.

**Reload behavior:** `script.js` redirects any non-`index.html` page reload back to `index.html` (see `script.js:13–21`). This is intentional — sub-pages are designed to be navigated to, not directly refreshed.

**Brand colors:** Primary orange `#ff6b35`, dark blue `#2c3e50`, light gray `#f8f9fa`.
