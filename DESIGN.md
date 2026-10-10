---
name: CloudOps AI
description: The operations console — a calm white workspace where every cloud measurement is plotted and every redline waits for review.
colors:
  ground: "#f9fbfc"
  surface: "#ffffff"
  ink: "#141721"
  ink-2: "#3d4351"
  ink-3: "#5c6470"
  muted: "#6b7280"
  line: "#e9edf1"
  line-strong: "#d8dee5"
  accent: "#dc589a"
  accent-strong: "#b02368"
  accent-soft: "#fcf2f8"
  accent-line: "#f2c4dd"
  ok: "#0a7a47"
  ok-soft: "#e7f6ee"
  warn: "#b54708"
  warn-soft: "#fdf3e4"
  danger: "#b42318"
  danger-soft: "#fdecea"
  button-ink: "#202936"
typography:
  ui:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    reason: "A precise neo-grotesque close to the pinned reference's neutral UI voice, outside the default-reach list."
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
  card: "0 1px 2px rgba(20,23,33,0.04), 0 1px 3px rgba(20,23,33,0.06)"
  toast: "0 10px 30px rgba(20,23,33,0.16)"
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
dashboard, `beehiiv Web 193.png`). White cards on a cool near-white ground, one
magenta-pink data accent, comfortable density. The Overview is chart-forward:
the signal curve is the loudest element, the findings queue sits beside it, and
the measurement register is a quiet row of four cards above both.

The world refuses the dark glowing "AI dashboard", the navy dev-tool cliché,
and KPI-card wallpaper with no chart anywhere. Depth comes from a hairline card
border plus one soft card shadow; the toast is the only surface that floats.
The read-only promise and the honesty rule (an unmeasured value is an em dash,
never an invented number) are part of the design, not disclaimers under it.

## Colors

Sampled from the pinned reference's rendered pixels, then measured for contrast.

### Primary
- **Signal pink** `#dc589a` (strong `#b02368`, soft `#fcf2f8`, line `#f2c4dd`):
  the one data accent. Chart traces, active navigation, chart fills, links,
  focus rings. Its job is measurement and selection; nothing else is pink.
- **Button ink** `#202936`: the primary action ground ("Add a scan"), with the
  hover at `#2c3a4c`.

### Status (four states, hue plus word plus shape)
- OK `#0a7a47` on `#e7f6ee`: connected, running, reported savings.
- Warn `#b54708` on `#fdf3e4`: unavailable, pending, medium severity.
- Danger `#b42318` on `#fdecea`: high severity.
- Neutral chips: ink on `--line` ground.

### Neutral
- Ink `#141721` (headings, values), ink-2 `#3d4351` (body), ink-3 `#5c6470`
  (secondary, table body), muted `#6b7280` (captions).
- Ground `#f9fbfc`, surface `#ffffff`, line `#e9edf1`, line-strong `#d8dee5`.

### Named Rules
**The One-Accent Rule.** Pink carries data and selection; ink carries actions;
status hues carry state. Three jobs, never confused.
**The Honesty Rule.** A value the API did not return is an em dash with the
reason beside it. Never a zero, never a guess.

## Typography

**UI:** Schibsted Grotesk (self-hosted variable), metric-matched Arial fallback.
**Data:** JetBrains Mono (self-hosted variable), tabular figures, for instance
IDs, costs, dates and table numerals.

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

Flat by default: one card shadow (a single soft layer at 5% ink), hover tints,
no lift, no glow. The toast float is the only elevation above card level.
Forced-colors mode keeps every control's shape through transparent borders.

## Shapes

Radius family 8 (controls) / 10 (cards) / 12 (panels) / pill (chips, dots);
inner radii nest concentrically. No large rounded-hero shapes, no blobs, no
circles masquerading as content.

## Components

- **Register cell** — white card: label (12/600 muted), value (30/600 tabular),
  source note. Unmeasured value renders as an em dash in muted.
- **Chart card** — the signal curve: recharts step-area, 2px accent stroke,
  pink gradient fill, hairline horizontal grid, mono axis ticks, custom mono
  tooltip. Draws itself in over ~900ms ease-out when data lands; reduced motion
  gets the complete static frame.
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
  (Connected green / Offline amber / Sample pink), the region, and the dark
  primary button pushed to the right, so the heading reads from the edge and the
  action lands in the same corner.
- **Sample banner** — amber notice with bold "Sample data." prefix and a Load
  live data action; reachable only via `?sample=1`.

## Do's and Don'ts

### Do:
- Keep the chart the loudest element on the Overview.
- Set IDs, costs and dates in mono tabular figures.
- Use pink for data and selection only; ink for actions; hue+word+shape for status.
- Render unavailable measurements as em dashes with the reason and the fix.
- Give controls transparent borders so High Contrast keeps their shape.

### Don't:
- Add gradients, glows, orbs, or a dark "AI" theme.
- Put a KPI row above a chart that does not exist yet.
- Use pink decoration outside data/selection, or status hue without its word.
- Fabricate deltas, trends, savings, or "vs last period" numbers the API does
  not return.
- Put hover-only information on the phone; the queue and table are complete
  without hover.
