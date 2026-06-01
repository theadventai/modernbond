# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Modern Bond — Project Context

## Project Overview
Modern Bond is a modern intimacy, connection, and personal growth platform. Bold, sex-positive brand with a dark purple/black aesthetic and hot pink accent.

## Dev Server
```bash
npx serve -p 3001 .
```
Preview at: http://localhost:3001
**Never use the `-s` flag** — it enables SPA mode and breaks product page routing.

## File Structure
```
/
├── index.html               # Main landing page (homepage)
├── product-connection-journal.html
├── product-ritual-kit.html
├── product-masterclass.html
├── product-desire-deck.html
├── product-bond-oil.html
├── product-couples-blueprint.html
├── product-styles.css       # Shared styles for product pages
├── product-scripts.js       # Shared JS for product pages
└── images/                  # All brand assets
```

## Brand Colors
```css
--bg:         #0c0612;
--bg2:        #100818;
--purple:     #1a0820;
--purple-mid: #2e0d48;
--purple-hi:  #4a1460;
--pink:       #e91e8c;
--pink-light: #f548a8;
--pink-dim:   rgba(233,30,140,0.15);
--pink-glow:  rgba(233,30,140,0.35);
--white:      #ffffff;
--muted:      rgba(255,255,255,0.5);
```

## Typography
```css
--font-heading: 'Bebas Neue', sans-serif;   /* All headings */
--font-cond:    'Barlow Condensed', sans-serif; /* Nav, labels, buttons */
--font-body:    'Barlow', sans-serif;        /* Body text */
```
Google Fonts import already in `<head>` of index.html.

## Key Images (currently active)
| Usage | File |
|-------|------|
| Nav logo (top-left) | `images/MB_Logo_pink-pink.png` — use `mix-blend-mode: multiply` |
| Hero image | `images/Image_VTAR_002_LAnding_v001.png` |
| Hero tagline | `images/Tagline_001_v002.png` |
| About Us | `images/ABOUT_Image_001_v014.png` |
| Community left | `images/COMUNITY_Image_001_v006-1.png` |
| Community right | `images/COMUNITY_Image_001_v006-2.png` |
| Marquee dots | `images/Mouth_Icon_003_v001.png` |

## Image Naming Conventions
- Versioned files: `ImageName_vXXX.png` — always use the highest version unless specified
- Community images come in pairs: `-1.png` (left) and `-2.png` (right)
- mix-blend-mode: `multiply` for white-background logos, `screen` for black-background logos

## Sections (index.html)
1. **Nav** — Fixed top nav, logo + links + CTA button
2. **Hero** — Full-width character art, tagline image, supertitle
3. **Marquee** — Scrolling ticker (lips icons as separators)
4. **About** — Split layout with large about image
5. **Guides & Coaching** — 4 cards in 1 row (1:1, Couples, Group, Scenario)
6. **Community** — Flanking images + COMMUNITY heading + 3 pillars (Connect, Share, Grow)
7. **Marketplace** — 6 product cards linking to product pages
8. **Experiences** — Events section
9. **Content** — Editorial section (**currently hidden** — `display:none`)
10. **Join / Pricing** — Membership tiers
11. **Footer**

## Coaching Cards (Guides & Coaching section)
4-column grid, flex layout per card (text 40% / icon 60%):
| Card | Icon |
|------|------|
| 1:1 Coaching | `images/1on1Icon_v003.png` |
| Couples Coaching | `images/CouplesC_Icon_v003.png` |
| Group Coaching | `images/GroupC_Icon_v003.png` |
| Scenario Coaching | `images/ScenarioC_Icon_v003.png` |

## Community Pillar Cards
3-column grid, flex layout per card (icon 50% / text 50%):
| Card | Icon |
|------|------|
| Connect | `images/CONNECT_Icon_v002.png` |
| Share | `images/SHARE_Icon_v002.png` |
| Grow | `images/GROW_Icon_v002.png` |

## CSS Patterns
- Scroll reveal: `.reveal` class → `.reveal.on` via Intersection Observer
- Delays: `.d1` `.d2` `.d3` `.d4`
- Buttons: `.btn-pink` (filled) and `.btn-outline`
- Responsive: breakpoints at 1024px and 768px in media queries

## Architecture Notes
- **No build step** — pure HTML/CSS/JS, served as static files.
- `index.html` has its own inline `<style>` block and a `<script>` tag at the bottom; there is no shared CSS file for the homepage.
- Product pages share `product-styles.css` and `product-scripts.js`. Each product page is self-contained HTML that links those two files — no JS framework, no bundler.
- CTA buttons on product pages redirect to `index.html#join` after a 1-second "Added!" pulse (see `product-scripts.js:29`).
- The `.tex` div used inside sections is a CSS texture overlay, not content.

## Git / GitHub
- Repo: https://github.com/theadventai/modernbond
- Branch: `main`
- Push: `git add . && git commit -m "message" && git push`
