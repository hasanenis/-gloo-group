# Framer-Like Design Editor Rebuild Plan

Date: 2026-07-02

## Diagnosis

The current editor does not feel like Framer because it is still an overlay on top of the live website. The panels sit on the left and right, but the page itself keeps behaving like a normal full-size website behind them. That makes editing uncomfortable: the left panel covers the site, the right inspector covers the site, the selected element may be partly hidden, and the user cannot see the whole page as an editable object.

Framer's core model is different:

- The website is not the browser page itself while editing.
- The website is shown as a scaled artboard inside a dark workspace.
- The editor chrome is separate from the artboard.
- Selection outlines, layer tree, and inspector all point to the artboard coordinate system.
- The UI exposes simple concepts first: Pages, Layers, Assets, Agent, Style.
- Advanced CSS-like controls exist, but they do not dominate the default experience.

The current implementation only partially changed the chrome. The actual editing model still needs to be rebuilt.

## Target Outcome

When `?edit=1` is active:

- The whole app should become a full-screen editor shell.
- The website should render inside a centered, scaled artboard.
- The artboard should have a header like `Desktop 1200` or `Desktop 1408`.
- Left and right panels should not cover the artboard.
- The bottom toolbar should attach visually to the artboard/workspace, not to the live website.
- Selecting elements should work inside the scaled artboard.
- The right panel should show simple, user-friendly controls first.
- Advanced controls should be available but secondary.
- The final user should not need to understand CSS terms like `z-index`, `translateX`, `objectPosition`, or `pointerEvents` unless they open advanced mode.

## Non-Negotiables

- Normal public website mode must not change.
- Existing `data-edit-key` scanning should be preserved.
- Existing override persistence should be preserved.
- Existing undo/redo should be preserved.
- Existing breakpoint override model should be preserved.
- We should stop adding more floating debug widgets.
- We should not try to create a pixel-perfect Framer clone; we should copy the editing logic and usability model.

---

# Plan 1: Rebuild The Editor Shell Around A Real Artboard

## Problem

Right now `DesignEditorProvider` renders:

```tsx
{children}
{enabled ? editorChrome : null}
```

That means the page is still the real viewport. The panels are simply drawn above it. This is why the current screenshot feels wrong.

## Change

In edit mode, render:

```tsx
<StudioShell>
  <Topbar />
  <LeftPanel />
  <Workspace>
    <ArtboardHeader />
    <ArtboardViewport>
      <ArtboardScaler>
        {children}
      </ArtboardScaler>
    </ArtboardViewport>
    <CanvasToolbar />
  </Workspace>
  <RightPanel />
</StudioShell>
```

In normal mode, render:

```tsx
{children}
```

## Implementation Notes

- Add `StudioShell`, `Workspace`, `ArtboardViewport`, and `ArtboardScaler` components.
- Move route content into the artboard only when `enabled === true`.
- Use CSS variables for:
  - `--studio-topbar-height`
  - `--studio-left-width`
  - `--studio-right-width`
  - `--studio-artboard-width`
  - `--studio-artboard-scale`
- Make the workspace a real layout area:
  - `left: leftPanelWidth`
  - `right: rightPanelWidth`
  - `top: 52px`
  - `bottom: 0`
- Center the artboard inside the remaining workspace.
- The page should no longer be visible behind panels.

## Target Visual

The artboard should look like Framer screenshot 2:

- dark workspace background
- centered website canvas
- visible full artboard bounds
- artboard header above the canvas
- panels do not cover the canvas

## Acceptance Criteria

- At 1920x900, the whole website is visible as a scaled artboard.
- At 1440x900, the artboard still fits between panels.
- At 980px width, panels either collapse or the artboard remains usable.
- No horizontal scrollbar on `body`.
- Panels never cover selected content by default.

---

# Plan 2: Add Real Zoom, Pan, And Artboard Sizing

## Problem

The current bottom toolbar visually says `50%`, but it does not control a real artboard scale. The website is still full-size.

