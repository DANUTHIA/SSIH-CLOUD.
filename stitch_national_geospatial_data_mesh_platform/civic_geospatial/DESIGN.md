---
name: Civic GeoSpatial
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4850'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#8d4b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#b15f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Public Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Public Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Public Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Public Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  mono-coord:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 1.5rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system targets mission-critical public sector workflows, municipal geospatial intelligence, and enterprise civic planning. Its primary audience includes GIS technicians, civil engineers, urban analysts, and departmental administrators who require dense, error-free operational software. 

The aesthetic is precision-driven Corporate / Modern with utilitarian Swiss clarity:
- **Tone:** Objective, dependable, high-density, authoritative.
- **Visual Stance:** Zero decorative clutter, strict visual hierarchy, immediate status legibility, and high data density.
- **Interaction Style:** Direct, deterministic states with razor-thin hairline borders, low-diffusion elevations, and structural alignment tailored for multi-layered map viewports and dense tabular data.

## Colors

The palette establishes maximum legibility and strict contrast ratios complying with WCAG 2.1 AAA for text and AA for visual boundaries:

- **Primary (`#0284c7`):** Institutional sky blue used for active vector selections, primary commands, focus rings, and primary interactive indicators.
- **Secondary (`#0d9488`):** Deep teal/emerald designating spatial verification, activated data layers, environmental indicators, and positive confirmations.
- **Tertiary (`#d97706`):** Precision amber utilized for spatial alerts, uncommitted topology changes, and cautionary operational thresholds.
- **Error (`#dc2626`):** Crisp institutional red for coordinate invalidations, service interruptions, and destructive administrative actions.
- **Surfaces:**
  - Base Canvas (`#f8fafc`): Foundations, viewport underlays, map container backgrounds.
  - Surface Container (`#ffffff`): Cards, floating spatial toolbars, inspector sidebars, popovers.
  - Surface Container High (`#f1f5f9`): Data table headers, tool shelves, nested dock panels.
  - Surface Dim / Inactive (`#e2e8f0`): Disabled states, partition backgrounds, drag gutters.
- **Borders & Dividers:**
  - Hairline Rule (`#e2e8f0`): Structural layout dividers and internal list rules.
  - Interactive / Boundary Border (`#cbd5e1`): Card frames, inputs, segmented controls.
- **Typography:**
  - Primary Text (`#0f172a`): High-contrast deep slate for headers, metrics, and primary records.
  - Secondary Text (`#334155`): Neutralized slate for metadata, labels, and secondary attributes.

## Typography

The typography couples the accessibility and civic neutrality of **Public Sans** with the exactness of **JetBrains Mono** for numerical records, coordinates, and layer attributes:

- **Public Sans:** Serves as the universal UI, label, and structural body font. Its open apertures and sturdy stems ensure legibility under high-density dashboards and prolonged display usage.
- **JetBrains Mono:** Restricted strictly to spatial coordinate readouts (lat/long, UTM, state planes), bounding box geometry, scale metrics, and attribute table values.
- **Application Guidelines:**
  - Capitalize all `label-sm` elements when used as table column headers or category demarcations.
  - Coordinate data strings must maintain tabular figures (`tnum`) to eliminate visual jitter during real-time map pan and zoom events.

## Layout & Spacing

The layout model optimizes for workspace density and multi-pane spatial toolsets:

- **Layout Structure:** Multi-region dock system consisting of a persistent vertical utility bar (48px fixed), collapsible collapsible inspector/layer shelves (280px–360px), a fluid central map/data canvas, and an optional bottom attribute table drawer (collapsible, 240px default).
- **Responsive Adaptations:**
  - **Desktop (>= 1280px):** Simultaneous display of persistent left toolrail, floating spatial overlay panels, and docked layer tree.
  - **Tablet (768px - 1279px):** Inspector panels switch from docked to off-canvas sheets. Attribute tables transition to an overlay tab.
  - **Mobile (< 768px):** Single-pane full viewport. Floating controls collapse into bottom sheets; map viewports take visual precedence.
- **Grid & Rhythm:** A tight 4px baseline system (`0.25rem` multiples) governs component internals to maximize vertical screen efficiency.

