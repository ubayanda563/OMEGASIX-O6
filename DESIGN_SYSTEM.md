# Resonance — Design System
**Workflow:** `design-system-spotify` · **Surface:** Music web app · **Audience:** Developers extending or maintaining Resonance

> Design intent: deliver a liquid-glass music interface that is visually premium, theme-adaptive, and fully accessible — grounded in Spotify-style structural discipline.

---

## 1. Context and Goals

Resonance is a single-page music app built on React + Tailwind CSS v4. Its visual language layers Apple's liquid-glass aesthetic over a Spotify-style information hierarchy. The design system codifies every token, component rule, and interaction pattern so the two aesthetics remain coherent as the surface grows.

**Non-negotiables**
- WCAG 2.2 AA contrast at all times, in both themes.
- Every interactive element must have a visible focus ring.
- The ember (dark) and morning-haze (light) themes must be independently coherent — no shared raw hex values in component code.
- Motion must respect `prefers-reduced-motion`.

---

## 2. Design Tokens and Foundations

### 2.1 Semantic Token Map

All component code must reference **CSS custom properties**, never raw hex values.

#### Color — Text

| Token | Dark value | Light value | Usage |
|---|---|---|---|
| `--text-primary` | `rgba(255,255,255,0.98)` | `rgba(26,26,46,0.95)` | Headings, active labels, primary content |
| `--text-secondary` | `rgba(255,255,255,0.6)` | `rgba(26,26,46,0.6)` | Sub-labels, metadata, inactive nav labels |
| `--text-muted` | `rgba(255,255,255,0.4)` | `rgba(26,26,46,0.4)` | Timestamps, counters, disabled labels |

#### Color — Accent

| Token | Dark value | Light value | Usage |
|---|---|---|---|
| `--accent-primary` | `#0a84ff` | `#f472b6` | Play button fill, progress fill, links |
| `--accent-secondary` | `#ff375f` | `#fbbf24` | Like/heart active fill, destructive |
| `--accent-tertiary` | `#bf5af2` | `#fde047` | Theme toggle moon, tag highlights |

#### Color — Surface / Glass

| Token | Dark | Light | Usage |
|---|---|---|---|
| `--glass-bg` | `rgba(30,30,35,0.45)` | `rgba(255,255,255,0.45)` | Panel background |
| `--glass-border` | `rgba(255,255,255,0.15)` | `rgba(255,255,255,0.7)` | Panel inset border ring |
| `--glass-highlight` | `rgba(255,255,255,0.25)` | `rgba(255,255,255,0.9)` | Top inset highlight |
| `--glass-caustic` | `rgba(255,255,255,0.05)` | `rgba(253,224,71,0.2)` | Bottom inset caustic |
| `--reflection-start` | `rgba(255,255,255,0.15)` | `rgba(255,255,255,0.7)` | Aqua reflection gradient start |
| `--reflection-end` | `rgba(255,255,255,0)` | `rgba(255,255,255,0)` | Aqua reflection gradient end |
| `--glare-color` | `rgba(255,255,255,0.15)` | `rgba(255,255,255,0.6)` | Mouse-follow glare overlay |
| `--glass-shadow` | `rgba(0,0,0,0.8)` | `rgba(0,0,0,0.08)` | Drop shadow color |
| `--pill-bg` | `rgba(60,60,65,0.8)` | `rgba(255,255,255,0.75)` | Active nav pill fill |

#### Color — Background

| Token | Dark | Light |
|---|---|---|
| `--background` | `#000000` | `#ffffff` |
| `--foreground` | `#f5f5f7` | `#1a1a2e` |

#### Color — Ambient Blobs

| Token | Dark | Light |
|---|---|---|
| `--blob-1` | `#ff4500` | `#fde047` |
| `--blob-2` | `#ff8c00` | `#f472b6` |
| `--blob-3` | `#ffd700` | `#fbbf24` |

---

### 2.2 Typography

Resonance inherits Spotify's type stack for structural rhythm.

