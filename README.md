# NyaDock

A dock panel component library. Currently in early development stage.

> [!WARNING]
> This project is currently in early development and is not yet ready for production use.
> Expect breaking changes and incomplete features.

## Features
- Dock interface component
- Built with TypeScript for type safety
- Styled with SCSS
- Part of the @wxn0brp ecosystem

## Demo

[https://wxn0brp.github.io/NyaDock/demo](https://wxn0brp.github.io/NyaDock/demo)

## Installation

```bash
npm i @wxn0brp/nya-dock
```

## Usage

Nyadock is controlled via a single `controller` instance that manages the entire layout.

### 1. HTML Setup

First, you need a container element in your HTML to host the dock layout, and individual `div` elements that will become your panels.

```html
<!-- The main container for the dock layout -->
<div id="app"></div>

<!-- Your panel content -->
<div class="panel" id="panel1">
    <div class="panel-header">Panel 1</div>
    <div class="panel-content">
        <h2>Panel 1</h2>
        <p>Content for the first panel.</p>
    </div>
</div>
<div class="panel" id="panel2">
    <div class="panel-header">Panel 2</div>
    <div class="panel-content">
        <h2>Panel 2</h2>
        <p>Content for the second panel.</p>
    </div>
</div>
```

### 2. JavaScript/TypeScript Initialization

Import the `controller` and use it to configure and initialize the layout. Note that you also need to import the stylesheet.

```typescript
import { controller } from "@wxn0brp/nya-dock";
import "@wxn0brp/nya-dock/style.css"; // or in html: <link rel="stylesheet" href="node_modules/@wxn0brp/nya-dock/dist/style.css">

// 1. Get the master container element
const appContainer = document.querySelector("#app");

// 2. Get your panel elements
const panels = document.querySelectorAll(".panel");

// 3. Assign the master container
controller.master = appContainer;

// 4. Register your panels
for (const panel of panels) {
    controller.registerPanel(panel.id, panel);
}

// 5. Define the layout structure
// A horizontal split between "panel1" and "panel2"
const layout = ["panel1", "panel2"]; 

// A vertical split would be: ["panel1", "panel2", 1]
// Layouts can be nested.
controller.setDefaultState(layout);

// 6. Initialize the dock layout
controller.init();
```

### How the Layout Structure Works

The layout is defined by a `StructNode`, which is an array of panel IDs and nested arrays.

-   **Horizontal Split (Row):** `["panelA", "panelB"]`
-   **Vertical Split (Column):** `["panelA", "panelB", 1]` (the `1` indicates a vertical split)
-   **Tab group:** `{ tabs: ["panelA", "panelB"], active: 0 }`

You can nest these structures to create complex layouts:

```javascript
// panelA is on the left.
// The right side is a vertical split between panelB and panelC.
const complexLayout = ["panelA", ["panelB", "panelC", 1]];

// panelA on the left, panelB and panelC grouped as tabs on the right.
const tabLayout = ["panelA", { tabs: ["panelB", "panelC"], active: 0 }];
```

### Layout Builders

Hand-writing nested arrays is easy to get wrong, so the package exports three small builders: `row`, `column` and `tabs`. They return the same internal tree (`NyaSplit`/`NyaStack`) that `setDefaultState` accepts, and they compose with each other.

```typescript
import { controller, row, column, tabs } from "@wxn0brp/nya-dock";

controller.setDefaultState(
    row(
        "panelA",
        column(
            "panelB",
            row(tabs(["panelC", "panelD"]), "panelE"),
        ),
    ),
);
```

- `row(...children)` - horizontal split, at least two children.
- `column(...children)` - vertical split, at least two children.
- `tabs(ids, active?)` or `tabs(...ids)` - a tab group, `active` defaults to `0`.

### Tab Groups

Panels can share one slot as tabs. A group is created by docking a panel onto the center of another panel, or by declaring `{ tabs, active }` in the layout structure. The `active` field holds the index of the visible tab and defaults to `0`.

Switch the active tab programmatically with the panel id:

```typescript
controller.selectTab("panelB");
```

Dragging a panel onto the center of a tab group adds it as a new tab. Dragging a tab onto another tab reorders it within the group, onto the center of another panel merges it into that group, and onto an edge of a panel docks it as a separate panel again.

### Resizing and Accessibility

Each split renders a real separator between its two children. The separator is focusable and exposes `role="separator"` with `aria-orientation` and `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.

- Drag the separator to resize.
- Double-click it, or focus it and press `Enter`/`Home`, to reset to 50%.
- With the separator focused, use `ArrowLeft`/`ArrowRight` (row) or `ArrowUp`/`ArrowDown` (column) to resize. Hold `Shift` for a larger step.

The minimum panel size defaults to `100` and can be changed per controller:

```typescript
controller.settings.minSize = 120;
```

### CSS Customization

```css
:root {
  --nya-dock-border: silver;

  --nya-dock-header: #2c2c2c;
  --nya-dock-header-border: #444;
  --nya-dock-header-color: #ddd;

  --nya-dock-tab-active: #3a3a3a;
  --nya-dock-focus: blueviolet;

  --nya-dock-content-color: #aaa;
  --nya-dock-content-border: #444;

  --nya-dock-button-background: #444;
  --nya-dock-button-color: white;
  --nya-dock-button-hover-background: #555;

  --nya-dock-info-box-background: #222;
  --nya-dock-info-box-border: #666;

  --nya-dock-dock-background: blueviolet;
  --nya-dock-dock-opacity: 0.2;
}
```

## License

MIT [LICENSE](./LICENSE)

## Contributing

Contributions are welcome!