## Change

Add real canvas state:

```ts
type CanvasTool = 'select' | 'pan' | 'comment' | 'theme';

interface CanvasViewportState {
  zoom: number;
  panX: number;
  panY: number;
  artboardWidth: number;
  artboardHeightMode: 'auto' | 'viewport';
  breakpoint: BreakpointKey;
}
```

## Zoom Behavior

Use zoom presets:

- `25%`
- `50%`
- `75%`
- `100%`
- `Fit`

Default should be `Fit`, not fake `50%`.

## Artboard Widths

Use Framer-like presets:

- Desktop: `1200` or `1408`
- Tablet: `810`
- Mobile: `390`

The selected breakpoint controls the artboard width, not only the inspector.

## Implementation Notes

- `viewportBreakpoint` should represent the real browser viewport.
- `artboardBreakpoint` should represent the editing target.
- Style override preview should use `artboardBreakpoint`.
- Add `calculateFitZoom(workspaceRect, artboardWidth, minZoom, maxZoom)`.
- When the user switches Desktop/Tablet/Mobile, update artboard width and preview breakpoint together.

## Acceptance Criteria

- Clicking Desktop/Tablet/Mobile changes the canvas width.
- `Fit` zoom keeps the artboard fully visible between panels.
- `50%` is real scale, not just text.
- Pan mode drags the artboard.
- Select mode still selects elements.

---

# Plan 3: Fix Selection Geometry For Scaled Artboards

## Problem

Selection currently uses `element.getBoundingClientRect()` directly. Once the page is scaled inside an artboard, raw DOM rects will not match the visual editor coordinates unless handled carefully.

## Change

Introduce a coordinate conversion layer:

```ts
interface ArtboardMetrics {
  scale: number;
  panX: number;
  panY: number;
  artboardLeft: number;
  artboardTop: number;
  artboardWidth: number;
}

function toWorkspaceRect(domRect: DOMRect, metrics: ArtboardMetrics) {
  return {
    left: metrics.artboardLeft + domRect.left * metrics.scale,
    top: metrics.artboardTop + domRect.top * metrics.scale,
    width: domRect.width * metrics.scale,
    height: domRect.height * metrics.scale,
  };
}
```

## Important Detail

If `ArtboardScaler` uses CSS `transform: scale(...)`, `getBoundingClientRect()` may already return transformed values depending on how it is measured. We need to standardize this:

- Either measure from unscaled inner content and convert manually.
- Or measure transformed rects but keep every overlay in the same transformed coordinate space.

The safer approach:

- `OutlineBox` should be rendered inside the artboard overlay layer.
- The outline layer should share the same transform as the artboard.
- This removes most manual conversion problems.

## Implementation Notes

- Add `ArtboardOverlayLayer` inside the artboard.
- Move `OutlineBox` and hover outline into that layer.
- Selection labels should stay readable:
  - labels can be inverse-scaled or rendered in workspace coordinates.
- Selection handles should stay usable at small zoom:
  - handle visual size should not shrink below `8px`.

## Acceptance Criteria

- Selection border lands exactly on selected element at `Fit`, `50%`, and `100%`.
- Hover outline matches actual hovered element.
- Double-click text edit still targets the correct text.
- Selection does not jump when scrolling inside the artboard.

---

# Plan 4: Rebuild Left Panel For Human-Friendly Navigation

## Problem

The current layer tree exposes too many technical details:

- `70 visible editable targets`
- `GLOBAL`
- `ROUTE`
- internal keys like `home-hero-shell`
- many section rows with counts

That is useful for developers, not for a final user.

## Change

Create two modes:

```ts
type EditorAudienceMode = 'simple' | 'advanced';
```

Default should be `simple`.

## Pages Tab

Simple view:

- Design
  - Pages
    - Home
    - Projects
    - Project Detail Template

No metric cards.

Advanced view can show:

- route path
- route key
- number of editable targets
- orphaned override warnings

