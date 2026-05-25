---
name: aqua2-ui
description: >
  Reference for the Aqua2 UI framework used across this codebase. Use this skill whenever
  you are adding, editing, or reviewing any HTML/CSS/JS that involves UI components — buttons,
  inputs, checkboxes, radio buttons, chips, text buttons, sliders, progress bars, scrollbars, selects, graphs, or tab views.
  Also use it when working with theming, dark mode, or color variables. Use it even for small
  changes like adding a single button or tweaking a class name — the framework has critical
  pitfalls that are easy to miss without this reference.
---

# Aqua2 UI Framework

Aqua2 is a self-contained UI framework injected via `aqua2.js`. It injects its own `<style>` tag
on load — no external CSS file to import. Just include the script and use the classes.

```html
<script src="/aqua2.js" defer></script>
```

All components are pure CSS except for **Tab View**, **Select**, **Slider**, **Progress**, **Graph**, and
**Scrollbar**, which require the JS initializers that `aqua2.js` runs automatically on
`DOMContentLoaded`.

---

## CSS Variables (Theming)

All components consume these root variables. Override them to theme the UI. Dark mode variables
apply when `data-theme="dark"` is set on the theme scope (typically `<html>`).

| Variable | Light | Dark |
|---|---|---|
| `--aqua-color` | `#0071e3` | `#1a84ff` |
| `--graphite-color` | `#888888` | `#666666` |
| `--aqua-foreground` | `#1d1d1f` | `#f5f5f7` |
| `--aqua-foreground-muted` | `rgba(0,0,0,0.38)` | `rgba(255,255,255,0.32)` |
| `--aqua-background` | `rgba(0,0,0,0.07)` | `rgba(255,255,255,0.10)` |
| `--aqua-border` | `rgba(0,0,0,0.12)` | `rgba(255,255,255,0.14)` |

**Important:** `--aqua-color` is blue. `--graphite-color` is grey. Every component has an
`aqua-` variant (blue accent) and a `graphite-` variant (grey accent). They share the same
structure — only the accent colour differs.

---

## Buttons

### Pill button (default)
```html
<button class="aqua-button">Label</button>
<button class="graphite-button">Label</button>
```
- Pill-shaped, `14px`, `font-weight: 500`, `padding: 7px 18px`
- `:active` flashes `--aqua-color` (aqua) or `--graphite-color` (graphite)
- Works on `<button>` or `<a>`

### Circular icon button
```html
<button class="aqua-button-circular">
  <svg>...</svg>
</button>
<button class="graphite-button-circular">
  <svg>...</svg>
</button>
```
- Fixed `30×30px`, `border-radius: 50%`
- SVGs inside are automatically sized to `18×18px`

### Square icon button
```html
<button class="aqua-button-square">
  <svg>...</svg>
</button>
```
- Fixed `30×30px`, `border-radius: 0`

### Focused / pulsing button
Append `-focused` to any button class to make it pulse with an animated glow. Used for primary
call-to-action buttons.
```html
<button class="aqua-button-focused">Primary Action</button>
<button class="aqua-button-circular-focused"><svg>...</svg></button>
<button class="graphite-button-focused">Neutral Action</button>
<button class="graphite-button-circular-focused"><svg>...</svg></button>
```
- The `-focused` suffix is matched by CSS selector `[class$="-focused"]`
- Aqua variant pulses between light and dark blue (`aqua-pulse` keyframe)
- Graphite variant pulses between light and dark grey (`graphite-pulse` keyframe)

### Toggle button
```html
<button type="button" class="aqua-toggle-button" aria-pressed="true">Live</button>
<button type="button" class="graphite-toggle-button" aria-pressed="false">Muted</button>
```
- Pill-shaped button with two states: pressed and unpressed
- State is stored in `aria-pressed`
- JS auto-initializes all toggle buttons and flips `aria-pressed` on click
- Unpressed state uses the normal glass button surface
- Pressed state uses `--aqua-color` or `--graphite-color` with white text
- This is an independent toggle; use `.aqua-text-button-group` when only one option in a group can be pressed

### ⚠️ Critical pitfall — blue flash on custom buttons
If you place **both** `aqua-button` and a custom button class on the same element, the
`aqua-button:active` rule hardcodes `background: var(--aqua-color)` (blue). This causes a
one-frame blue flash before any custom `:active` styles kick in.

**Fix:** Never mix `aqua-button` with a custom class that has its own `:active` colour. Use one
or the other. If the button needs custom active colours, drop `aqua-button` entirely and style
it independently.

---

## Glass Container

