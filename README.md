# Nyadock

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

[https://wxn0brp.github.io/Nyadock/demo](https://wxn0brp.github.io/Nyadock/demo)

## Installation

```bash
yarn add github:wxn0brP/Nyadock#dist
```

## Usage

Nyadock is controlled via a single `controller` instance that manages the entire layout.

### 1. HTML Setup

First, you need a container element in your HTML to host the dock layout, and individual `div` elements that will become your panels.

```html
<!-- The main container for the dock layout -->
<div id="app"></div>

<!-- Your panel content (can be hidden initially) -->
<div id="panel1-content" style="display: none;">
    <h2>Panel 1</h2>
    <p>Content for the first panel.</p>
</div>
<div id="panel2-content" style="display: none;">
    <h2>Panel 2</h2>
    <p>Content for the second panel.</p>
</div>
```

### 2. JavaScript/TypeScript Initialization

Import the `controller` and use it to configure and initialize the layout. Note that you also need to import the stylesheet.

```typescript
import { controller } from "@wxn0brp/nya-dock/state";
import "@wxn0brp/nya-dock/style.css";

// 1. Get the master container element
const appContainer = document.querySelector("#app");

// 2. Get your panel content elements
const panel1 = document.querySelector("#panel1-content");
const panel2 = document.querySelector("#panel2-content");

// 3. Assign the master container
controller.master = appContainer;

// 4. Register your panels with unique IDs
controller.registerPanel("panel1", panel1);
controller.registerPanel("panel2", panel2);

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

## License

MIT [LICENSE](./LICENSE)

## Contributing

Contributions are welcome!