---
name: CloudOps AI
description: The operations console — a calm sage-and-teal workspace where every cloud measurement is plotted and every redline waits for review.
stack:
  app: "Vite + React 19 SPA over a FastAPI backend"
  styling: "Tailwind CSS v4 + shadcn (base-luma, Base UI primitives, Phosphor icons)"
  theme: "Light only"
colors:
  # app tokens (src/styles/tokens.css)
  ground: "#f4f6f1"
  surface: "#fafbf8"
  surface-2: "#e9eee7"
  ink: "#171a18"
  ink-2: "#535d57"
  ink-3: "#535d57"
  text-muted: "#626c65"
  line: "#e0e5de"
  line-strong: "#c8d0c9"
  brand: "#52796f"
  brand-strong: "#354f52"
  brand-soft: "#dce5dc"
  brand-line: "#cad2c5"
  ok: "#247346"
  ok-soft: "#e6f4ea"
  warn: "#956000"
  warn-soft: "#fff3d6"
  danger: "#b42318"
  danger-soft: "#fce8e8"
  # shadcn theme (src/index.css)
  primary: "#354f52"
  primary-foreground: "#ffffff"
  secondary: "#eef2ee"
  accent: "#dce5dc"
  muted: "#e9eee7"
  border: "#e0e5de"
  input: "#c8d0c9"
  ring: "#52796f"
  chart: ["#cad2c5", "#84a98c", "#52796f", "#354f52", "#2f3e46"]
  success: "#247346"
  warning: "#956000"
  info: "#315db5"
typography:
  ui:
    fontFamily: "Inter, system-ui, sans-serif"
    reason: "A neutral UI grotesque with a tall x-height and clear numerals; even rhythm at 12-15px."
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    reason: "Strictly identifiers, costs and tabular data: the measurement face, never a costume."
  scale:
    page: { fontSize: "28px", fontWeight: 600, letterSpacing: "-0.02em" }
    card: { fontSize: "15px", fontWeight: 600 }
    body: { fontSize: "13px", fontWeight: 400, lineHeight: 1.5 }
    meta: { fontSize: "12px" }
    kpi: { fontSize: "30px", fontWeight: 600, variantNumeric: "tabular-nums" }
    table: { fontSize: "13px", rowHeight: "48px" }
spacing: [4, 8, 12, 16, 20, 24, 32, 40, 56]
radius:
  control: "8px"
  card: "10px"
  panel: "12px"
  pill: "999px"
elevation:
  card: "0 1px 2px rgba(47,62,70,0.05)"
  toast: "0 10px 30px rgba(47,62,70,0.16)"
layout:
  rail: "248px"
  titleblock: "64px"
  contentMax: "1440px"
  contentPad: "32px"
  drawerBreakpoint: "860px"
---

# Design System: CloudOps AI

## Overview

**Creative North Star: "The Operations Console"** (pinned reference: the beehiiv
dashboard, `beehiiv Web 193.png`). Soft sage surfaces over a warm near-white
ground, one deep-teal data accent, comfortable density. The Overview is
chart-forward: the signal curve is the loudest element, the findings queue sits
beside it, and the measurement register is a quiet row of four cards above both.

The world refuses the dark glowing "AI dashboard", the navy dev-tool cliché,
and KPI-card wallpaper with no chart anywhere. Depth comes from a hairline card
border plus one soft card shadow; the toast is the only surface that floats.
The read-only promise and the honesty rule (an unmeasured value is an em dash,
never an invented number) are part of the design, not disclaimers under it.

## Stack

Tailwind CSS v4 is configured through `@tailwindcss/vite`, and shadcn is
initialized on the `base-luma` style with Base UI primitives (Button lives in
`src/components/ui/`). The hand-written console CSS in `src/App.css` is the
primary surface; shadcn supplies primitives and its theme layer. The shadcn
theme variables and the app tokens (`src/styles/tokens.css`) carry the same
palette and must be changed together.

## Colors

The sage system: greens for brand and data, a warm neutral for ground and ink,
and four status families. No gradients, no glows.

### Surfaces
- Ground `#f4f6f1` (page), card/surface `#fafbf8`, secondary surface / sidebar
  `#e9eee7`, selected surface `#dce5dc`. Lines: default `#e0e5de`, strong
  `#c8d0c9` (form borders).

### Brand and data
- **Intelligence green** `#52796f`: the one data accent — chart traces, active
  navigation, links, the connection dot. Deep teal `#354f52` is the primary
  action ground ("Add a scan") and hover; sage mist `#cad2c5` and soft sage
  `#84a98c` round out the chart ramp with `#2f3e46`.
