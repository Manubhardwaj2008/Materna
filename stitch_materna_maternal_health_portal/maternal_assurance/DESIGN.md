---
name: Maternal Assurance
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#4a4453'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#7b7485'
  outline-variant: '#ccc3d6'
  surface-tint: '#713dcc'
  primary: '#420093'
  on-primary: '#ffffff'
  primary-container: '#5b21b6'
  on-primary-container: '#c7aaff'
  inverse-primary: '#d3bbff'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#003b27'
  on-tertiary: '#ffffff'
  tertiary-container: '#005439'
  on-tertiary-container: '#58cd9b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ebddff'
  primary-fixed-dim: '#d3bbff'
  on-primary-fixed: '#250059'
  on-primary-fixed-variant: '#581db3'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.75rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.625rem
    fontWeight: '700'
    lineHeight: 2.125rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: '0'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: '0'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: '0'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
This design system serves a high-stakes clinical and emotional context: maternal health, prenatal care, and gestational risk monitoring. The personality is grounded in three pillars:
- **Clinical Competence & Authority:** Instilling instant confidence in medical safety, clinical accuracy, and biometric privacy.
- **Empathetic Warmth:** Replacing the cold, intimidating sterility of traditional EHRs (Electronic Health Records) with reassuring, tactile, and calming visual rhythm.
- **Cognitive Clarity:** Eliminating anxiety and visual noise through spacious card-based layouts, unambiguous status indicators, and clear data hierarchy.

The aesthetic fuses **Soft Modern Healthcare** with **Editorial Warmth**. It eschews stark hospital blues and harsh gray borders in favor of deep protective purples, breathable lavender-tinted surfaces, and gentle radii. The design avoids playful or frivolous decorations, prioritizing legibility, calm focus, and deliberate interaction cues.

## Colors
The color foundation utilizes therapeutic, dignified purples paired with high-contrast slate neutrals and dedicated clinical semantic anchors.

### Core Swatches
- **Primary (`#5B21B6` / `#4C1D95`):** Deep Royal Violet. Communicates authority, clinical governance, and institutional stability. Used for critical CTAs, active states, key navigation elements, and primary branding.
- **Secondary (`#7C3AED`):** Radiant Calming Violet. Used for interactive highlights, focus accents, progress rings, and non-critical active elements.
- **Tertiary (`#059669`):** Restorative Sage Green. Designates positive physiological signals, normal lab ranges, and stable maternal indicators.
- **Neutral (`#1E293B`):** Deep Slate Ink. Delivers superior contrast and legible reading comfort against warm off-white and lavender backgrounds.

### Surface System
- **Surface Baseline (`#FFFFFF`):** Crisp pure white applied to actionable cards, clinical data pods, and modal overlays.
- **Surface Canvas (`#F5F3FF`):** Soft lilac-tinted canvas background, minimizing eye strain across extended usage sessions.
- **Surface Subtle (`#EDE9FE`):** Muted lavender used for table header fills, segmented control tracks, and neutral tag backdrops.

### Alert & Triage Semantics
- **Critical / Urgent (`#E11D48`):** Crimson Rose. Reserved strictly for acute alerts (e.g., preeclampsia warnings, elevated BP thresholds, emergency triage).
- **Caution / Warning (`#D97706`):** Amber. Applied to overdue check-ins, borderline lab metrics, and scheduled window alerts.
- **Informational (`#2563EB`):** Cerulean. Educational notes, upcoming appointments, and clinical insights.

## Typography
The system uses **Plus Jakarta Sans** across all text levels. Its geometric clarity combined with subtle humanistic curves provides natural readability and approachable authority.

### Usage Guidelines
- **Headlines (`display-lg`, `headline-lg`, `headline-md`):** Use for week-by-week gestation titles, clinical screen summaries, and primary dashboard greetings. Use tight tracking (`-0.02em`) to maintain composure and authority.
- **Body (`body-lg`, `body-md`, `body-sm`):** Deliver symptom tracking descriptions, clinical notes, and onboarding guides. The generous line heights (`1.5` to `1.6`) ensure high legibility under stress or low-light conditions.
- **Labels (`label-lg`, `label-md`, `label-sm`):** Engineered for biometric tags, risk tier capsules, timestamp indications, and form captions. Ensure uppercase styling is restricted exclusively to `label-sm` when tracking clinical metric abbreviations (e.g., `BPM`, `MMHG`, `GEST. WEEK`).

## Layout & Spacing
The layout follows a flexible 12-column grid on desktop and a single/dual-column flow on handheld interfaces, adhering strictly to an 8px base rhythm (with a 4px half-step for micro-alignment).