## Layers Tab

Simple view should group by understandable page sections:

- Header
- Hero
- Featured Projects
- Why Choose Us
- Stats
- Team
- Testimonials
- Footer

Inside a section:

- Text
- Image
- Button
- Card
- Container

Avoid exposing raw `data-edit-key` as the primary label.

## Assets Tab

Simple view:

- Components
  - Header
  - Hero Banner
  - Project Card
  - Footer
- Styles
  - Colors
  - Typography
  - Spacing
  - Buttons
- Media
  - Project Images
  - Hero Images

Advanced view:

- adapters
- target IDs
- raw selectors

## Implementation Notes

- Extend `componentModel.ts` with `EditorSectionDefinition`.
- Map existing `data-edit-key` prefixes to human labels.
- Add explicit `data-edit-label` and `data-edit-group` to major components where needed.
- Stop sorting layers only by depth and label; preserve DOM/page order for a more intuitive tree.

## Acceptance Criteria

- A non-technical user can find Hero, Header, Project Cards, and Footer without knowing `data-edit-key`.
- The first visible label in the tree is human-readable.
- Advanced technical labels are secondary and visually muted.
- Search finds both friendly labels and raw edit keys.

---

# Plan 5: Rebuild Right Inspector As Simple Controls First

## Problem

The current Style panel is still too CSS-heavy. A final user sees `Bottom`, `Left`, `Z Index`, sliders, inherited values, and "Clear" buttons. That is not friendly.

## Change

Right panel should have two levels:

```ts
type InspectorComplexity = 'basic' | 'advanced';
```

Default: `basic`.

## Basic Inspector Sections

For any selection:

1. Selection
   - friendly name
   - parent section
   - selected element type

2. Content
   - text content if text
   - image source if image
   - link destination if link/button

3. Layout
   - width mode: Auto / Fill / Fixed
   - height mode: Auto / Fixed
   - alignment icons
   - spacing presets

4. Appearance
   - background
   - text color
   - border radius
   - opacity

5. Typography
   - font family
   - size
   - weight
   - alignment

6. Responsive
   - Desktop / Tablet / Mobile
   - show which breakpoint is being edited

## Advanced Inspector Sections

Hide these behind "Advanced":

- position offsets
- z-index
- transform
- filter
- pointer events
- object position
- raw CSS values

## Text Editing

Text should not require a floating HUD by default.

Text selection should show:

- editable textarea
- font size stepper
- color
- alignment
- reset text

Double-click may still open focused text editing, but the right inspector must be enough.

## Implementation Notes

- Keep current `StyleControlDefinition` as low-level engine data.
- Add a new `InspectorControlDefinition` mapping low-level controls to friendly UI.
- Add control components:
  - `SegmentedControl`
  - `IconButtonGroup`
  - `ColorSwatchInput`
  - `NumberStepper`
  - `ModeSelect`
  - `DisclosureSection`
- Convert sliders like Top/Left/Z Index into advanced rows only.

## Acceptance Criteria

- Selecting a hero heading shows content and typography first.
- Selecting an image shows image/media controls first.
- Selecting a section shows layout and spacing first.
- `Z Index` is not visible in default basic mode.
- A user can change common things without understanding CSS.

---

# Plan 6: Component Management And Publishing Workflow

## Problem

The current system edits DOM targets, but it does not yet feel like component management. Framer makes the user feel they are editing frames, stacks, components, and page objects.

## Change

Create a higher-level component registry:

```ts
interface EditableComponentDefinition {
  id: string;
  label: string;
  type: 'section' | 'component' | 'slot' | 'asset' | 'token';
  routeScope: 'global' | 'page' | 'template';
  targetKeys: string[];
  children?: EditableComponentDefinition[];
}
```

## Component Registry

Examples:

- Header
  - Logo
  - Navigation
  - Language Switcher
- Hero
  - Background Media
  - Heading
  - Supporting Copy
  - CTA