```html
<div class="aqua-container">
  <p>Container text</p>
  <button class="aqua-button">Apply</button>
  <div class="aqua-slider" data-min="0" data-max="100" data-value="60">
    <div class="aqua-slider-track">
      <div class="aqua-slider-fill"></div>
      <div class="aqua-slider-thumb"></div>
    </div>
  </div>
</div>

<div class="graphite-container">
  <p>Graphite variant</p>
</div>
```
- Reusable glass material surface with blur (`backdrop-filter`) and rounded border
- Designed to contain other Aqua2 controls or plain text
- Use `.aqua-container` for blue-tinted glass and `.graphite-container` for neutral-tinted glass
- Container itself has no JS behavior; nested components initialize normally

---

## Graph

```html
<div class="aqua-graph" aria-label="Sample graph">
  <svg viewBox="0 0 320 132" preserveAspectRatio="none" aria-hidden="true">
    <path class="aqua-graph-area" d="M0 66 C28 22 52 22 80 66 S132 110 160 66 S212 22 240 66 S292 110 320 66 L320 132 L0 132 Z"></path>
    <path class="aqua-graph-line" d="M0 66 C28 22 52 22 80 66 S132 110 160 66 S212 22 240 66 S292 110 320 66"></path>
  </svg>
</div>

<!-- Graphite line variant -->
<div class="graphite-graph">...</div>

<!-- Interactive variant (opt-in) -->
<div class="aqua-graph aqua-interactive-graph">...</div>
<div class="graphite-graph graphite-interactive-graph">...</div>
```
- Glass sqircle/rectangle graph surface with blur material
- Dim horizontal stripes are built into the container background
- Render the curve with SVG using `.aqua-graph-line`; optional filled underlay uses `.aqua-graph-area`
- Use `preserveAspectRatio="none"` when the graph should stretch to the container
- `.aqua-graph` / `.graphite-graph` are static by default (no interactive behavior)
- JS auto-initializes only `.aqua-interactive-graph` / `.graphite-interactive-graph` as interactive curve editors: pointer drag reshapes the nearest curve point, shows a vertical guide and handle, updates `data-values`, and supports keyboard arrows when focused
- The graph handle is an absolutely positioned HTML element (`.aqua-graph-handle`) over the SVG, not an SVG `<circle>`; keep it outside the stretched SVG because `preserveAspectRatio="none"` makes SVG circles render as ovals when the container ratio changes
- Read the edited curve from `graph.dataset.values` as comma-separated SVG-space Y values

---

## Tooltip

```html
<!-- Default Aqua tooltip -->
<button
  class="aqua-button"
  data-aqua-tooltip="This is an Aqua glass tooltip."
  data-aqua-tooltip-mode="anchor"
>
  Hover me
</button>

<!-- Graphite tooltip -->
<button
  class="graphite-button graphite-tooltip-source"
  data-aqua-tooltip="Graphite tooltip variant."
  data-aqua-tooltip-mode="anchor"
>
  Hover me
</button>

<!-- Follow-pointer mode -->
<div
  class="aqua-graph aqua-interactive-graph"
  data-aqua-tooltip="Drag to reshape the curve."
  data-aqua-tooltip-mode="follow"
>
  ...
</div>
```
- Floating glass tooltip component that is rendered to `document.body` and positioned in viewport space
- Trigger with `data-aqua-tooltip="..."` on any element
- Optional `data-aqua-tooltip-mode`: `anchor` (default) or `follow`
- `anchor` mode positions near the target; `follow` mode tracks pointer movement
- Tooltip supports hover and keyboard focus
- Use class `graphite-tooltip-source` on the trigger to switch to graphite tooltip styling
- Tooltips are informational only (`pointer-events: none`) and do not capture interaction

---

## Code Block

```html
<div class="aqua-code-block">
  <pre><code><span class="aqua-code-line">const value = 42;</span>
<span class="aqua-code-line">console.log(value);</span></code></pre>
</div>

<!-- Graphite variant -->
<div class="graphite-code-block">...</div>
```
- Scrollable glass code display with monospace text
- Line numbers are generated from `.aqua-code-line` rows using CSS counters
- Wrap every displayed line in `<span class="aqua-code-line">...</span>`
- Preserve whitespace by keeping the `<pre><code>` structure
- No JS required

---

## Text Button

