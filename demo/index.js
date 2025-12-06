// node_modules/@wxn0brp/flanker-ui/dist/html.js
(() => {
  var M = Object.defineProperty;
  var a = (t, e) => M(t, "name", { value: e, configurable: true });
  var s = { html(t) {
    return t !== undefined ? (this.innerHTML = t, this) : this.innerHTML;
  }, v(t) {
    return t !== undefined ? (this.value = t, this) : this.value;
  }, on(t, e) {
    return this.addEventListener(t, e), this;
  }, css(t, e = null) {
    return typeof t == "string" ? e !== null ? this.style[t] = e : this.style.cssText = t : Object.assign(this.style, t), this;
  }, attrib(t, e = null) {
    return e !== null ? (this.setAttribute(t, e), this) : this.getAttribute(t) || "";
  }, clA(...t) {
    return this.classList.add(...t), this;
  }, clR(...t) {
    return this.classList.remove(...t), this;
  }, clT(t, e) {
    return this.classList.toggle(t, e), this;
  }, animateFade(t, e = {}) {
    let { time: n = 200, cb: i } = e, r = this, l = t === 0 ? 1 : 0, m = Math.min(1, Math.max(0, t)), u = performance.now();
    r.style.opacity = m.toString();
    function h(d) {
      let T = d - u, o = Math.min(T / n, 1), L = m + (l - m) * o;
      r.style.opacity = L.toString(), o < 1 ? requestAnimationFrame(h) : (r.style.opacity = l.toString(), i?.());
    }
    return a(h, "step"), requestAnimationFrame(h), this;
  }, fadeIn(...t) {
    let e = c({ display: "string", cb: "function", time: "number" }, t), { display: n = "block" } = e;
    return this.css("display", n), this.animateFade(0, e), this.fade = true, this;
  }, fadeOut(...t) {
    let e = c({ cb: "function", time: "number" }, t), n = e.time ?? 300;
    return e.time = n, this.animateFade(1, { ...e, cb: a(() => {
      this.css("display", "none"), e.cb?.();
    }, "cb") }), this.fade = false, this;
  }, async fadeInP(...t) {
    return new Promise((e) => {
      this.fadeIn(...t, () => e(this));
    });
  }, async fadeOutP(...t) {
    return new Promise((e) => {
      this.fadeOut(...t, () => e(this));
    });
  }, fade: true, fadeToggle() {
    return this.fade ? this.fadeOut() : this.fadeIn(), this;
  }, add(t) {
    return this.appendChild(t), this;
  }, addUp(t) {
    return this.insertBefore(t, this.firstChild), this;
  }, qs(t, e = 0) {
    return e && (t = `[data-id="${t}"]`), this.querySelector(t);
  } };
  s.qi = s.qs;
  function c(t, e) {
    let n = {};
    if (e.length === 0)
      return n;
    if (e.every((i) => typeof i == "object"))
      return Object.assign({}, ...e);
    for (let i of e)
      for (let [r, l] of Object.entries(t))
        if (typeof i === l) {
          n[r] = i;
          break;
        }
    return n;
  }
  a(c, "convert");
  Object.assign(HTMLElement.prototype, s);
  Object.assign(document, s);
  Object.assign(document.body, s);
  Object.assign(document.documentElement, s);
  window.qs = window.qi = s.qs.bind(document);
})();

// src/logger.ts
var LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};
var logs = [];
var currentLogLevel = LOG_LEVELS.ERROR;
function setLogLevel(level) {
  currentLogLevel = LOG_LEVELS[level];
}
function exportLogs() {
  console.log(logs.join(`
`));
}
function log(level, ...args) {
  if (LOG_LEVELS[level] >= currentLogLevel) {
    console.log(`[${level}]`, ...args);
    logs.push(`[${level}] ${args.map((a) => typeof a === "string" ? a : JSON.stringify(a)).join(" ")}`);
  }
}
var logger = {
  debug: (...args) => log("DEBUG", ...args),
  info: (...args) => log("INFO", ...args),
  warn: (...args) => log("WARN", ...args),
  error: (...args) => log("ERROR", ...args),
  setLogLevel,
  exportLogs
};
var logger_default = logger;

// src/const.ts
var DRAG = 30;
var RESIZE_MIN = 100;

