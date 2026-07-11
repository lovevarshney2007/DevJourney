# DevJourney — Full UI Redesign PRD (v2)
### Deep-Dark Dashboard → Light Editorial / Duotone (Violet + Mint) / Mixed Typography

**This supersedes the previous "minimal dark" PRD.** Direction has changed from dark-minimal to a light editorial system inspired by the NEXTGEN reference: warm-white canvas, a bold sans headline broken by one italic serif accent word, wide-tracked uppercase mono labels, hairline borders, and a violet + mint duotone used deliberately instead of a single flat accent.

This is now a **full UI redesign**, not a token swap — it touches actual page markup, not just `globals.css` variables, because your components hardcode Tailwind color classes directly in JSX rather than reading from variables. That's almost certainly why the last pass looked like "nothing changed": the agent may have edited variables that nothing was actually consuming.

---

## 0. Why last time did nothing (read this before running the new prompt)

Three likely causes, in order of probability:
1. **Hardcoded classes.** Your dashboard/hero markup (`app/(student)/dashboard/page.tsx`, `Sidebar.tsx`, etc.) almost certainly uses literal Tailwind utilities like `bg-[#0a0a0f]`, `text-white`, `from-blue-400 via-blue-300 to-purple-400` directly in JSX — not `var(--color-bg)`. Editing `globals.css` alone does nothing to those files.
2. **Cache.** `.next` cache can serve stale output. Always `rm -rf .next` after a redesign pass.
3. **The agent described a plan instead of executing it.** Always end by checking `git diff --stat`.

The prompt in Section 10 fixes #1 by explicitly having the agent **grep for hardcoded old-theme classes across the whole `src/` tree first**, and edit every file that turns up — not just `components/ui/`.

---

## 1. Design Direction

**Grounding it in the subject:** DevJourney is a technical evaluation platform for developers. The reference's editorial confidence (serif italic + bold sans, numbered analytical blocks, hairline precision) gets one deliberate deviation for this subject: **nav labels and eyebrows go in `JetBrains Mono`, wide-tracked, not plain sans** — a small, specific choice that says "developer tool" without abandoning the reference's poise.

**The one signature move:** a persistent 5px near-black strip fixed to the very top of every page (marketing and app alike) — the one piece of drama that ties the whole product together, echoed nowhere else. Everything below it stays quiet: hairline borders, no blur, no stacked shadows, one glow reserved only for the primary CTA button.

**Numbered blocks — used honestly, not decoratively.** The reference uses `01 / 02 / 03` for real sequential content (their methodology steps). Apply this pattern only where DevJourney has a genuine sequence — a submission's evaluation stages, a task's step-by-step instructions, an onboarding checklist. Do **not** apply numbering to the dashboard's four stat cards (Active Tasks, Pending Reviews, My Submissions, Deadlines Soon) — those are a set, not a sequence. Leave them as a plain grid.

---

## 2. Typography

| Role | Font | Usage |
|---|---|---|
| Headline / display | `Inter`, weight 700–800 | Page titles, section headers |
| Accent word (one per major heading, sparingly) | `Instrument Serif`, italic | e.g. "Student *Dashboard*", "Submission *Review*" — never the whole heading, one word |
| Body | `Inter`, weight 400–500 | Paragraphs, descriptions |
| Eyebrows / nav / labels / stat numbers' captions | `JetBrains Mono`, uppercase, letter-spacing 0.08em | "ACTIVE TASKS", "DEADLINES SOON", sidebar nav items, table headers |

Load both new weights via `next/font/google` in the root `layout.tsx` only — this is the one layout.tsx change permitted (font setup + the top strip element), nothing else in that file changes.

---

## 3. Color Tokens

```css
:root {
  /* canvas */
  --bg-canvas: #fafaf8;
  --bg-surface: #ffffff;
  --bg-wash-violet: rgba(124, 58, 237, 0.05);
  --bg-wash-mint: rgba(47, 158, 110, 0.06);

  /* borders */
  --border-hairline: #e4e4e7;
  --border-strong: #d4d4d8;

  /* text */
  --text-primary: #18181b;
  --text-secondary: #52525b;
  --text-muted: #a1a1aa;
  --text-inverse: #fafafa;

  /* duotone accent */
  --accent-violet: #7c3aed;
  --accent-violet-hover: #6d28d9;
  --accent-mint: #2f9e6e;
  --accent-mint-hover: #26845c;

  /* signature top strip */
  --top-strip: #0b0b0d;

  /* semantic — mint doubles as success, keep warning/danger as-is */
  --color-success: #2f9e6e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
}
```