```html
<div class="aqua-text-button-group" role="group" aria-label="View mode">
  <button type="button" class="aqua-text-button" aria-pressed="true">Overview</button>
  <button type="button" class="aqua-text-button" aria-pressed="false">Details</button>
  <button type="button" class="aqua-text-button" aria-pressed="false">History</button>
</div>
```
- Pure text label that remains pressable as a real button
- Text buttons are usually used inside `.aqua-text-button-group`, where only one button is pressed at a time
- State is stored in `aria-pressed`: selected button is `true`, all sibling buttons are `false`
- JS auto-initializes each group and updates `aria-pressed` on click
- Transparent background and no border in the resting state
- Use `<button type="button">` for actions; `<a class="aqua-text-button">` is acceptable for navigation
- Unpressed text is muted grey via `--aqua-foreground-muted`
- Pressed text is black in light mode and white in dark mode
- Includes hover opacity, active press scale, and `:focus-visible` ring
- Do not combine with `aqua-button` / `graphite-button`; those are pill buttons with different active behavior

---

## Radio Buttons

```html
<label class="aqua-radio">
  <input type="radio" name="group" value="a">
  <span class="aqua-radio-control"></span>
  <span class="aqua-radio-label">Option A</span>
</label>

<!-- Graphite variant -->
<label class="graphite-radio">
  <input type="radio" name="group" value="b">
  <span class="aqua-radio-control"></span>
  <span class="aqua-radio-label">Option B</span>
</label>
```
- The `<input>` is visually hidden (`opacity: 0`, `pointer-events: none`)
- The `.aqua-radio-control` renders the custom circle via `::before` / `::after`
- Checked state is driven by CSS `:checked` — no JS needed
- The dot animates in with a spring (`cubic-bezier(0.34,1.5,0.64,1)`)

---

## Chip Indicator

```html
<span class="aqua-chip">Ready</span>
<span class="graphite-chip">Local only</span>
```
- Small pill-shaped status indicator for short text
- Non-interactive: no hover, press, or click behavior; implemented with `pointer-events: none`
- Use `<span>` by default, not `<button>` or `<a>`
- Keep labels brief so the chip remains compact
- Aqua variant uses a subtle blue tint; graphite variant uses a neutral grey tint

---

## Checkboxes

```html
<label class="aqua-checkbox">
  <input type="checkbox">
  <span class="aqua-checkbox-control">
    <span class="aqua-checkbox-left"></span>
    <span class="aqua-checkbox-right"></span>
  </span>
  <span class="aqua-checkbox-label">Enable feature</span>
</label>

<!-- Graphite variant -->
<label class="graphite-checkbox">
  <input type="checkbox">
  <span class="aqua-checkbox-control">
    <span class="aqua-checkbox-left"></span>
    <span class="aqua-checkbox-right"></span>
  </span>
  <span class="aqua-checkbox-label">Enable feature</span>
</label>
```
- The two inner `<span>` elements form the animated checkmark (left arm + right arm)
- Checked state is CSS-only via `:checked`
- The box bounces on check via `checkbox-settle` keyframe
- **Always include both inner spans** — without them the checkmark won't render

### Rectangular checkbox chip
```html
<label class="aqua-checkbox-chip">
  <input type="checkbox" checked>
  <span class="aqua-checkbox-control">
    <span class="aqua-checkbox-left"></span>
    <span class="aqua-checkbox-right"></span>
  </span>
  <span class="aqua-checkbox-label">Show labels</span>
</label>

<label class="graphite-checkbox-chip">
  <input type="checkbox">
  <span class="aqua-checkbox-control">
    <span class="aqua-checkbox-left"></span>
    <span class="aqua-checkbox-right"></span>
  </span>
  <span class="aqua-checkbox-label">Auto align</span>
</label>
```
- Rectangular glass chip that embeds the standard Aqua checkbox and text label
- Uses the same inner checkbox markup as `.aqua-checkbox`
- The wrapper gets a stronger glass checked state via `:has(input:checked)`
- The chip wrapper depresses on pointer down and releases on pointer up via `.pressing`
- The inner checkbox control still runs the standard `checkbox-settle` animation when checked state changes

---

## Text Input

```html
<!-- Wrap is required for proper border-radius rendering -->
<div class="aqua-input-wrap">
  <input class="aqua-input" type="text" placeholder="Search...">
</div>

<!-- Graphite variant -->
<div class="aqua-input-wrap">
  <input class="graphite-input" type="text" placeholder="Search...">
</div>
```
- Pill-shaped, `padding: 8px 16px`, `14px`
- Focus ring: `3.5px` blue glow (aqua) or grey glow (graphite)
- On focus, background lightens (light mode: `rgba(255,255,255,0.72)`, dark: `rgba(255,255,255,0.16)`)

---

## Select (Dropdown)

