# DevJourney - UI & Theme PRD (Current State)

This document outlines the current state of the User Interface (UI), Design System, and Theming for the DevJourney project. This serves as a baseline reference before any new design changes are made.

## 1. Overview & Aesthetic
DevJourney currently employs a **modern, deep-dark theme** heavily inspired by premium developer tools. The aesthetic relies on **glassmorphism**, deep background colors with low-contrast borders, and vibrant blue/purple accents with subtle glow effects.

## 2. Tech Stack & UI Libraries
- **Framework:** Next.js 15 (App Router)
- **Styling Engine:** Tailwind CSS 3.4
- **Animation:** Framer Motion (v11) & Custom CSS Keyframes
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Component Architecture:** Custom-built components (not relying on a heavy UI library like MUI or AntD). Located in `src/components/ui/` (Badges, Button, Common, Input, Modal).

## 3. Typography
The application uses highly readable, modern fonts tailored for tech interfaces.
- **Primary Font (Sans-serif):** `Inter`, system-ui, sans-serif
- **Monospace (Code):** `JetBrains Mono`, `Fira Code`, monospace
- **Global Base Defaults:** `14px` font size with a `1.6` line height.

## 4. Color Palette

### Backgrounds (Deep Dark)
- **Base / Body:** `#0a0a0f`
- **Secondary:** `#111118` (used for inputs, scrollbars)
- **Card / Surface:** `#16161e` (used for components, modals)
- **Hover:** `#1c1c28`

### Text & Content
- **Primary:** `#f1f5f9` (High contrast, near white)
- **Secondary:** `#94a3b8` (Medium contrast)
- **Muted / Disabled:** `#64748b`

### Accents & Primary Brand (Blue)
- **Default:** `#3b82f6` (Vibrant Blue)
- **Hover:** `#2563eb`
- **Muted/Subtle:** `#1d4ed8` / `#1e3a5f`

### State & Feedback Colors
- **Success:** `#22c55e` (Green)
- **Warning:** `#f59e0b` (Amber/Yellow)
- **Danger:** `#ef4444` (Red)

### Borders
- **Default:** `#2a2a3a`
- **Subtle:** `#1e1e2e`

## 5. Design System Details & Visual Effects

### Glassmorphism & Cards
- **`.glass` / `.card`:** Components use semi-transparent backgrounds (`rgba(22, 22, 30, 0.8)`) combined with a heavy backdrop-blur (`20px`).
- **Shadows:** Cards use a multi-layered shadow approach (`box-shadow: 0 0 0 1px rgba(42,42,58,0.8), 0 4px 24px rgba(0,0,0,0.4)`).
- Hovering over interactive cards slightly brightens the border with the accent blue and deepens the shadow.

### Gradients & Glows
- **Hero Gradient:** A dual-radial gradient using transparent blue and purple at the top of the screen (`.hero-gradient`).
- **Text Gradients:** Important headings use a horizontal gradient from blue to purple (`bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400`).
- **Glow Effects:** `.glow` and `.glow-sm` utility classes apply a blue box-shadow spread to emphasize elements.

### Animations
- **CSS Keyframes:** `fadeIn`, `slideUp`, `slideInRight`, and `shimmer`.
- **Skeletons:** Loading states use a custom dark-gradient `shimmer` animation (`.skeleton`).

### Border Radii
- **Small Elements (Badges):** Fully rounded (`rounded-full`)
- **Inputs & Buttons:** `8px` (`rounded-lg`)
- **Cards & Modals:** `12px` (`rounded-xl`)

## 6. Core UI Component Specifications
All base styles are centrally managed in `src/app/globals.css` using Tailwind's `@layer components`.

- **Buttons (`.btn`):**
  - *Primary:* Solid blue background, subtle blue glow.
  - *Secondary:* Dark gray background, light border.
  - *Ghost:* No background, text brightens on hover.
  - *Danger/Success:* Tinted background (10% opacity) with colored borders.
- **Inputs (`.input`):** Solid dark background, thin border. On focus, the border turns blue and a 30% opacity blue ring appears.
- **Badges (`.badge`):** Pill-shaped indicators. They follow a tinted formula: 10% background opacity + 20% border opacity of the respective color (e.g., Blue, Green, Yellow, Red, Gray, Orange).
- **Sidebar Items (`.sidebar-item`):** 
  - Default: Medium gray text, transparent background.
  - Active: Blue tinted background, blue text, and a distinct `2px` inset blue border on the left (`box-shadow: inset 2px 0 0 #3b82f6`).
- **Tables (`.table`):** Minimalist design with muted uppercase headers. Rows have a subtle bottom border and lighten on hover.