## Elevation & Depth

This system avoids expressive blur or soft illustrative shadowing in favor of structured architectural depth:

- **Depth Philosophy:** Functional planar hierarchy constructed via structural hairline borders combined with faint, directional cool-tinted shadows.
- **Levels:**
  - **Base Layer (0dp):** Surface `#f8fafc` canvas and map viewports.
  - **Docked Panes (Flat):** No shadow; demarcated purely by a 1px solid border of `#e2e8f0`.
  - **Floating Overlays (Level 1 - Floating Toolbars, Chips):** `0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04)` with a 1px `#cbd5e1` boundary border.
  - **Floating Dialogs & Flyouts (Level 2 - Layer Menus, Popovers):** `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)` with a 1px `#cbd5e1` boundary border.
  - **System Modals & Spatial Inspector Overlays (Level 3):** `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)`.
- **Underlay Backdrop:** High-opacity white wash (`rgba(248, 250, 252, 0.75)`) with a light 4px blur, preventing visual clutter behind modal windows.

## Shapes

The geometric signature uses concise, tight corners (`roundedness: 1`, base radius: `0.25rem` / 4px):

- **Compact Footprint:** Modest radii maintain square data profiles, preventing dead corner space in tight spatial viewports and multi-column inspector panes.
- **Exceptions:**
  - Map status pills and active drawing mode indicators leverage full pill styling (`9999px`) to distinguish situational canvas controls from structural panels.
  - Internal table cells, split-button dividers, and coordinate grid entries strictly retain square (`0px`) joints.

## Components

### Buttons
- **Primary:** Background `#0284c7`, text `#ffffff`, border none. Hover `#0369a1`. Active `#075985`. Focus ring: 2px offset with `#0284c7`.
- **Secondary:** Background `#ffffff`, text `#0f172a`, border 1px solid `#cbd5e1`. Hover `#f1f5f9`.
- **Destructive:** Background `#ffffff`, text `#dc2626`, border 1px solid `#fca5a5`. Hover `#fef2f2`.
- **Geometry:** Height 32px (compact) or 36px (default). Padding inline 12px. Radius 4px.

### Form Inputs & Geometry Pickers
- **Text Inputs:** Height 32px. Surface `#ffffff`, border 1px solid `#cbd5e1`, text `#0f172a`, placeholder `#94a3b8`. Focus state shifts border to `#0284c7` with a 1px outline box-shadow.
- **Coordinate Inputs:** Displayed with JetBrains Mono font (`mono-coord`), paired with an inline copy-to-clipboard or crosshair capture icon.

### Checkboxes & Radios
- Box size 16px by 16px. Border 1.5px solid `#94a3b8`, radius 3px for checkboxes, full circle for radios. Checked background `#0284c7` displaying a white crisp check icon.

### Cards & Inspector Panels
- **Inspector Panels:** Background `#ffffff`, border 1px solid `#e2e8f0`. Header background `#f8fafc`, separated by a 1px hairline border, containing title in `title-md` and quick-close/collapse actions.
- **Layer Selection Cards:** Padding 8px 12px. Hover state applies `#f1f5f9`. Selected state applies a 2px left border accent of `#0284c7` and a surface tint of `rgba(2, 132, 199, 0.04)`.

### Chips & Layer Badges
- **Status Chips:** Height 22px. Padding inline 6px. Radius 3px. Text `label-sm`.
  - *Active Layer:* Background `rgba(13, 148, 136, 0.1)`, text `#0d9488`, border 1px solid `rgba(13, 148, 136, 0.2)`.
  - *Warning/Uncommitted:* Background `rgba(217, 119, 6, 0.1)`, text `#b45309`, border 1px solid `rgba(217, 119, 6, 0.2)`.

### Attribute Tables
- Row height: 28px (compact) to 32px (default). Header surface `#f1f5f9`, border-bottom 1px solid `#cbd5e1`. Alternate rows alternate with `#ffffff` and `#f8fafc`. Active record row marked with `#e0f2fe`. Text adheres to `mono-data`.