// src/render.ts
function render(controller) {
  const tempElement = document.createElement("div");
  for (const panel of controller._panels.values()) {
    tempElement.appendChild(panel);
  }
  controller.master.innerHTML = "";
  const masterSplit = renderSplit(controller, controller._split);
  controller.master.appendChild(masterSplit);
}
function renderSplit(controller, split, prefix = "0") {
  const div = document.createElement("div");
  div.classList.add("split");
  div.classList.add(split.type);
  div.dataset.nya_split = prefix;
  controller._splits.set(prefix, div);
  for (let i = 0;i < split.nodes.length; i++) {
    const node = split.nodes[i];
    if (typeof node === "string") {
      const panel = controller._panels.get(node);
      div.appendChild(panel);
    } else {
      const splitPanel = document.createElement("div");
      splitPanel.classList.add("panel");
      const splitContent = renderSplit(controller, node, `${prefix}.${i}`);
      splitPanel.appendChild(splitContent);
      div.appendChild(splitPanel);
    }
  }
  return div;
}

// node_modules/@wxn0brp/flanker-ui/dist/utils.js
function clamp(min, value, max) {
  return Math.min(Math.max(value, min), max);
}
function throttle(func, wait = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

// src/storage.ts
function saveState(controller2) {
  const state = controller2._split;
  const sizes = {};
  controller2._splits.forEach((split, key) => {
    sizes[key] = split.style.getPropertyValue("--size");
  });
  localStorage.setItem(controller2.settings.key, JSON.stringify({ state, sizes }));
}
function defaultState(controller2) {
  controller2._split = Object.assign({}, controller2._struct);
  controller2._render();
  controller2._setDefaultSize();
  saveState(controller2);
}
function loadState(controller2) {
  const stateString = localStorage.getItem(controller2.settings.key);
  if (!stateString)
    return defaultState(controller2);
  const { state, sizes } = JSON.parse(stateString);
  controller2._split = state;
  controller2._render();
  controller2._splits.forEach((split, key) => {
    split.style.setProperty("--size", sizes[key]);
  });
}
var saveNyaState = throttle(() => {
  logger_default.debug("Saving state");
  saveState(controller);
}, 3000);

// src/utils/convertSplit.ts
function convertToSplits(arr) {
  if (arr.length === 0) {
    throw new Error("Array structure must have at least one element");
  }
  let isColumnLayout = false;
  let actualArray = arr;
  if (arr.length === 3 && arr[2] === 1) {
    isColumnLayout = true;
    actualArray = arr.slice(0, 2);
  }
  if (actualArray.length === 1) {
    const element = actualArray[0];
    if (Array.isArray(element)) {
      const nestedSplit = convertToSplits(element);
      return {
        type: isColumnLayout ? "column" : "row",
        nodes: [nestedSplit, "empty"]
      };
    } else {
      return {
        type: isColumnLayout ? "column" : "row",
        nodes: [element, "empty"]
      };
    }
  } else if (actualArray.length === 2) {
    const [first, second] = actualArray;
    const firstElement = Array.isArray(first) ? convertToSplits(first) : first;
    const secondElement = Array.isArray(second) ? convertToSplits(second) : second;
    return {
      type: isColumnLayout ? "column" : "row",
      nodes: [firstElement, secondElement]
    };
  } else {
    const [first, ...rest] = actualArray;
    let restStructure = [rest[0]];
    for (let i = 1;i < rest.length; i++) {
      if (isColumnLayout) {
        restStructure = [restStructure, rest[i], 1];
      } else {
        restStructure = [restStructure, rest[i]];
      }
    }
    const firstElement = Array.isArray(first) ? convertToSplits(first) : first;
    const restElement = Array.isArray(restStructure) ? convertToSplits(restStructure) : restStructure;
    return {
      type: isColumnLayout ? "column" : "row",
      nodes: [firstElement, restElement]
    };
  }
}

// src/utils/movePanel.ts
function movePanel(controller2, sourceId, targetId, zone) {
  if (!controller2._split || sourceId === targetId)
    return;
  if (controller2._split.nodes.length === 0) {
    controller2._split = {
      nodes: [sourceId, targetId],
      type: zone === "left" || zone === "right" ? "row" : "column"
    };
    return;
  }
  function recursiveRemove(node) {
    if (typeof node === "string") {
      return node === sourceId ? null : node;
    }
    const [nodeA, nodeB] = node.nodes;
    const newA = recursiveRemove(nodeA);
    const newB = recursiveRemove(nodeB);
    if (newA && newB) {
      if (newA !== nodeA || newB !== nodeB) {
        return { ...node, nodes: [newA, newB] };
      }
      return node;
    }
    return newA || newB;
  }
  const treeAfterRemove = recursiveRemove(controller2._split);
  const newSplitNode = {
    type: zone === "left" || zone === "right" ? "row" : "column",
    nodes: zone === "left" || zone === "top" ? [sourceId, targetId] : [targetId, sourceId]
  };
  function recursiveDock(node) {
    if (typeof node === "string") {
      return node === targetId ? newSplitNode : node;
    }
    const [nodeA, nodeB] = node.nodes;
    if (typeof nodeA === "string" && nodeA === targetId) {
      return { ...node, nodes: [newSplitNode, nodeB] };
    }
    if (typeof nodeB === "string" && nodeB === targetId) {
      return { ...node, nodes: [nodeA, newSplitNode] };
    }
    const newA = recursiveDock(nodeA);
    const newB = recursiveDock(nodeB);
    if (newA !== nodeA || newB !== nodeB) {
      return { ...node, nodes: [newA, newB] };
    }
    return node;
  }
  let finalTree;
  if (!treeAfterRemove) {
    finalTree = newSplitNode;
  } else {
    finalTree = recursiveDock(treeAfterRemove);
  }
  controller2._split = finalTree;
}

// src/state.ts
class NyaController2 {
  _split;
  _panels = new Map;
  _splits = new Map;
  master;
  settings = {
    key: "nya.dock"
  };
  _struct;
  setDefaultState(state) {
    this._struct = Array.isArray(state) ? convertToSplits(state) : state;
  }
  init() {
    if (!this.master)
      throw new Error("Master element not set");
    if (!this._struct)
      throw new Error("Structure not set");
    loadState(this);
  }
  registerPanel(id, panel) {
    panel.dataset.nya_id = id;
    panel.classList.add("panel");
    this._panels.set(id, panel);
  }
  _render() {
    this._splits.clear();
    return render(this);
  }
  _setDefaultSize() {
    this._splits.forEach((split) => {
      split.style.setProperty("--size", "50%");
    });
  }
  movePanel(sourceId, targetId, zone) {
    return movePanel(this, sourceId, targetId, zone);
  }
  reset() {
    defaultState(this);
  }
}
var controller = new NyaController2;

// src/utils/detect.ts
function getRelativePosition(e, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}
function detectDockZone(e, panel, threshold = 0.35) {
  const rect = panel.getBoundingClientRect();
  const relX = (e.clientX - rect.left) / rect.width;
  const relY = (e.clientY - rect.top) / rect.height;
  if (relX < threshold)
    return "left";
  if (relX > 1 - threshold)
    return "right";
  if (relY < threshold)
    return "top";
  if (relY > 1 - threshold)
    return "bottom";
  return "center";
}

// src/mouse/movePanel.ts
var draggingPanel = null;
document.addEventListener("mousedown", (e) => {
  const target = e.target;
  if (!target.classList.contains("panel")) {
    logger_default.debug("Mousedown event ignored: target is not a panel");
    return;
  }
  const data = getRelativePosition(e, target);
  if (data.x > DRAG || data.y > DRAG) {
    logger_default.debug("Mousedown event ignored: not in drag area");
    return;
  }
  draggingPanel = target;
  logger_default.info("Dragging panel started", draggingPanel);
  document.body.style.cursor = "move";
});
document.addEventListener("mouseup", (e) => {
  if (!draggingPanel) {
    logger_default.debug("Mouseup event ignored: no panel is being dragged");
    return;
  }
  document.body.style.cursor = "";
  function end() {
    logger_default.info("Dragging finished");
    draggingPanel = null;
  }
  const allPanels = [...controller._panels.values()].filter((p) => p !== draggingPanel);
  logger_default.debug("All panels", allPanels);
  const elemUnder = document.elementFromPoint(e.clientX, e.clientY);
  if (!elemUnder) {
    logger_default.debug("Mouseup event ignored: no element under cursor");
    return end();
  }
  const targetPanel = elemUnder.closest(".panel");
  if (!targetPanel) {
    logger_default.debug("Mouseup event ignored: no target panel under cursor");
    return end();
  }
  logger_default.debug("Target panel", targetPanel);
  if (!allPanels.includes(targetPanel)) {
    logger_default.debug("Mouseup event ignored: target panel is not a valid drop target");
    return end();
  }
  const zone = detectDockZone(e, targetPanel);
  logger_default.info(`Docking to ${zone}`);
  if (zone === "center") {
    logger_default.debug("Docking to center, no action taken");
    return end();
  }
  let sourceId = draggingPanel.dataset.nya_id;
  const targetId = targetPanel.dataset.nya_id;
  if (!sourceId)
    sourceId = draggingPanel.qs(".panel[data-nya_id]")?.dataset.nya_id;
  if (!sourceId || !targetId) {
    logger_default.error("Panel ID not found");
    logger_default.error("Source ID:", sourceId);
    logger_default.error("Target ID:", targetId);
    return end();
  }
  if (sourceId === targetId) {
    logger_default.debug("Mouseup event ignored: source and target are the same");
    return end();
  }
  controller.movePanel(sourceId, targetId, zone);
  controller._render();
  controller._setDefaultSize();
  saveNyaState();
  end();
});

// src/mouse/resize.ts
var draggingPanel2 = null;
var leftPanel = null;
var panelType = "width";
document.addEventListener("mousedown", (e) => {
  const target = e.target;
  if (!target.classList.contains("panel"))
    return;
  const _panelType = target.parentElement.classList.contains("column") ? "height" : "width";
  const _leftPanel = target.parentElement.children[0];
  const data = getRelativePosition(e, _leftPanel);
  if (_panelType === "width") {
    const delta = _leftPanel.offsetWidth - data.x;
    if (delta > DRAG || delta < 0)
      return;
  } else {
    const delta = _leftPanel.offsetHeight - data.y;
    if (delta > DRAG || delta < 0)
      return;
  }
  draggingPanel2 = target;
  leftPanel = _leftPanel;
  panelType = _panelType;
  logger_default.debug(`Resizing panel ${panelType}`);
  document.body.style.cursor = panelType === "width" ? "col-resize" : "row-resize";
});
document.addEventListener("mousemove", (e) => {
  if (!draggingPanel2)
    return;
  const data = getRelativePosition(e, leftPanel);
  let value = 0;
  if (panelType === "width")
    value = clamp(RESIZE_MIN, data.x, draggingPanel2.parentElement.offsetWidth - RESIZE_MIN);
  else
    value = clamp(RESIZE_MIN, data.y, draggingPanel2.parentElement.offsetHeight - RESIZE_MIN);
  const id = draggingPanel2.parentElement.dataset.nya_split;
  const split = controller._splits.get(id);
  split.style.setProperty("--size", `${value}px`);
  logger_default.debug(`Resizing to ${value}`);
});
document.addEventListener("mouseup", (e) => {
  if (draggingPanel2)
    logger_default.debug("Resizing finished");
  draggingPanel2 = null;
  document.body.style.cursor = "";
  saveNyaState();
});

// src/index.ts
logger_default.setLogLevel("DEBUG");
window.logger = logger_default;
window.controller = controller;
var app = qs("#app");
var panel1 = document.createElement("div");
panel1.innerHTML = `
    <div class="panel-header">Panel 1</div>
    <div class="panel-content">
        <h3>Welcome to Panel 1</h3>
        <p>This is the first panel in the layout.</p>
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
        <div class="button-group">
            <button onclick="controller.reset()">Reset Config</button>
        </div>
    </div>
`;
var panel2 = document.createElement("div");
panel2.innerHTML = `
    <div class="panel-header">Panel 2</div>
    <div class="panel-content">
        <h3>Content for Panel 2</h3>
        <p>This is the second panel, split from the main container.</p>
        <div class="button-group">
            <button>Button 1</button>
            <button>Button 2</button>
        </div>
    </div>
`;
var panel3 = document.createElement("div");
panel3.innerHTML = `
    <div class="panel-header">Panel 3</div>
    <div class="panel-content">
        <h3>Additional Panel</h3>
        <p>This is the third panel in the layout.</p>
        <div class="info-box">
            <p>This panel was created by splitting with Panel 2.</p>
        </div>
    </div>
`;
var panel4 = document.createElement("div");
panel4.innerHTML = `
    <div class="panel-header">Panel 4</div>
    <div class="panel-content">
        <h3>Form Panel</h3>
        <form>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name"><br><br>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email"><br><br>
            <input type="submit" value="Submit">
        </form>
    </div>
`;
var panel5 = document.createElement("div");
panel5.innerHTML = `
    <div class="panel-header">Panel 5</div>
    <div class="panel-content">
        <h3>Table Panel</h3>
        <table border="1">
            <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Age</th>
            </tr>
            <tr>
                <td>Jill</td>
                <td>Smith</td>
                <td>50</td>
            </tr>
            <tr>
                <td>Eve</td>
                <td>Jackson</td>
                <td>94</td>
            </tr>
        </table>
    </div>
`;
controller.master = app;
controller.setDefaultState([
  "panel1",
  [
    "panel2",
    [
      ["panel3", "panel5", 1],
      "panel4"
    ],
    1
  ]
]);
controller.registerPanel("panel1", panel1);
controller.registerPanel("panel2", panel2);
controller.registerPanel("panel3", panel3);
controller.registerPanel("panel4", panel4);
controller.registerPanel("panel5", panel5);
controller.init();

//# debugId=05331601860A579264756E2164756E21
//# sourceMappingURL=index.js.map