```html
<div class="aqua-select">
  <div class="aqua-select-trigger">
    <div class="aqua-select-value-wrap">
      <span class="aqua-select-value">Choose...</span>
    </div>
    <div class="aqua-select-cap">
      <svg viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.5 14L1 8.5M6.5 14L12 8.5M6.5 4V14" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
  <div class="aqua-select-panel">
    <div class="aqua-select-option">Option 1</div>
    <div class="aqua-select-option">Option 2</div>
    <div class="aqua-select-option chosen">Option 3</div>
  </div>
</div>

<!-- Graphite variant: add graphite-select to the wrapper -->
<div class="aqua-select graphite-select">...</div>
```
- JS auto-initializes all `.aqua-select` on page load
- `.chosen` class on an option marks it as selected (set by JS on click, or set in HTML for initial state)
- `.selected` class on `.aqua-select-value` makes the text full opacity (vs muted placeholder)
- The trigger stays as the selection box; the panel is a **separate popup** that is reparented to `document.body` when open (do not duplicate the trigger in the panel)
- Panel opens with a Liquid Glass-style morph: the trigger fades under the popup while the panel expands from the trigger's pill-shaped clipped bounds into the full menu
- Closing reverses the same morph back to the trigger-sized pill before restoring the trigger; do not remove closing state synchronously or the menu can flash at full size
- Menus can open above the trigger near viewport edges; the morph origin flips automatically
- Clicking outside or pressing Escape closes it
- **Do not use a native `<select>` element** — this is a fully custom component
- **Do not use `.aqua-select-panel-header`** — removed; it duplicated the trigger

---

## Slider

```html
<div class="aqua-slider" data-min="0" data-max="100" data-value="50">
  <div class="aqua-slider-track">
    <div class="aqua-slider-fill"></div>
    <div class="aqua-slider-thumb"></div>
  </div>
</div>

<!-- Graphite variant -->
<div class="aqua-slider graphite-slider" data-min="0" data-max="100" data-value="30">
  ...
</div>

<!-- Fixed-stop variant (discrete) -->
<div class="aqua-slider" data-min="1" data-max="5" data-steps="5" data-value="3">
  ...
</div>
```
- JS reads `data-min`, `data-max`, `data-value` on init
- Optional `data-steps` enables fixed stops; use values `>= 2` (for example `5` gives 5 discrete positions)
- Current value is written back to `data-value` (rounded integer) during drag
- Fill and thumb animate with `cubic-bezier(0.34,1.26,0.64,1)` spring
- During drag, `.dragging` class is added — transitions are disabled for responsiveness
- Read current value with `slider.dataset.value`

---

## Progress Bar

```html
<!-- Determinate -->
<div class="aqua-progress" data-value="65">
  <div class="aqua-progress-fill"></div>
</div>

<!-- Graphite determinate -->
<div class="aqua-progress graphite-progress" data-value="40">
  <div class="aqua-progress-fill"></div>
</div>

<!-- Indeterminate (barber pole) -->
<div class="aqua-progress-indeterminate"></div>

<!-- Graphite indeterminate -->
<div class="aqua-progress-indeterminate graphite-progress"></div>
```
- `data-value` is 0–100
- JS initializes determinate bars via `aquaProgressIndicator()` — called automatically on load
- To update programmatically: `fill.style.width = percentage + '%'`
- Indeterminate variant needs no JS — it's pure CSS animation (`barber-scroll` keyframe)

---

## Scrollbar

```html
<div class="aqua-scrollbar" data-value="0" data-thumb-size="30">
  <button class="aqua-scrollbar-button aqua-scrollbar-previous">
    <svg viewBox="0 0 8 7"><!-- left arrow --></svg>
  </button>
  <div class="aqua-scrollbar-track">
    <div class="aqua-scrollbar-thumb"></div>
  </div>
  <button class="aqua-scrollbar-button aqua-scrollbar-next">
    <svg viewBox="0 0 8 7"><!-- right arrow --></svg>
  </button>
</div>

<!-- Graphite variant -->
<div class="aqua-scrollbar graphite-scrollbar" ...>...</div>
```
- `data-value`: current scroll position, 0–100
- `data-thumb-size`: thumb width as a percentage of the track (0–100)
- JS auto-initializes, handles drag, click-to-jump, and button hold-to-scroll
- Value is written back to `data-value` during interaction
- **One** `.aqua-scrollbar-previous` before the track, **one** `.aqua-scrollbar-next` after — do not duplicate buttons or wrap them in a side group

---

## Tab View