```
font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl,
             Helvetica Neue, helvetica, arial, Hiragino Sans, sans-serif;
```

| Role | Size | Weight | Line-height | Token equivalent |
|---|---|---|---|---|
| Display / Screen heading | `24px` | 700 | 1.2 | `font.size.xl` |
| Section heading | `16px` | 600 | 1.4 | `font.size.lg` |
| Body / label | `15px` | 600 | 1.5 | between `md` and `lg` |
| Metadata / caption | `13px` | 400 | 1.4 | between `sm` and `md` |
| Badge / timestamp | `11px` | 400 | 1.3 | `font.size.xs` |

**Rules**
- Body text must never fall below `11px`.
- Active nav labels must use weight 600 minimum.
- Do not mix font-size and font-weight Tailwind classes unless overriding a theme default — use CSS custom properties instead.

---

### 2.3 Spacing

Follow the Spotify 4-pt grid. Tailwind gap/padding utilities must align to multiples of 4.

| Token | Value | Typical use |
|---|---|---|
| `space.1` | `2px` | Icon stroke nudges |
| `space.2` | `4px` | Inline gap between badge and label |
| `space.3` | `8px` | Card internal padding, icon-to-label gap |
| `space.4` | `12px` | Button vertical padding |
| `space.5` | `16px` | Standard section internal padding |
| `space.6` | `20px` | Desktop content padding unit |
| `space.7` | `36px` | Between major content sections |

---

### 2.4 Radius and Motion

| Token | Value | Use |
|---|---|---|
| `radius.xs` | `8px` | Card art, small chips |
| `radius.md` | `12px` (Tailwind `rounded-xl`) | GlassButton default |
| `radius.lg` | `16px` (Tailwind `rounded-2xl`) | GlassPanel, MiniPlayer |
| `radius.full` | `9999px` | Nav pill, play button, GlassButton pill variant |

| Token | Value | Use |
|---|---|---|
| `motion.instant` | `150ms` | Hover color, icon swap |
| `motion.spring` | `stiffness 300 / damping 25 / mass 0.8` | Nav pill layout animation, button tap |
| `motion.blob` | `20–25s` ease `[0.45,0.05,0.55,0.95]` | Background blob drift |

**Motion rule:** All `motion.*` animations must be wrapped in a `prefers-reduced-motion` media query or Motion's `useReducedMotion` hook. When reduced motion is active, replace spring transitions with `opacity` fades at `motion.instant`.

---

## 3. Component Rules

### 3.1 GlassPanel

**Anatomy**
```
[GlassPanel root]
  ├── Aqua reflection layer      (z-6, top 46%, pointer-events-none)
  ├── Interactive glare overlay  (z-5, radial gradient follows cursor)
  └── Content slot               (z-10)
```

**Box shadow formula — must not be simplified**
```css
box-shadow:
  0 40px 80px -20px var(--glass-shadow),
  0 10px 30px -10px var(--glass-shadow),
  inset 0 2px 3px -1px var(--glass-highlight),
  inset 0 -2px 4px -1px var(--glass-caustic),
  inset 0 0 0 1px var(--glass-border);
```

**Backdrop filter:** `blur(50px) saturate(200%)`. Must include `-webkit-` prefix.

**States**

| State | Behavior |
|---|---|
| Default | Full shadow stack, reflection always visible |
| Hover (`hover` prop) | `y: -2px` spring lift; glare overlay fades in |
| No-glare (`withGlare={false}`) | Glare layer omitted entirely — use for MiniPlayer, BottomNav |
| Focus-within | Must not suppress the aqua reflection; content focus ring remains visible through z-stack |

**Responsive**
- On mobile (`< md`): reduce outer blur to `blur(40px)` if GPU budget is constrained.
- Panels must never clip child focus rings — `overflow: hidden` is set; child focusable elements must use `outline-offset: -2px`.