- **Focus ring** `#52796f`.

### Text
- Ink `#171a18` (headings, values), ink-2/ink-3 `#535d57` (body, table),
  muted `#626c65` (captions). The brief's muted `#77817a` was darkened to
  `#626c65` so captions clear WCAG AA (4.5:1) on the ground, cards and sidebar.

### Status
- Success `#247346` on `#e6f4ea`; Warning `#956000` on `#fff3d6`; Critical
  `#b42318` on `#fce8e8`; Information `#315db5` on `#eaf0fc`. Every status
  carries hue plus word plus shape.

### Named Rules
**The One-Accent Rule.** Teal carries data and selection; ink carries actions;
status hues carry state. Three jobs, never confused.
**The Honesty Rule.** A value the API did not return is an em dash with the
reason beside it. Never a zero, never a guess.

## Typography

**UI:** Inter (self-hosted via `@fontsource-variable/inter`), metric-matched
Arial fallback. **Data:** JetBrains Mono, tabular figures, for instance IDs,
costs, dates and table numerals.

Hierarchy: page title 28/600; card title 15/600; body 13/1.5; caption 12; KPI
value 30/600 tabular; table 13px on 48px rows. Sentence case everywhere. Numbers
that align or change are mono + tabular.

## Layout

248px rail (grouped Monitor/Govern navigation, then the read-only note and
Settings as the last group at the foot of the rail), 64px title block, content
capped at 1440px with 32px padding.
The Overview: heading row with the data-status pill and Refresh, the four-card
register, then the signal chart card beside the findings queue, then the resource
table and the IaC review. The rail becomes a drawer at 860px; the register drops
to two columns at 1180 and one at 560; the table scrolls inside its card on
phones instead of overflowing the page.

## Elevation & Depth

Flat by default: one card shadow (a single soft layer at 5% slate), hover tints,
no lift, no glow. The toast float is the only elevation above card level.
Forced-colors mode keeps every control's shape through transparent borders.

## Shapes

Radius family 8 (controls) / 10 (cards) / 12 (panels) / pill (chips, dots);
inner radii nest concentrically. No large rounded-hero shapes, no blobs, no
circles masquerading as content.

## Components

- **Register cell** — card: label (12/600 muted), value (30/600 tabular),
  source note. Unmeasured value renders as an em dash in muted.
- **Chart card** — the signal curve: recharts step-area, 2px teal stroke, teal
  gradient fill, hairline horizontal grid, mono axis ticks, custom mono tooltip.
  Draws itself in over ~900ms ease-out when data lands; reduced motion gets the
  complete static frame.
- **Findings queue** — severity dot, issue, severity chip, mono resource id,
  reported saving (or em dash), Review expands to action/evidence/resource.
- **Table card** — toolbar (mono-placeholder search, state filter buttons with
  counts, sort toggle), 48px hairline rows, mono IDs, state chips, utilization
  bar with mono value, per-row expandable detail, footer with counts.
- **IaC review** — a two-column spec record of six fields, each an em dash with
  the reason beside it, set in mono tabular figures. No plan is submitted from
  the interface (read-only), so the record holds no diagram that would imply
  one exists; it fills in when a plan arrives.
- **Title block** — wordmark and AWS account on the left; the connection chip
  (Connected green / Offline amber / Sample sage), the region, and the dark
  primary button pushed to the right, so the heading reads from the edge and the
  action lands in the same corner.
- **Sample banner** — amber notice with a bold "Sample data." prefix and a Load
  live data action, in warning ink on warning ground; the data is sample by
  default and `?sample=0` opts back into the live backend.

## Do's and Don'ts

### Do:
- Keep the chart the loudest element on the Overview.
- Set IDs, costs and dates in mono tabular figures.
- Use teal for data and selection only; ink for actions; hue+word+shape for status.
- Render unavailable measurements as em dashes with the reason and the fix.
- Give controls transparent borders so High Contrast keeps their shape.
- Keep shadcn theme variables and app tokens in step when the palette changes.

### Don't:
- Add gradients, glows, orbs, or a dark "AI" theme.
- Put a KPI row above a chart that does not exist yet.
- Use teal decoration outside data/selection, or status hue without its word.
- Fabricate deltas, trends, savings, or "vs last period" numbers the API does
  not return.
- Put hover-only information on the phone; the queue and table are complete
  without hover.