Usage rule for the duotone: **violet = primary/CTA/action**, **mint = secondary/supporting/tags**. Alternate them across repeated elements (e.g. stat card icon borders alternate violet/mint left-to-right) rather than mixing both in one element.

---

## 4. Shape & Surface

- Radius: 4px on buttons/tags, 6px on cards/modals — tighter and squarer than a typical rounded SaaS card, matching the reference's near-square button.
- Borders: 1px hairline (`--border-hairline`) on every card/input/table, no exceptions.
- Shadows: none at rest, anywhere. The **only** shadow in the entire system is a soft violet glow on the primary CTA button: `0 0 24px rgba(124,58,237,0.25)`. Nothing else gets a shadow or glow — this is the one dramatic moment, spend it there and nowhere else.
- Background wash: on the landing/marketing hero only, a very soft diagonal dual gradient using `--bg-wash-violet` (top-left) and `--bg-wash-mint` (top-right) over `--bg-canvas`. Dashboard/app interior screens stay flat `--bg-canvas` — no wash, it'd fight with dense data.

---

## 5. Motion (Framer Motion — same engine as before, recolored)

Keep the shared `components/ui/motion.ts` approach:

```ts
export const EASE_FAST = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: EASE_FAST } },
};

export const stagger = { visible: { transition: { staggerChildren: 0.035 } } };

export const pressable = {
  rest: { scale: 1 },
  tap: { scale: 0.97, transition: { duration: 0.1, ease: EASE_FAST } },
};

export const heroReveal = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_FAST } },
};
```

- `heroReveal` with `stagger` (word/line level) runs once on first load of the landing page and first dashboard visit only — not on every navigation. This is the "orchestrated moment," not scattered effects.
- Sidebar active-item indicator: `motion.div` with `layoutId="sidebar-indicator"`, background = violet, slides between items on click.
- Everything else (buttons, cards) keeps the same crisp `pressable`/`fadeUp` behavior from before — that part of the system was already correct and doesn't need to change.

---

## 6. Component Specs

**Top strip** — new element, in root `layout.tsx`: fixed, full-width, `height: 5px`, `background: var(--top-strip)`, `z-index` above everything, present on every route.

**Sidebar** (`components/admin/Sidebar.tsx`, `components/student/Sidebar.tsx`)
- `--bg-surface` background, 1px right hairline border (replaces the current dark full-bleed shell)
- Nav items: `JetBrains Mono` uppercase, tracked, `--text-secondary` default → `--text-primary` active
- Active state: thin left indicator bar in `--accent-violet` (animated per Section 5) + 4–6% violet background wash on that row only
- Logo lockup, user footer block: keep structure, swap colors only

**Stat cards** (dashboard)
- White surface, 1px hairline border, no shadow
- Eyebrow label: mono uppercase muted, above the number
- Number: bold sans, `--text-primary`, no gradient fill
- Icon: small square (not circle), 1px border tinted alternately violet/mint per card, icon itself in that same accent color
- Plain grid — no numbering (see Section 1)

**Tags/badges** (e.g. "Frontend", due-date pills)
- Switch from filled pill to **outlined rectangle**, 4px radius, 1px border in the tag's color, mono uppercase text in that same color, transparent background — matches the reference's clean label typography instead of a filled chip

**Primary button**
- Solid `--accent-violet` fill, `--text-inverse` label, mono uppercase tracked, 4px radius, the one permitted glow shadow from Section 4, `pressable` tap motion

**Secondary/ghost buttons**
- Transparent or `--bg-surface`, 1px `--border-hairline`, text `--text-secondary` → `--text-primary` on hover, no glow

**Tables**
- Headers: mono uppercase, muted, wide-tracked (unchanged intent from before)
- Rows: 1px bottom hairline, hover = very light `--bg-wash-mint` tint instead of flat gray

**Hero / landing page** (`app/page.tsx`)
- Eyebrow line in mono uppercase (`ESTABLISHED 2026 / ...`-style, adapted to real copy)
- Headline: bold sans, with exactly one word swapped to `Instrument Serif` italic
- Supporting paragraph: can stay in italic serif at body size, echoing the reference's editorial paragraph treatment
- One numbered info panel (3 items) IF there's genuine sequential/process content to put there (e.g., "how evaluation works") — otherwise don't force it in

---

## 7. File Touch List

Because colors are hardcoded in page-level JSX (confirmed from your screenshots), this pass touches more than `components/ui/`:

| Allowed | Forbidden |
|---|---|
| `src/app/globals.css`, `tailwind.config` | `middleware.ts` |
| `src/app/layout.tsx` (fonts + top strip **only**) | `lib/*` |
| `src/components/ui/*` | `models/*` |
| `src/components/admin/*`, `src/components/student/*` (styling only) | `hooks/*` |
| Any `page.tsx`/`layout.tsx` under `app/(admin)`, `app/(student)`, `app/login`, `app/register`, `app/page.tsx` — **styling/className/markup-order only, no data logic changes** | `api/*` |
| `components/ui/motion.ts` | `types/index.ts` (unless additive) |

The agent should not assume this list is exhaustive — Section 10's first step has it grep the actual codebase and treat whatever surfaces as the real touch list, staying within these boundaries.

---

## 8. Execution Order

1. Grep the whole `src/` tree for old-theme signatures (hex values from the previous dark palette, `backdrop-blur`, `from-blue-400`, etc.) and list every file that matches — this is the real touch list.
2. Add fonts in root `layout.tsx` (Inter weights + Instrument Serif + confirm JetBrains Mono is already loaded correctly). Add the top strip element. Build.
3. Update `globals.css`/`tailwind.config` tokens (Section 3). Build.
4. Migrate `components/ui/*` one at a time (Button → Input → Badge/Tag → Card → Table). Build after each.
5. Migrate `Sidebar.tsx` (admin + student). Build.
6. Migrate dashboard `page.tsx` files (admin + student) — stat cards, recent activity panels.
7. Migrate `app/page.tsx` (public landing), `login`, `register`.
8. Final grep pass to confirm zero remaining references to the old dark palette or removed classes.
9. `git diff --stat` and list every changed file.

---

## 9. Verification Checklist

- [ ] `rm -rf .next && npm run build` passes clean
- [ ] `git diff --stat` shows changes beyond just `globals.css`/`tailwind.config`
- [ ] Zero remaining hardcoded old-theme hex values or gradient classes anywhere in `src/`
- [ ] Top strip visible on every route, including login/register
- [ ] Sidebar is light, hairline-bordered, active indicator animates
- [ ] Exactly one italic-serif accent word per major heading — not whole headings in serif
- [ ] Numbered blocks appear only where content is genuinely sequential
- [ ] Only the primary CTA button has any shadow/glow in the entire app
- [ ] No new code comments; no dead/commented-out CSS left behind
- [ ] All existing functionality (auth, CRUD, submissions, review flows) behaves identically

---

## 10. Copy-Paste Agent Prompt

