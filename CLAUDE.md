# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Modern Bond — Project Context

## Project Overview
Modern Bond is a modern intimacy, connection, and personal growth platform. Bold, sex-positive brand with a dark purple/black aesthetic and hot pink accent.

## Dev Server
```bash
npm run dev
```
Preview at: http://localhost:3000
This is a Next.js 16 app (App Router, TypeScript). The old static-file server (`npx serve`) is no longer used.

## File Structure
Next.js App Router. No build step config beyond `next.config.ts`.
```
/
├── app/
│   ├── layout.tsx           # Root layout — fonts, Snipcart, Supabase CDN, Nav, Footer
│   ├── globals.css          # ALL styles (merged from old product/forum/index CSS)
│   ├── page.tsx             # Homepage ('use client' — reveal + hero parallax)
│   ├── account/page.tsx     # Auth (signup/login) + profile editor
│   ├── community/page.tsx   # Forum feed (categories, sort, composer, voting)
│   ├── thread/[id]/page.tsx # Thread detail + nested comments
│   └── products/[slug]/page.tsx  # Data-driven product detail (Snipcart add-to-cart)
├── components/
│   ├── Nav.tsx              # Fixed nav ('use client' — scroll state)
│   ├── Footer.tsx
│   └── VoteCol.tsx          # Reusable up/down vote widget
├── lib/
│   ├── supabase.ts          # Supabase client + Profile type
│   ├── forum.ts             # Forum types + timeAgo / getMyVotes / toggleVote
│   └── products.ts          # PRODUCTS data map (all 6 products)
├── public/
│   ├── images/              # All brand assets
│   └── marketplace/         # Product images (per-product folders)
└── supabase/                # schema.sql
```
All page components are `'use client'` (they use Supabase auth, IntersectionObserver reveal, or browser state). Product pages are a single dynamic route driven by `lib/products.ts` — add a product by adding an entry there.

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
- **Next.js 16 App Router + TypeScript.** `@/*` import alias maps to repo root.
- All styles live in `app/globals.css` (one file, ported from the old inline + product + forum CSS). No CSS Modules, no Tailwind.
- Snipcart (v3.7.2) and the Supabase JS CDN load via `next/script` in `app/layout.tsx`; the `#snipcart` config div sits in the body. Add-to-cart buttons are plain `snipcart-add-item` elements with `data-item-*` attributes (see `app/products/[slug]/page.tsx`).
- Supabase: anon client in `lib/supabase.ts`. Auth (email/password), `profiles`, `categories`, `posts`/`post_feed`, `comments`, `votes` tables; avatars in the `avatars` storage bucket. Schema in `supabase/schema.sql`.
- The `.tex` div used inside sections is a CSS texture overlay, not content.

## Git / GitHub
- Repo: https://github.com/theadventai/modernbond
- Branch: `main`
- Push: `git add . && git commit -m "message" && git push`