```html
<div class="aqua-tabview-wrap">
  <div class="aqua-tabview" data-content-prefix="my-tabs">
    <div class="aqua-tabview-indicator"></div>
    <div class="aqua-tabview-tab active" data-tab="tab-1">First</div>
    <div class="aqua-tabview-tab" data-tab="tab-2">Second</div>
    <div class="aqua-tabview-tab disabled" data-tab="tab-3">Disabled</div>
  </div>
</div>

<!-- Corresponding panes (anywhere in the DOM) -->
<div class="tab-pane active" id="my-tabs-tab-1">Content 1</div>
<div class="tab-pane" id="my-tabs-tab-2">Content 2</div>
<div class="tab-pane" id="my-tabs-tab-3">Content 3</div>
```
- `data-content-prefix` on the tab view + `id="{prefix}-{data-tab}"` on panes links them
- JS adds/removes `.active` on both tabs and panes on switch
- The indicator pill animates with a spring between tabs
- Supports drag-to-scrub across tabs
- `.disabled` tabs are non-interactive
- **Tab panes** use `.tab-pane` / `.active` (styled by Aqua2). On init, panes with matching `data-content-prefix` are wrapped in `.aqua-tabview-panes` and slide horizontally when switching (direction follows tab order)

### ⚠️ Critical pitfall — tab persistence with pointer capture

`aqua2.js` calls `tabView.setPointerCapture(e.pointerId)` on `pointerdown` and also calls
`e.preventDefault()`, which suppresses the `click` event entirely.

**Consequences for any code listening to tab changes:**
1. `click` listeners on the tab view will **never fire** for pointer input
2. On `pointerup`, `event.target` resolves to the **tab view element itself**, not the clicked
   tab — so `event.target.closest(".aqua-tabview-tab")` always returns `null`

**Correct pattern** for detecting which tab was activated:
```js
tabView.addEventListener("pointerup", () => {
  // By the time pointerup fires on your listener, aqua2.js has already
  // moved the .active class to the correct tab.
  const activeTab = tabView.querySelector(".aqua-tabview-tab.active");
  if (!activeTab) return;
  const tabName = activeTab.dataset.tab;
  // do something with tabName...
});
```

---

## Dark Mode

Dark styling is driven by `[data-theme="dark"]` in `aqua2.js`, not by automatic
`prefers-color-scheme` media queries. To switch themes, set `document.documentElement.dataset.theme`
to `"dark"` or `"light"` (or set `data-theme` on a parent scope if you intentionally want local
theme scoping). You can still override CSS variables on `:root` or a container element for custom
palettes.

---

## Quick Reference

| Component | Classes | JS needed? |
|---|---|---|
| Pill button | `aqua-button` / `graphite-button` | No |
| Circular button | `aqua-button-circular` / `graphite-button-circular` | No |
| Square button | `aqua-button-square` / `graphite-button-square` | No |
| Focused/pulsing button | `aqua-button-focused` / `graphite-button-focused` (any shape) | No |
| Toggle button | `aqua-toggle-button` / `graphite-toggle-button` | Auto |
| Glass container | `aqua-container` / `graphite-container` | No |
| Graph (static) | `aqua-graph` / `graphite-graph` with `.aqua-graph-line` | No |
| Graph (interactive) | `aqua-graph aqua-interactive-graph` / `graphite-graph graphite-interactive-graph` | Auto |
| Tooltip | Any trigger with `data-aqua-tooltip` (`graphite-tooltip-source` for graphite style) | Auto |
| Code block | `aqua-code-block` / `graphite-code-block` with `.aqua-code-line` | No |
| Text button group | `aqua-text-button-group` with `aqua-text-button` / `graphite-text-button` | Auto |
| Chip indicator | `aqua-chip` / `graphite-chip` | No |
| Radio | `aqua-radio` / `graphite-radio` | No |
| Checkbox | `aqua-checkbox` / `graphite-checkbox` | No |
| Rectangular checkbox chip | `aqua-checkbox-chip` / `graphite-checkbox-chip` | Auto |
| Input | `aqua-input` / `graphite-input` (inside `aqua-input-wrap`) | No |
| Select | `aqua-select` (+ `graphite-select` for grey cap) | Auto |
| Slider | `aqua-slider` / `graphite-slider` | Auto |
| Progress | `aqua-progress` / `graphite-progress` | Auto |
| Indeterminate progress | `aqua-progress-indeterminate` (+ `graphite-progress`) | No |
| Scrollbar | `aqua-scrollbar` / `graphite-scrollbar` | Auto |
| Tab view | `aqua-tabview` inside `aqua-tabview-wrap` | Auto |