```
You are redesigning the visual layer of an existing Next.js 15 (App Router) app called DevJourney. Functionality must not change — no changes to auth logic, data fetching, routing, prop signatures, or anything in middleware.ts, lib/, models/, hooks/, api/, or types/ (except an additive type if genuinely needed). No code comments anywhere, no commented-out dead code.

STEP 1 — BEFORE CHANGING ANYTHING: grep the entire src/ directory for the old dark-theme signatures: hex values like #0a0a0f, #111118, #16161e, #1c1c28, #2a2a3a, gradient classes like "from-blue-400 via-blue-300 to-purple-400", and "backdrop-blur". List every file that matches. Treat that file list as real scope in addition to components/ui/ — many of these colors are hardcoded directly in page-level JSX (dashboard pages, sidebar components), not read from CSS variables, which is why a previous token-only pass had no visible effect. Confirm this file list before proceeding.

DIRECTION: move from the current dark glassmorphism dashboard to a light editorial system:

Typography: load Inter (weight 700-800 for headings, 400-500 for body) and Instrument Serif italic via next/font/google in the root layout.tsx (this is the only change permitted in that file besides adding the top strip element below). JetBrains Mono is already loaded — use it for all uppercase, wide-tracked labels: sidebar nav items, eyebrow labels, table headers, stat captions. Headings are bold Inter with exactly ONE word per major heading swapped to Instrument Serif italic (e.g. "Student Dashboard" → "Dashboard" in italic serif) — never make a whole heading serif, and don't do this on every heading in the app, just page titles/hero moments.

Colors (define as CSS variables in globals.css, then actually apply them at every JSX call site the Step 1 grep turned up — don't stop at defining variables):
--bg-canvas: #fafaf8; --bg-surface: #ffffff;
--bg-wash-violet: rgba(124,58,237,0.05); --bg-wash-mint: rgba(47,158,110,0.06);
--border-hairline: #e4e4e7; --border-strong: #d4d4d8;
--text-primary: #18181b; --text-secondary: #52525b; --text-muted: #a1a1aa; --text-inverse: #fafafa;
--accent-violet: #7c3aed; --accent-violet-hover: #6d28d9;
--accent-mint: #2f9e6e; --accent-mint-hover: #26845c;
--top-strip: #0b0b0d;
Keep --color-warning: #f59e0b and --color-danger: #ef4444 as-is; --color-success can reuse the mint value.
Usage rule: violet = primary/CTA/active states only. Mint = secondary/supporting tags only. Alternate them across repeated elements (e.g. stat-card icon borders alternate violet/mint) rather than combining both on one element.

Signature element: add a fixed 5px solid strip in --top-strip color across the full width of every page, in the root layout, above all other content (highest z-index). This is the one persistent brand mark tying every screen together.

Shape: 4px radius on buttons and tags, 6px on cards/modals. 1px hairline border (--border-hairline) on every card, input, and table — no exceptions. NO box-shadow anywhere in the app except one: the primary CTA button gets `0 0 24px rgba(124,58,237,0.25)`. This is the only glow/shadow permitted in the entire redesign — remove all others, including any existing card hover shadows.

Background wash: only on the public landing page (app/page.tsx) hero section, a soft diagonal gradient combining --bg-wash-violet (top-left) and --bg-wash-mint (top-right) over --bg-canvas. Every dashboard/app-interior screen (admin and student route groups) stays flat --bg-canvas with no wash — dense data screens shouldn't fight a gradient.

Numbered content blocks (01 / 02 / 03 style, mono uppercase labels): use ONLY where content is genuinely sequential — a task's step-by-step instructions, an evaluation/review pipeline explainer, an onboarding checklist. Do NOT add numbering to the dashboard's stat cards (Active Tasks, Pending Reviews, My Submissions, Deadlines Soon) since those are a set, not a sequence — leave that as a plain grid.

Motion: keep/create components/ui/motion.ts with these Framer Motion variants if not already present:
EASE_FAST = [0.16, 1, 0.3, 1]
fadeUp: hidden {opacity:0,y:6} → visible {opacity:1,y:0, duration 0.18s ease EASE_FAST}
stagger: staggerChildren 0.035s
pressable: rest {scale:1} → tap {scale:0.97, duration 0.1s}
heroReveal: hidden {opacity:0,y:10} → visible {opacity:1,y:0, duration 0.32s ease EASE_FAST}
Sidebar active-item indicator becomes a motion.div with layoutId="sidebar-indicator" in --accent-violet that slides between nav items. heroReveal + stagger runs once on first load of the landing page and first dashboard visit only, at word/line level on the hero heading — not on every navigation. Respect prefers-reduced-motion by collapsing all durations to 0.

Component specifics:
- Sidebar (components/admin/Sidebar.tsx, components/student/Sidebar.tsx): switch from dark full-bleed shell to --bg-surface background with 1px right hairline border. Nav items in JetBrains Mono uppercase tracked, --text-secondary default, --text-primary + violet left indicator + 4-6% violet background wash when active.
- Stat cards (dashboard pages): white surface, 1px hairline border, no shadow, mono uppercase muted eyebrow label above a bold --text-primary number (no gradient text), small square icon container (not circle) with a 1px border alternating violet/mint across the card row.
- Tags/badges (task category tags, due-date pills): change from filled pill to outlined rectangle, 4px radius, 1px border in the tag's own color, mono uppercase text in that color, transparent background.
- Primary button: solid --accent-violet fill, --text-inverse label, mono uppercase tracked, 4px radius, the one permitted glow shadow, pressable tap motion.
- Secondary/ghost buttons: transparent or --bg-surface, 1px hairline border, text-secondary → text-primary on hover, no glow ever.
- Tables: mono uppercase muted headers wide-tracked, 1px bottom hairline per row, hover uses a very light --bg-wash-mint tint instead of flat gray.
- Landing page hero (app/page.tsx): mono uppercase eyebrow line, bold headline with exactly one word in Instrument Serif italic, supporting paragraph can be italic serif at body size, and — only if genuinely sequential content exists to show — one numbered 3-item info panel using the pattern above.

EXECUTION ORDER (verify the build compiles after each step): 1) grep for old-theme signatures and list the real file scope, 2) add fonts + top strip in root layout.tsx, build, 3) update globals.css/tailwind tokens, build, 4) migrate components/ui/* one at a time (Button, Input, Badge/Tag, Card, Table), building after each, 5) migrate Sidebar (admin + student), build, 6) migrate dashboard page.tsx files (admin + student), build, 7) migrate app/page.tsx, login, register, build, 8) final grep confirming zero remaining old-theme references, 9) run git diff --stat and list every file changed.

Hard rules: no code comments anywhere, no new npm dependencies beyond font loading via next/font/google (Framer Motion is already installed), no renamed components/props, no changes to files outside the allowed scope (middleware.ts, lib/, models/, hooks/, api/, types/ stay untouched). When finished: run rm -rf .next && npm run build, then output git diff --stat so every changed file is visible and verifiable.
```