**Accessibility**
- GlassPanel is a layout primitive, not a landmark. Do not give it an implicit role.
- If used as a card with a single interactive action, wrap the action in a `<button>` or `<a>` — do not make the panel itself clickable.
- Must pass contrast check: text inside must meet 4.5:1 against `--glass-bg` at its computed opacity in each theme.

---

### 3.2 GlassButton

**Variants**

| Variant | Radius | Typical use |
|---|---|---|
| `default` | `rounded-xl` (12px) | Genre chips, filter tags |
| `pill` | `rounded-full` | Search toggles, active-state filters |

**States**

| State | Visual |
| --- | --- |
| Default | `--glass-bg` fill, `--glass-border` ring, `--glass-highlight` inset |
| Hover | `scale(1.02)` spring |
| Active / pressed | `scale(0.92)` spring |
| Selected (`active={true}`) | `--pill-bg` fill, `--pill-shadow`, layoutId spring pill |
| Disabled | `opacity: 0.4`, `pointer-events: none`, `cursor: not-allowed` |
| Focus-visible | `outline: 2px solid var(--accent-primary)`, `outline-offset: 2px` |

**Rules**
- Button label must be a single line. Truncate with ellipsis; never wrap.
- Minimum tap target: `44×44px`. Pad with invisible hit area if visual size is smaller.
- Icon-only buttons must have `aria-label` — never rely on `title`.

---

### 3.3 Sidebar (Desktop, `≥ md`)

**Anatomy**
```
[Sidebar root — hidden on mobile]
  ├── GlassPanel (flex-1)
  │   └── Nav item list
  │       └── [Active] spring layout pill (layoutId="sidebar-pill")
  └── GlassPanel (theme toggle)
```

**Nav item states**

| State | Icon color | Label color | Pill |
|---|---|---|---|
| Default | `--text-secondary` | `--text-secondary` | None |
| Hover | `--text-primary` | `--text-primary` | None, `x: 4px` nudge |
| Active | `--text-primary` | `--text-primary` | Spring pill visible |
| Focus-visible | Same as hover + outline ring | | |

**Rules**
- The active pill uses `layoutId="sidebar-pill"`. Do not reuse this `layoutId` anywhere else.
- Nav width is fixed at `w-64` (256px). Do not allow shrinking.
- Theme toggle must always be visible — place it in its own GlassPanel below the nav list so it survives long nav lists.

**Keyboard**
- Tab through nav items in DOM order.
- Enter/Space activates tab change.
- Theme toggle is a `<button>` in the natural tab order after nav items.

---

### 3.4 BottomNav (Mobile, `< md`)

**Anatomy**
```
[BottomNav root — fixed bottom, md:hidden]
  └── GlassPanel (withGlare={false})
      └── flex row
          ├── Home · Search · Library · Favorites  (nav items)
          └── Theme toggle
```

**States** — identical to Sidebar nav items except layout is vertical (icon + label stacked).

**Rules**
- Theme toggle must be the last item in the row on mobile.
- Active pill uses `layoutId="bottom-nav-pill"` — separate from `"sidebar-pill"`.
- Bottom nav must sit above MiniPlayer (`z-50` vs MiniPlayer `z-40`).
- Bottom padding on `<main>` must account for BottomNav height (`pb-36` minimum on mobile).

**Accessibility**
- Each nav button must have `aria-label` matching its visible label.
- Current page button must have `aria-current="page"`.

---

### 3.5 MiniPlayer (Mobile)

**Anatomy**
```
[MiniPlayer root — fixed, above BottomNav]
  └── GlassPanel (withGlare={false})
      ├── Album art thumbnail  (48×48px, rounded-lg)
      ├── Track info           (title truncate, artist truncate)
      └── Controls row
          ├── Like toggle (Heart icon)
          ├── Play/Pause (filled accent-primary circle)
          └── Skip Next
```

**States**

