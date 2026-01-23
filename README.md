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
import { controller } from "@wxn0brp/nya-dock/state";
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

You can nest these structures to create complex layouts:

```javascript
// panelA is on the left.
// The right side is a vertical split between panelB and panelC.
const complexLayout = ["panelA", ["panelB", "panelC", 1]];
```

### CSS Customization

```css
:root {
  --nya-dock-border: silver;

  --nya-dock-header: #2c2c2c;
  --nya-dock-header-border: #444;
  --nya-dock-header-color: #ddd;

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