# Spec: UI Styling — Apply niklabs-main Design

**Date:** 2026-04-26  
**Scope:** Frontend only (`frontend/src/`)

---

## Goal

Port the visual design of the `niklabs-main` Next.js template into this project. The template uses a blue-accent dark-first palette, tight border radii, and three font families. The migration covers design tokens, typography, component appearances, and layout patterns. No new features, no complex animated components.

---

## Source Design Summary (niklabs-main template)

| Aspect | Template value |
|---|---|
| Primary accent | `#4f72ff` (blue), hover `#7090ff` |
| Dark bg layers | `#09090e` → `#0e0e16` → `#141425` → `#1c1c30` |
| Dark text | `#eeeef5` / `#8a8aaa` / `#4a4a65` |
| Border (dark) | `rgba(255,255,255,0.07)` / `0.13` / `0.20` |
| Sans font | Bricolage Grotesque |
| Serif font | Lora (article body only) |
| Mono font | JetBrains Mono |
| Border radius | 5px / 7px / 9px / 11px / 14px |
| Ease | `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) |
| Background | Dot-grid in dark mode: radial-gradient 28×28px |

**Excluded from port:** constellation SVG, CoverSvg system, TipTap-specific styles, ReadingProgress bar, TableOfContents, SearchBar with URL routing, TagFilter, Pagination.

---

## 1. `src/styles/index.css`

Single source of truth for all tokens. Full replacement of current green-primary, large-radius tokens.

### Font import (replace existing Google Fonts URL)

```css
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap");
```

### `:root` (light mode tokens)

```css
:root {
  --background:           #f5f5fb;
  --foreground:           #0f0f18;
  --card:                 #ffffff;
  --card-foreground:      #0f0f18;
  --popover:              #ffffff;
  --popover-foreground:   #0f0f18;
  --primary:              #4f72ff;
  --primary-foreground:   #ffffff;
  --secondary:            #1c1c30;
  --secondary-foreground: #eeeef5;
  --muted:                #ebebf5;
  --muted-foreground:     #6b6b8a;
  --accent:               rgba(79, 114, 255, 0.10);
  --accent-foreground:    #0f0f18;
  --destructive:          #e8504a;
  --destructive-foreground: #ffffff;
  --border:               rgba(15, 15, 24, 0.10);
  --input:                rgba(15, 15, 24, 0.10);
  --ring:                 #4f72ff;
  --radius:               7px;
  --shadow-color:         #0f0f18;
}
```

### `.dark` (template values)

```css
.dark {
  --background:           #09090e;
  --foreground:           #eeeef5;
  --card:                 #0e0e16;
  --card-foreground:      #eeeef5;
  --popover:              #141425;
  --popover-foreground:   #eeeef5;
  --primary:              #4f72ff;
  --primary-foreground:   #ffffff;
  --secondary:            #1c1c30;
  --secondary-foreground: #eeeef5;
  --muted:                #141425;
  --muted-foreground:     #8a8aaa;
  --accent:               rgba(79, 114, 255, 0.12);
  --accent-foreground:    #eeeef5;
  --destructive:          #e8504a;
  --destructive-foreground: #ffffff;
  --border:               rgba(255, 255, 255, 0.07);
  --input:                rgba(255, 255, 255, 0.09);
  --ring:                 #4f72ff;
  --shadow-color:         #000000;
}
```

### `@theme` block updates

```css
@theme {
  /* colours map — keep existing --color-* entries, values now driven by new vars above */

  --radius-sm:  5px;
  --radius-md:  9px;
  --radius-lg:  11px;
  --radius-xl:  14px;

  --font-sans:    "Bricolage Grotesque", system-ui, sans-serif;
  --font-display: "Bricolage Grotesque", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", monospace;
  --font-serif:   "Lora", Georgia, serif;

  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);

  --shadow-card: 0 8px 32px color-mix(in srgb, var(--shadow-color) 40%, transparent);
  --shadow-soft: 0 2px 8px  color-mix(in srgb, var(--shadow-color) 20%, transparent);

  --animate-fade-up: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.25; }
}
```

### Body base

```css
body {
  font-family: "Bricolage Grotesque", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

Dark mode dot-grid. Apply it to `.bg-site` instead of `body::before`, because `SiteShell` wraps pages in a full-screen `.bg-site` element. Keep the pseudo-element behind page content.

```css
.bg-site {
  position: relative;
  isolation: isolate;
  background: var(--background);
}

.bg-site > * {
  position: relative;
  z-index: 1;
}

.dark .bg-site::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle, rgba(79,114,255,0.1) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
  z-index: 0;
}
```

### Component utilities

Remove `font-variation-settings` from `.font-display` (was Fraunces-specific).

Replace `.article-prose` with template prose styles:

```css
.article-prose {
  font-family: "Lora", Georgia, serif;
  font-size: 17px;
  line-height: 1.8;
  color: var(--foreground);
}
.article-prose > * + * { margin-top: 1.4em; }
.article-prose h2 {
  font-family: "Bricolage Grotesque", system-ui, sans-serif;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.2;
  margin-top: 2.5em;
}
.article-prose h3 {
  font-family: "Bricolage Grotesque", system-ui, sans-serif;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.3;
  margin-top: 2em;
}
.article-prose p     { color: var(--muted-foreground); margin: 0 0 1.4em; }
.article-prose strong { color: var(--foreground); }
.article-prose a {
  color: #7090ff;
  text-decoration: none;
  border-bottom: 1px solid rgba(79,114,255,0.22);
}
.article-prose blockquote {
  border-left: 2px solid var(--primary);
  padding-left: 1.25rem;
  font-style: italic;
  color: var(--muted-foreground);
}
.article-prose code:not(pre code) {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.88em;
  background: var(--accent);
  padding: 1px 6px;
  border-radius: 4px;
}
.article-prose pre {
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  line-height: 1.65;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 1rem 1.25rem;
  overflow-x: auto;
}
```

---

## 2. `src/components/ui/button.tsx`

Keep `cva` structure. Update class strings only.

Base classes: replace `rounded-full` → `rounded-md`, adjust heights, add `ease-out-expo`-equivalent transition:

```
"inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium tracking-[-0.01em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
```

Variant class strings:

| Variant | New classes |
|---|---|
| `default` | `bg-primary text-primary-foreground hover:bg-[#7090ff] border border-transparent shadow-sm` |
| `secondary` | `bg-muted text-foreground border border-border hover:border-foreground/20 hover:bg-muted/80` |
| `ghost` | `bg-transparent text-muted-foreground border border-border hover:border-foreground/20 hover:text-foreground hover:bg-muted` |
| `destructive` | `bg-destructive text-destructive-foreground border border-transparent hover:bg-destructive/90 shadow-sm` |
| `outline` | `border border-input bg-background shadow-sm hover:bg-muted hover:text-foreground` |
| `link` | keep existing link variant API; update only if desired to `text-primary underline-offset-4 hover:underline` |

Size class strings:

| Size | New classes |
|---|---|
| `default` | `h-9 px-4 text-[13px]` |
| `sm` | `h-8 px-3 text-[12.5px]` |
| `lg` | `h-11 px-5 text-[14px]` |
| `icon` | `h-9 w-9` |

Keep the existing `link` variant, `primary`/`danger` legacy normalization, `buttonStyles` compatibility wrapper, and `asChild`/`Slot` support.

---

## 3. `src/components/ui/input.tsx`

```tsx
className={cn(
  "flex h-10 w-full rounded-md border border-input bg-card px-3.5 text-[14px] text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
  className
)}
```

---

## 4. `src/components/ui/textarea.tsx`

```tsx
className={cn(
  "flex min-h-[80px] w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground resize-y transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-primary/40 focus:ring-[3px] focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
  className
)}
```

---

## 5. `src/components/ui/panel.tsx`

Change `rounded-[2rem]` → `rounded-xl`. Keep everything else.

---

## 6. `src/components/post/post-card.tsx`

Full visual rewrite to match template `ArticleCard`. Use a single outer `<Link to={routes.postDetail(post.id)}>` around the card and remove the old inner "Read more" link to avoid nested interactive elements.

```tsx
<Link to={routes.postDetail(post.id)} className="group block h-full">
<article className="flex h-full flex-col bg-card border border-border rounded-xl overflow-hidden transition-[border-color,transform,box-shadow] duration-200 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
  {/* cover */}
  <div className="relative h-[156px] overflow-hidden flex-shrink-0 bg-muted">
    {post.coverImageUrl ? (
      <img
        src={post.coverImageUrl}
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.03]"
      />
    ) : (
      <div className="w-full h-full flex items-end bg-gradient-to-br from-primary/20 via-card to-muted p-4">
        <p className="text-2xl font-bold tracking-[-0.03em] text-foreground">Niklabs</p>
      </div>
    )}
  </div>

  {/* body */}
  <div className="p-4 flex-1 flex flex-col gap-3">
    {/* status/date meta; PostDto currently has no tags field */}
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary border border-primary/20">
        {postStatusLabels[post.status]}
      </span>
    </div>

    {/* title + excerpt */}
    <h3 className="text-[15.5px] font-semibold tracking-[-0.02em] leading-[1.35] flex-1">{post.title}</h3>
    <p className="text-[13px] text-muted-foreground leading-[1.6] line-clamp-2">{post.excerpt}</p>

    {/* footer row */}
    <div className="flex items-center gap-3 pt-3 border-t border-border text-[12px] text-muted-foreground">
      <span>{formatPostDate(post.publishedAtUtc) ?? postStatusLabels[post.status]}</span>
      <span className="ml-auto transition-transform duration-200 group-hover:translate-x-1">→</span>
    </div>
  </div>
</article>
</Link>
```

Do not reference `post.tags` unless the backend/API contract is extended and the generated `PostDto` includes that field.

---

## 7. `src/components/layout/site-shell.tsx`

### Header

- Change `bg-background/92` → `bg-background/80`
- Change `backdrop-blur-xl` → `backdrop-blur-md`
- Replace logo text-only with logo mark + text:

```tsx
<Link to={routes.home()}>
  <span className="w-7 h-7 bg-primary rounded grid place-items-center transition-[transform,box-shadow] duration-200 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(79,114,255,0.4)]">
    {/* SVG N-mark */}
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1.5 11.5V1.5l5 4.5 5-4.5v10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
  <span className="text-[15px] font-semibold tracking-[-0.025em] leading-none">
    niklabs<span className="text-muted-foreground font-normal">.blog</span>
  </span>
</Link>
```

- Account dropdown: `rounded-[11px]` items from `rounded-[0.8rem]`
- Account button: keep `w-10 h-10 rounded-full border`

### Footer

```tsx
<footer className="border-t border-border bg-background">
  <div className="max-w-[1200px] mx-auto px-5 py-7 flex items-center justify-between flex-wrap gap-4 text-[13px] text-muted-foreground lg:px-10">
    <Link to={routes.home()} className="flex items-center gap-2 text-foreground font-semibold text-[13px] tracking-[-0.02em]">
      niklabs<span className="text-muted-foreground font-normal">.blog</span>
    </Link>
    <p>Built with passion for clean code.</p>
    <p>© 2026 Niklabs</p>
  </div>
</footer>
```

---

## 8. `src/components/sections/posts-list.tsx`

Update grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` (was `md:grid-cols-2 xl:grid-cols-4 gap-6`).

Empty state: update container class to `rounded-xl border border-border bg-card px-5 py-12 text-center text-muted-foreground`.

---

## 9. `src/components/sections/site-header.tsx`

Update hero section to use staggered fade-up animation and template's eyebrow pill:

```tsx
{/* eyebrow pill */}
<div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-[blink_2.5s_ease-in-out_infinite]" />
  <span className="text-[12px] text-primary tracking-[0.02em]">{eyebrow}</span>
</div>

{/* title */}
<h1 className="text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.03em] leading-[1.1] animate-[fadeUp_0.6s_60ms_cubic-bezier(0.16,1,0.3,1)_both]">
  {title}
</h1>

{/* description */}
<p className="text-[16px] text-muted-foreground leading-[1.65] max-w-[460px] animate-[fadeUp_0.6s_120ms_cubic-bezier(0.16,1,0.3,1)_both]">
  {description}
</p>
```

Keep the two-column Panel structure but drop the Fraunces display class — Bricolage Grotesque is the display font now.

---

## 10. `src/pages/home/page.tsx`

Sidebar filter chips: replace current `rounded-full border border-border bg-background px-3 py-2 text-sm` with template chip style (same shape, add active/inactive states). No routing changes.

---

## Acceptance Criteria

- `npm run build` — zero TypeScript errors
- Dark mode: background is `#09090e`, dot-grid visible, accent is blue
- Light mode: near-white background, blue accent, readable contrast
- Fonts: Bricolage Grotesque in all UI text/headings, Lora in `.article-prose`
- Border radius: inputs/buttons are `rounded-md` (9px), panels `rounded-xl` (14px), NOT pill-shaped
- PostCard: hover lifts, border accent, shadow — no staggered animation (animation excluded without `index` prop available)
- Buttons: default height `h-9`, tighter than current `h-11`
- Logo mark renders in nav header
- All existing pages work (sign-in, change-password, post editor)

---

## Out of Scope

- Constellation SVG, CoverSvg, ReadingProgress, TOC, SearchBar URL routing, TagFilter, Pagination
- Backend changes
- Orval client regeneration
- ThemeProvider changes (already working)