| Element | State | Visual |
|---|---|---|
| Like (Heart) | Unliked | `--text-muted` stroke, no fill |
| Like (Heart) | Liked | `--accent-secondary` fill + stroke |
| Play button | Default | `--accent-primary` background, white icon |
| Play button | Hover | `scale(1.05)` |
| Play button | Pressed | `scale(0.85)` |
| Skip | Hover | `scale(1.05)` |

**Rules**
- Track title and artist must both truncate with ellipsis — never wrap.
- Album art must use `object-cover` — never letter-box.
- Play button shadow must reference `--accent-primary` with `0.3` opacity, not a raw hex blue.
- MiniPlayer must be hidden on desktop (`md:hidden`).

**Accessibility**
- Play/Pause button must have dynamic `aria-label`: `"Pause {track.title}"` / `"Play {track.title}"`.
- Like button must have `aria-label="Like"` / `aria-label="Unlike"` and `aria-pressed`.
- Skip button must have `aria-label="Skip to next track"`.

---

### 3.6 AnimatedBackground

**Anatomy**
```
[AnimatedBackground — fixed inset, pointer-events-none]
  ├── Base color div           (black dark / white light)
  ├── Theme gradient layer     (dark: ember / light: morning haze)
  └── 3× drifting blob divs   (Motion, blur-[90px], rounded-full)
```

**Dark — Ember gradient (exact)**
```css
background-image:
  radial-gradient(circle at 50% 100%, rgba(255,69,0,0.6)   0%, transparent 60%),
  radial-gradient(circle at 50% 100%, rgba(255,140,0,0.4)  0%, transparent 70%),
  radial-gradient(circle at 50% 100%, rgba(255,215,0,0.3)  0%, transparent 80%);
```

**Light — Morning Haze gradient (exact)**
```css
background-image:
  radial-gradient(circle at 50% 100%, rgba(253,224,71,0.4)  0%, transparent 60%),
  radial-gradient(circle at 50% 100%, rgba(251,191,36,0.4)  0%, transparent 70%),
  radial-gradient(circle at 50% 100%, rgba(244,114,182,0.5) 0%, transparent 80%);
```

**Rules**
- Blobs must use `willChange: 'transform'` and nothing else — do not add `willChange: 'opacity'`.
- Blob opacity must be controlled via the inline `opacity` prop, not `--blob-opacity`, so dark/light can differ independently.
- The gradient layer is conditionally rendered (`isDark` branch), not toggled via opacity — avoids blending artifacts.
- Background component must never intercept pointer events (`pointer-events-none` on root and all children).

**Accessibility**
- Background must have `aria-hidden="true"` to exclude it from the accessibility tree.

---

## 4. Accessibility Requirements

### 4.1 Contrast

| Pairing | Minimum ratio | Where |
|---|---|---|
| `--text-primary` on `--glass-bg` (dark) | 4.5:1 | All panels |
| `--text-primary` on `--glass-bg` (light) | 4.5:1 | All panels |
| `--text-secondary` on `--glass-bg` | 3:1 | Metadata only — not headings |
| `--accent-primary` on `--background` | 3:1 | Icon-only controls minimum |
| White on `--accent-primary` play button | 4.5:1 | Must validate per theme |

### 4.2 Focus

- Every interactive element must show `outline: 2px solid var(--accent-primary)` on `:focus-visible`.
- Focus rings must never be clipped by `overflow: hidden` on parent panels. Use `outline-offset: -2px` where needed.
- Focus order must follow DOM order — do not use `tabindex > 0`.