### Responsive Adaptation
- **Mobile (`< 768px`):** Single column. `margin-mobile` (16px) establishes edge security. Spacers scale back by one stop (e.g., card internal padding defaults to `space-md` rather than `space-lg`). Stack risk factors and vital stat cards vertically.
- **Tablet (`768px – 1024px`):** 6-column grid with `gutter` (24px) and `margin` (32px). Allows side-by-side comparison of maternal vitals and fetal growth logs.
- **Desktop (`> 1024px`):** 12-column grid capped at a maximum width of `1280px`. The dashboard layout reserves 3 columns for patient risk triage/navigation and 9 columns for continuous health logs and longitudinal charts.

## Elevation & Depth
Depth is created through low-intensity lavender-tinted ambient shadows and subtle tonal layering, avoiding heavy drop shadows that produce clinical gloom.

### Depth Hierarchy
- **Level 0 (Flat Canvas):** `#F5F3FF` base background.
- **Level 1 (Card & Content Surface):** `#FFFFFF` surfaces with a 1px border of `#E2E8F0` (or `rgba(91, 33, 182, 0.08)`) and an ambient shadow: `0 1px 3px rgba(76, 29, 149, 0.04), 0 4px 12px rgba(76, 29, 149, 0.03)`.
- **Level 2 (Interactive Floating Elements & Dropdowns):** Popovers, date selectors, and active hovering cards receive: `0 4px 6px -1px rgba(76, 29, 149, 0.05), 0 10px 20px -2px rgba(76, 29, 149, 0.06)`.
- **Level 3 (Urgent Dialogs & Emergency Modals):** Critical alert sheets and physician handoff dialogs use: `0 20px 25px -5px rgba(30, 41, 59, 0.08), 0 8px 10px -6px rgba(30, 41, 59, 0.04)` paired with a soft lavender/slate backdrop blur (`backdrop-blur-sm` over `rgba(30, 41, 59, 0.4)`).

## Shapes
A roundedness tier of **2** enforces a protective, organic, and welcoming geometry throughout all touchpoints.

### Corner Radius Mapping
- **Input Fields & Small Buttons:** Rounded by `0.5rem` (8px), signaling stability and clear form boundary targets.
- **Standard Cards, Action Sheets & Metric Blocks:** Rounded by `1rem` (16px, `rounded-lg`) to soften content blocks and distinguish individual data sets.
- **Feature Cards, Hero Modules & Modal Sheets:** Rounded by `1.5rem` (24px, `rounded-xl`) creating an encompassing, cradle-like enclosure for high-priority health summaries.
- **Badges, Status Pills & Avatar Rings:** Full circular/pill geometry (`9999px`) to maintain contrast against structural square grids.

## Components

### Buttons
- **Primary Button:** Solid `#5B21B6` background, `#FFFFFF` text, `0.5rem` border-radius. On hover: shifts to `#4C1D95` with a subtle elevation shift. Focus state: 3px ring of `#C4B5FD`.
- **Secondary Button:** Surface `#FFFFFF` with a 1.5px solid `#DDD6FE` border and `#5B21B6` text. Hover: `#F5F3FF`.
- **Emergency / Alert Action Button:** `#E11D48` background with `#FFFFFF` text for immediate triage routing, high-risk flags, or direct physician dialing.

### Cards & Metric Panels
- Built on crisp `#FFFFFF` backgrounds wrapped with a 1px border of `rgba(91, 33, 182, 0.08)`.
- **Header:** Houses a categorical badge alongside the patient's gestational timeline indicator (e.g., "Week 28 • Trimester 3").
- **Metric Content:** Large numerical displays (`headline-lg`) paired with micro-labels (`label-md`) beneath for clear physiological comprehension (e.g., `118/76` with sub-label `Blood Pressure (mmHg)`).

### Medical Status Badges & Pills
- Fully rounded pills (`rounded-full`) with an internal padding of `0.25rem 0.75rem`.
- **Optimal / Normal:** `#ECFDF5` background with `#047857` text and a solid 1px `#A7F3D0` border.
- **Monitoring / Moderate Risk:** `#FFFBEB` background with `#B45309` text and a solid 1px `#FDE68A` border.
- **High Risk / Urgent Alert:** `#FFF1F2` background with `#BE123C` text and a solid 1px `#FECDD3` border.

### Inputs & Form Controls
- **Text Inputs:** `#FFFFFF` background, `0.5rem` radius, 1.5px border of `#E2E8F0`. Focus state: shifts border color to `#7C3AED` with an outer glow of `rgba(124, 58, 237, 0.15)`. Labels sit above inputs using `label-lg` in `#1E293B`.
- **Checkboxes & Radios:** Curved (`0.25rem` for checkbox, circular for radio) with a 2px `#CBD5E1` boundary. Checked state uses solid `#5B21B6` with a crisp white check icon.

### Specialized Health Components
- **Trimester Timeline Scrubber:** Horizontal track with rounded segment milestones (`#EDE9FE`), filling with a `#7C3AED` gradient as gestational age advances.
- **Symptom Quick-Logger:** Card chips configured as accessible toggle blocks with soft lilac borders that illuminate to solid `#5B21B6` text and lavender fill when active.