- Featured Projects
  - Section Heading
  - Project Card
  - Project Image
- Footer
  - CTA
  - Links
  - Contact

## UX Behavior

- Clicking a component in the tree selects the section frame.
- Expanding reveals editable slots.
- Component labels should match what the user sees on the page.
- Override counts should be hidden by default.
- Warnings should appear only when useful:
  - missing element
  - unpublished local draft
  - unsaved changes

## Publish UX

Current status text is scary:

`API OFFLINE. WORKING IN LOCAL-ONLY STUDIO MODE.`

For end users, replace with:

- `Draft saved locally`
- `Publish unavailable`
- `Connect Studio API to publish`

Only show technical API wording in advanced/debug mode.

## Implementation Notes

- Replace raw status badge in topbar with compact save state.
- Add a "Project" dropdown/title in center topbar.
- Keep import/export actions in a menu instead of always visible.
- Keep save/publish as clear primary actions.

## Acceptance Criteria

- Topbar is not intimidating.
- A user sees project/page context, not API internals.
- Components are managed as meaningful sections.
- Publish/save status is understandable.

---

# Recommended Implementation Order

## Step 1: Stop The Bleeding

Remove the current fake Framer layer that makes the site harder to edit:

- hide advanced controls by default
- simplify status message
- reduce inspector noise
- keep panels usable

This is a short patch.

## Step 2: Build Artboard Shell

Create:

- `StudioShell`
- `Workspace`
- `ArtboardViewport`
- `ArtboardScaler`
- `ArtboardHeader`

Move `{children}` into this shell only in edit mode.

This is the most important step.

## Step 3: Make Zoom Real

Add:

- `zoom`
- `fit`
- `pan`
- breakpoint artboard widths

Bottom toolbar becomes functional.

## Step 4: Fix Selection Geometry

Move selection and hover overlays into the artboard coordinate system.

This must happen after scaling, not before.

## Step 5: Rebuild Panels Around Friendly Models

Left panel:

- human section tree
- friendly Pages/Assets

Right panel:

- Basic inspector
- Advanced inspector

## Step 6: Verification And Polish

Test:

- `/ ?edit=1`
- `/projects?edit=1`
- `/projects/:slug?edit=1`
- desktop 1440x900
- desktop 1920x900
- tablet width
- mobile width

Use screenshots to compare against Framer reference.

---

# Technical Risks

## Risk 1: Scroll/GSAP Interactions

Some pages use GSAP and ScrollTrigger. Rendering inside a scaled artboard may affect measurements.

Mitigation:

- disable smooth scroll in edit mode
- refresh ScrollTrigger after artboard mount
- consider an edit-mode layout freeze for heavy animation pages

## Risk 2: Fixed Header Inside Artboard

The site header is fixed. Inside a transformed artboard, fixed elements can behave unexpectedly.

Mitigation:

- ensure artboard creates a containing block
- use `transform` carefully
- if needed, render artboard in an iframe-like isolated wrapper later

## Risk 3: Selection Rect Accuracy

Scaling can break selection outlines.

Mitigation:

- put overlays inside the scaled artboard layer
- keep labels/handles inverse-scaled if necessary

## Risk 4: User Confusion From Too Many Controls

The current inspector exposes too much.

Mitigation:

- default to Basic mode
- advanced mode behind one toggle
- use friendly labels and icon controls

---

# Definition Of Done

The rebuild is acceptable only when:

- The website is visibly centered as a scaled artboard like Framer.
- The user can see the full page area while panels are open.
- Panels do not cover the artboard.
- The layer tree uses human-readable sections.
- The right inspector starts with simple controls.
- Advanced CSS controls are hidden by default.
- Select, hover, and text edit work at multiple zoom levels.
- Desktop, tablet, and mobile artboard widths work.
- `npm.cmd run lint` passes.
- `npm.cmd run build` passes.
- Screenshots at 1440x900 and 980px show no overlap or horizontal browser scrollbar.