### 4.3 Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Replace spring/keyframe animations with instant opacity change */
  * { animation-duration: 0.001ms !important; transition-duration: 150ms !important; }
}
```
Blob animations and nav pill spring must be gated by `useReducedMotion()` from Motion.

### 4.4 Testable Acceptance Criteria

- [ ] All text passes automated contrast ratio check in both themes (axe-core or Lighthouse).
- [ ] Tab through every interactive element without a mouse — every element must show a visible focus ring.
- [ ] Activate every button and nav item with keyboard (Enter/Space) only.
- [ ] Enable macOS/Windows reduced motion — no continuous blob animations should play.
- [ ] Screen reader announces current page in nav (`aria-current="page"`).
- [ ] Screen reader announces play/pause state dynamically.
- [ ] Theme toggles between dark and light via keyboard without page reload.

---

## 5. Content and Tone Standards

Follow Spotify's concise, action-first copy patterns.

| Context | Do | Don't |
|---|---|---|
| Nav labels | `Home`, `Search`, `Library`, `Favorites` | `Go to Home`, `Browse Music` |
| Play controls | `Play`, `Pause`, `Skip` (aria-labels) | `Click to play audio` |
| Like action | `Like`, `Unlike` | `Add to liked songs` (too long for aria-label) |
| Theme toggle | `Theme` | `Switch between dark and light mode` |
| Empty states | `Nothing here yet. Start exploring.` | `No content available at this time.` |
| Error states | `Couldn't load. Try again.` | `An unexpected error has occurred.` |

---

## 6. Anti-Patterns and Prohibited Implementations

| # | Anti-pattern | Why prohibited | Correct approach |
|---|---|---|---|
| 1 | Raw hex in component JSX/CSS | Breaks theme switching | Use `var(--token-name)` |
| 2 | `backdrop-filter` without `-webkit-` prefix | Breaks Safari | Always include both |
| 3 | `layoutId` reuse across nav contexts | Motion conflict — pill teleports incorrectly | Sidebar: `"sidebar-pill"`, BottomNav: `"bottom-nav-pill"` |
| 4 | `pointer-events: auto` on AnimatedBackground children | Blocks all app interactions | Background layer must be fully inert |
| 5 | Play button shadow hardcoded to `rgba(0,122,255,0.3)` | Breaks light-mode accent | Use `--accent-primary` with opacity |
| 6 | Wrapping track title text | Destroys MiniPlayer layout | `truncate` class on all track text |
| 7 | Making GlassPanel itself clickable | No semantic role, no keyboard support | Put the interactive element inside the panel |
| 8 | `willChange: 'opacity'` on blobs | Compositor layer bloat | `willChange: 'transform'` only |
| 9 | Inline spacing values (e.g., `margin: 7px`) | Off-grid | Align to 4pt grid (multiples of 4px) |
| 10 | Low-contrast `--text-muted` for headings | Fails AA | `--text-muted` is for non-essential metadata only |

---

## 7. QA Checklist

Run before every PR that touches UI tokens, components, or themes.

### Visual
- [ ] Both themes render correctly — no raw black/white flashes on theme toggle.
- [ ] Ember gradient (dark) and Morning Haze gradient (light) match the exact RGBA values in section 3.6.
- [ ] Glass panels show aqua reflection, inset highlights, and drop shadow in both themes.
- [ ] Active nav pill animates smoothly between items with no jump.
- [ ] MiniPlayer album art renders `object-cover` — no letterboxing.
- [ ] Blob animations run continuously and do not freeze or flicker.

### Interaction
- [ ] Theme toggle works from both Sidebar (desktop) and BottomNav (mobile).
- [ ] Play/Pause, Like, and Skip all respond to tap and keyboard.
- [ ] Nav items respond to keyboard and update `aria-current`.

### Accessibility
- [ ] All text passes 4.5:1 (AA) in both themes — verified with browser DevTools or axe.
- [ ] Every interactive element shows a focus ring on `:focus-visible`.
- [ ] No focus ring is clipped by `overflow: hidden`.
- [ ] Reduced motion mode disables blob drift and spring animations.
- [ ] Screen reader reads dynamic play/pause aria-label correctly.

### Tokens
- [ ] Zero raw hex values in component files — grep confirms `#[0-9a-fA-F]` returns no matches in `src/app/components/` or `src/app/screens/`.
- [ ] New tokens added to `theme.css` in both `:root` and `.dark` blocks and exposed via `@theme inline`.
- [ ] No one-off spacing values — grep for non-multiple-of-4 pixel values in component styles.
