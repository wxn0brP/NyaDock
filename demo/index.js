// node_modules/@wxn0brp/flanker-ui/dist/html.js
var proto = {
  html(v) {
    if (v !== undefined) {
      this.innerHTML = v;
      return this;
    } else {
      return this.innerHTML;
    }
  },
  v(v) {
    if (v !== undefined) {
      this.value = v;
      return this;
    } else {
      return this.value;
    }
  },
  on(event, fn) {
    this.addEventListener(event, fn);
    return this;
  },
  css(style, val = null) {
    if (typeof style === "string") {
      if (val !== null) {
        this.style[style] = val;
      } else {
        this.style.cssText = style;
      }
    } else {
      Object.assign(this.style, style);
    }
    return this;
  },
  attrib(att, arg = null) {
    if (arg !== null) {
      this.setAttribute(att, arg);
      return this;
    } else {
      return this.getAttribute(att) || "";
    }
  },
  clA(...arg) {
    this.classList.add(...arg);
    return this;
  },
  clR(...arg) {
    this.classList.remove(...arg);
    return this;
  },
  clT(className, force) {
    this.classList.toggle(className, force);
    return this;
  },
  animateFade(from, options = {}) {
    const { time = 200, cb } = options;
    const element = this;
    const targetOpacity = from === 0 ? 1 : 0;
    const startOpacity = Math.min(1, Math.max(0, from));
    const startTime = performance.now();
    element.style.opacity = startOpacity.toString();
    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / time, 1);
      const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
      element.style.opacity = currentOpacity.toString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.style.opacity = targetOpacity.toString();
        cb?.();
      }
    }
    requestAnimationFrame(step);
    return this;
  },
  fadeIn(...args) {
    const opts = convert({
      display: "string",
      cb: "function",
      time: "number"
    }, args);
    const { display = "block" } = opts;
    this.css("display", display);
    this.animateFade(0, opts);
    this.fade = true;
    return this;
  },
  fadeOut(...args) {
    const opts = convert({
      cb: "function",
      time: "number"
    }, args);
    const time = opts.time ?? 300;
    opts.time = time;
    this.animateFade(1, {
      ...opts,
      cb: () => {
        this.css("display", "none");
        opts.cb?.();
      }
    });
    this.fade = false;
    return this;
  },
  async fadeInP(...args) {
    return new Promise((resolve) => {
      this.fadeIn(...args, () => resolve(this));
    });
  },
  async fadeOutP(...args) {
    return new Promise((resolve) => {
      this.fadeOut(...args, () => resolve(this));
    });
  },
  fade: true,
  fadeToggle() {
    this.fade ? this.fadeOut() : this.fadeIn();
    return this;
  },
  add(child) {
    this.appendChild(child);
    return this;
  },
  addUp(child) {
    this.insertBefore(child, this.firstChild);
    return this;
  },
  qs(selector, did = 0) {
    if (did)
      selector = `[data-id="${selector}"]`;
    return this.querySelector(selector);
  }
};
proto.qi = proto.qs;
function convert(opts, args) {
  const result = {};
  if (args.length === 0)
    return result;
  if (args.every((arg) => typeof arg === "object"))
    return Object.assign({}, ...args);
  for (const value of args) {
    for (const [key, expectedType] of Object.entries(opts)) {
      if (typeof value === expectedType) {
        result[key] = value;
        break;
      }
    }
  }
  return result;
}
Object.assign(HTMLElement.prototype, proto);
Object.assign(document, proto);
Object.assign(document.body, proto);
Object.assign(document.documentElement, proto);
window.qs = window.qi = proto.qs.bind(document);

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

// src/utils/tabs.ts
function isStack(node) {
  return typeof node === "object" && node !== null && node.type === "stack";
}
function isStructStack(node) {
  return typeof node === "object" && node !== null && Array.isArray(node.tabs);
}
function toStack(struct) {
  return {
    type: "stack",
    tabs: [
      ...struct.tabs
    ],
    active: struct.active ?? 0
  };
}
function activateTab(tree, panelId) {
  if (typeof tree === "string")
    return {
      tree,
      active: -1
    };
  if (isStack(tree)) {
    const index = tree.tabs.indexOf(panelId);
    if (index === -1 || index === tree.active)
      return {
        tree,
        active: -1
      };
    return {
      tree: {
        ...tree,
        active: index
      },
      active: index
    };
  }
  const first = activateTab(tree.nodes[0], panelId);
  if (first.active !== -1) {
    return {
      tree: {
        ...tree,
        nodes: [
          first.tree,
          tree.nodes[1]
        ]
      },
      active: first.active
    };
  }
  const second = activateTab(tree.nodes[1], panelId);
  if (second.active !== -1) {
    return {
      tree: {
        ...tree,
        nodes: [
          tree.nodes[0],
          second.tree
        ]
      },
      active: second.active
    };
  }
  return {
    tree,
    active: -1
  };
}

// src/render.ts
function render(controller) {
  const tempElement = document.createElement("div");
  for (const panel of controller._panels.values()) {
    tempElement.appendChild(panel);
  }
  controller.master.innerHTML = "";
  const root = controller._split;
  controller.master.appendChild(isStack(root) ? renderStack(controller, root, "0") : renderSplit(controller, root, "0"));
}
function renderSplit(controller, split, prefix = "0") {
  const div = document.createElement("div");
  div.classList.add("split");
  div.classList.add(split.type);
  div.dataset.nya_split = prefix;
  controller._splits.set(prefix, div);
  const [first, second] = split.nodes;
  div.appendChild(renderNode(controller, first, `${prefix}.0`));
  div.appendChild(renderSeparator(split));
  div.appendChild(renderNode(controller, second, `${prefix}.1`));
  return div;
}
function renderNode(controller, node, prefix) {
  if (typeof node === "string") {
    const panel = controller._panels.get(node);
    if (panel)
      panel.style.display = "";
    return panel;
  }
  if (isStack(node))
    return renderStack(controller, node, prefix);
  const splitPanel = document.createElement("div");
  splitPanel.classList.add("panel");
  splitPanel.appendChild(renderSplit(controller, node, prefix));
  return splitPanel;
}
function renderStack(controller, stack, prefix) {
  const div = document.createElement("div");
  div.classList.add("nya-stack");
  div.dataset.nya_stack = prefix;
  const tabs = document.createElement("div");
  tabs.classList.add("nya-stack-tabs");
  const body = document.createElement("div");
  body.classList.add("nya-stack-body");
  stack.tabs.forEach((id, index) => {
    const panel = controller._panels.get(id);
    if (!panel)
      return;
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("nya-tab");
    if (index === stack.active)
      button.classList.add("active");
    button.textContent = panelTitle(panel, id);
    button.dataset.nya_tab = id;
    button.addEventListener("click", () => controller.selectTab(id));
    tabs.appendChild(button);
    panel.style.display = index === stack.active ? "" : "none";
    body.appendChild(panel);
  });
  div.appendChild(tabs);
  div.appendChild(body);
  return div;
}
function panelTitle(panel, fallback) {
  const header = panel.querySelector(".panel-header");
  return header?.textContent?.trim() || fallback;
}
function renderSeparator(split) {
  const divider = document.createElement("div");
  divider.classList.add("nya-resize");
  divider.setAttribute("role", "separator");
  divider.setAttribute("aria-orientation", split.type === "row" ? "vertical" : "horizontal");
  divider.setAttribute("aria-valuemin", "0");
  divider.setAttribute("aria-valuemax", "100");
  divider.setAttribute("aria-valuenow", "50");
  divider.tabIndex = 0;
  return divider;
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
function saveState(controller) {
  const state = controller._split;
  const sizes = {};
  controller._splits.forEach((split, key) => {
    sizes[key] = split.style.getPropertyValue("--size");
  });
  localStorage.setItem(controller.settings.key, JSON.stringify({
    state,
    sizes
  }));
}
function defaultState(controller) {
  controller._split = Object.assign({}, controller._struct);
  controller._render();
  controller._setDefaultSize();
  saveState(controller);
}
function loadState(controller) {
  const stateString = localStorage.getItem(controller.settings.key);
  if (!stateString)
    return defaultState(controller);
  const { state, sizes } = JSON.parse(stateString);
  controller._split = state;
  controller._render();
  controller._splits.forEach((split, key) => {
    split.style.setProperty("--size", sizes[key]);
  });
}
var saveNyaState = throttle(() => {
  logger_default.debug("Saving state");
  saveState(controller);
}, 3000);

// src/utils/convertSplit.ts
function convertNode(node) {
  if (Array.isArray(node))
    return convertToSplits(node);
  if (isStructStack(node))
    return toStack(node);
  return node;
}
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
    return {
      type: isColumnLayout ? "column" : "row",
      nodes: [
        convertNode(actualArray[0]),
        "empty"
      ]
    };
  } else if (actualArray.length === 2) {
    const [first, second] = actualArray;
    return {
      type: isColumnLayout ? "column" : "row",
      nodes: [
        convertNode(first),
        convertNode(second)
      ]
    };
  } else {
    const [first, ...rest] = actualArray;
    let restStructure = [
      rest[0]
    ];
    for (let i = 1;i < rest.length; i++) {
      if (isColumnLayout) {
        restStructure = [
          restStructure,
          rest[i],
          1
        ];
      } else {
        restStructure = [
          restStructure,
          rest[i]
        ];
      }
    }
    return {
      type: isColumnLayout ? "column" : "row",
      nodes: [
        convertNode(first),
        convertNode(restStructure)
      ]
    };
  }
}

// src/utils/movePanel.ts
function removeNode(node, id) {
  if (typeof node === "string")
    return node === id ? null : node;
  if (isStack(node)) {
    if (!node.tabs.includes(id))
      return node;
    const tabs = node.tabs.filter((tab) => tab !== id);
    if (tabs.length === 0)
      return null;
    if (tabs.length === 1)
      return tabs[0];
    return {
      ...node,
      tabs,
      active: Math.min(node.active, tabs.length - 1)
    };
  }
  const first = removeNode(node.nodes[0], id);
  const second = removeNode(node.nodes[1], id);
  if (!first)
    return second;
  if (!second)
    return first;
  if (first !== node.nodes[0] || second !== node.nodes[1])
    return {
      ...node,
      nodes: [
        first,
        second
      ]
    };
  return node;
}
function insertTab(node, targetId, id) {
  if (typeof node === "string") {
    if (node !== targetId)
      return node;
    return {
      type: "stack",
      tabs: [
        node,
        id
      ],
      active: 1
    };
  }
  if (isStack(node)) {
    if (!node.tabs.includes(targetId))
      return node;
    if (node.tabs.includes(id))
      return {
        ...node,
        active: node.tabs.indexOf(id)
      };
    const tabs = [
      ...node.tabs,
      id
    ];
    return {
      ...node,
      tabs,
      active: tabs.length - 1
    };
  }
  const first = insertTab(node.nodes[0], targetId, id);
  const second = insertTab(node.nodes[1], targetId, id);
  if (first !== node.nodes[0] || second !== node.nodes[1])
    return {
      ...node,
      nodes: [
        first,
        second
      ]
    };
  return node;
}
function buildSplit(sourceId, target, zone) {
  return {
    type: zone === "left" || zone === "right" ? "row" : "column",
    nodes: zone === "left" || zone === "top" ? [
      sourceId,
      target
    ] : [
      target,
      sourceId
    ]
  };
}
function dockAround(node, targetId, sourceId, zone) {
  if (typeof node === "string") {
    if (node !== targetId)
      return node;
    return buildSplit(sourceId, node, zone);
  }
  if (isStack(node)) {
    if (!node.tabs.includes(targetId))
      return node;
    return buildSplit(sourceId, node, zone);
  }
  const first = dockAround(node.nodes[0], targetId, sourceId, zone);
  const second = dockAround(node.nodes[1], targetId, sourceId, zone);
  if (first !== node.nodes[0] || second !== node.nodes[1])
    return {
      ...node,
      nodes: [
        first,
        second
      ]
    };
  return node;
}
function isSameStack(node, sourceId, targetId) {
  if (isStack(node))
    return node.tabs.includes(sourceId) && node.tabs.includes(targetId);
  if (typeof node === "string")
    return false;
  return isSameStack(node.nodes[0], sourceId, targetId) || isSameStack(node.nodes[1], sourceId, targetId);
}
function reorderTab(node, sourceId, targetId) {
  if (typeof node === "string")
    return node;
  if (isStack(node)) {
    if (!node.tabs.includes(sourceId) || !node.tabs.includes(targetId))
      return node;
    const tabs = node.tabs.filter((tab) => tab !== sourceId);
    tabs.splice(tabs.indexOf(targetId), 0, sourceId);
    if (tabs.join() === node.tabs.join())
      return node;
    return {
      ...node,
      tabs,
      active: tabs.indexOf(sourceId)
    };
  }
  const first = reorderTab(node.nodes[0], sourceId, targetId);
  const second = reorderTab(node.nodes[1], sourceId, targetId);
  if (first !== node.nodes[0] || second !== node.nodes[1])
    return {
      ...node,
      nodes: [
        first,
        second
      ]
    };
  return node;
}
function movePanel(controller, sourceId, targetId, zone) {
  if (!controller._split || sourceId === targetId)
    return;
  if (zone === "center" && isSameStack(controller._split, sourceId, targetId)) {
    const reordered = reorderTab(controller._split, sourceId, targetId);
    if (reordered !== controller._split)
      controller._split = reordered;
    return;
  }
  const withoutSource = removeNode(controller._split, sourceId);
  if (!withoutSource)
    return;
  const tree = zone === "center" ? insertTab(withoutSource, targetId, sourceId) : dockAround(withoutSource, targetId, sourceId, zone);
  if (typeof tree === "string")
    return;
  controller._split = tree;
}

// src/history.ts
class HistoryManager {
  _stack = [];
  _index = -1;
  _maxSize;
  constructor(maxSize = 50) {
    this._maxSize = maxSize;
  }
  push(state) {
    this._stack.splice(this._index + 1);
    this._stack.push(state);
    if (this._stack.length > this._maxSize)
      this._stack.shift();
    this._index = this._stack.length - 1;
  }
  undo() {
    if (!this.canUndo())
      return null;
    this._index--;
    return this._stack[this._index];
  }
  redo() {
    if (!this.canRedo())
      return null;
    this._index++;
    return this._stack[this._index];
  }
  canUndo() {
    return this._index > 0;
  }
  canRedo() {
    return this._index < this._stack.length - 1;
  }
}

// src/state.ts
class NyaController2 {
  _split;
  _panels = new Map;
  _splits = new Map;
  master;
  settings = {
    key: "nya.dock",
    minSize: RESIZE_MIN
  };
  _struct;
  history;
  constructor() {
    this.history = new HistoryManager;
  }
  setDefaultState(state) {
    if (Array.isArray(state))
      this._struct = convertToSplits(state);
    else if (isStructStack(state))
      this._struct = toStack(state);
    else
      this._struct = state;
  }
  init() {
    if (!this.master)
      throw new Error("Master element not set");
    if (!this._struct)
      throw new Error("Structure not set");
    loadState(this);
    this._pushHistory();
  }
  registerPanel(id, panel) {
    panel.dataset.nya_id = id;
    panel.classList.add("panel");
    this._panels.set(id, panel);
  }
  _render() {
    this._splits.clear();
    const result = render(this);
    this._syncSeparators();
    return result;
  }
  _setDefaultSize() {
    this._splits.forEach((split) => {
      split.style.setProperty("--size", "50%");
    });
    this._syncSeparators();
  }
  _syncSeparators() {
    const min = this.settings.minSize;
    this._splits.forEach((split) => {
      const divider = split.querySelector(":scope > .nya-resize");
      if (!divider)
        return;
      const isColumn = split.classList.contains("column");
      const total = isColumn ? split.offsetHeight : split.offsetWidth;
      const first = split.firstElementChild;
      if (!total || !first)
        return;
      const percent = (value) => Math.round(value / total * 100);
      const size = isColumn ? first.offsetHeight : first.offsetWidth;
      divider.setAttribute("aria-valuenow", String(percent(size)));
      divider.setAttribute("aria-valuemin", String(percent(min)));
      divider.setAttribute("aria-valuemax", String(100 - percent(min)));
    });
  }
  _syncStack(panelId, active) {
    const body = this._panels.get(panelId)?.parentElement;
    const stack = body?.parentElement;
    if (!body || !stack)
      return;
    stack.querySelectorAll(":scope > .nya-stack-tabs > .nya-tab").forEach((tab, index) => tab.classList.toggle("active", index === active));
    body.querySelectorAll(":scope > .panel").forEach((panel, index) => {
      panel.style.display = index === active ? "" : "none";
    });
  }
  selectTab(panelId) {
    const { tree, active } = activateTab(this._split, panelId);
    if (active === -1)
      return false;
    this._split = tree;
    this._syncStack(panelId, active);
    this._pushHistory();
    return true;
  }
  _captureState() {
    const sizes = {};
    this._splits.forEach((split, key) => {
      sizes[key] = split.style.getPropertyValue("--size");
    });
    return {
      split: Object.assign({}, this._split),
      sizes
    };
  }
  _pushHistory() {
    this.history.push(this._captureState());
  }
  _restoreState(state) {
    this._split = state.split;
    this._render();
    this._splits.forEach((split, key) => {
      split.style.setProperty("--size", state.sizes[key]);
    });
    this._syncSeparators();
  }
  undo() {
    const previousState = this.history.undo();
    if (previousState) {
      this._restoreState(previousState);
      return true;
    }
    return false;
  }
  redo() {
    const nextState = this.history.redo();
    if (nextState) {
      this._restoreState(nextState);
      return true;
    }
    return false;
  }
  canUndo() {
    return this.history.canUndo();
  }
  canRedo() {
    return this.history.canRedo();
  }
  movePanel(sourceId, targetId, zone) {
    const previous = this._split;
    const result = movePanel(this, sourceId, targetId, zone);
    if (this._split === previous)
      return result;
    this._render();
    this._setDefaultSize();
    this._pushHistory();
    return result;
  }
  reset() {
    defaultState(this);
    this._pushHistory();
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
function removePreviewClass(zone) {
  document.querySelectorAll(`.dock-${zone}`).forEach((dock) => dock.classList.remove("dock-" + zone));
}
function removePreviewClasses() {
  removePreviewClass("left");
  removePreviewClass("right");
  removePreviewClass("top");
  removePreviewClass("bottom");
  removePreviewClass("center");
}
var draggingPanel = null;
document.addEventListener("mousedown", (e) => {
  const target = e.target;
  const tab = target.closest(".nya-tab");
  if (tab) {
    const panel = controller._panels.get(tab.dataset.nya_tab);
    if (!panel)
      return;
    draggingPanel = panel;
    logger_default.info("Dragging tab started", panel);
    document.body.style.cursor = "move";
    return;
  }
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
function locatePanel(e, log = false) {
  if (!draggingPanel) {
    if (log)
      logger_default.debug("Mouse event ignored: no panel is being dragged");
    return;
  }
  const allPanels = [
    ...controller._panels.values()
  ].filter((p) => p !== draggingPanel);
  if (log)
    logger_default.debug("All panels", allPanels);
  const elemUnder = document.elementFromPoint(e.clientX, e.clientY);
  if (!elemUnder) {
    if (log)
      logger_default.debug("Mouse event ignored: no element under cursor");
    return null;
  }
  const tab = elemUnder.closest(".nya-tab");
  let targetPanel;
  let zone = "center";
  if (tab) {
    targetPanel = controller._panels.get(tab.dataset.nya_tab) ?? null;
  } else {
    targetPanel = elemUnder.closest(".panel");
    if (targetPanel)
      zone = detectDockZone(e, targetPanel);
  }
  if (!targetPanel) {
    if (log)
      logger_default.debug("Mouse event ignored: no target panel under cursor");
    return null;
  }
  if (log)
    logger_default.debug("Target panel", targetPanel);
  if (!allPanels.includes(targetPanel)) {
    if (log)
      logger_default.debug("Mouse event ignored: target panel is not a valid drop target");
    return null;
  }
  if (log)
    logger_default.info(`Docking to ${zone}`);
  let sourceId = draggingPanel.dataset.nya_id;
  const targetId = targetPanel.dataset.nya_id;
  if (!sourceId)
    sourceId = draggingPanel.querySelector(".panel[data-nya_id]")?.dataset.nya_id;
  if (!sourceId || !targetId) {
    if (log)
      logger_default.error("Panel ID not found");
    if (log)
      logger_default.error("Source ID:", sourceId);
    if (log)
      logger_default.error("Target ID:", targetId);
    return null;
  }
  if (sourceId === targetId) {
    if (log)
      logger_default.debug("Mouse event ignored: source and target are the same");
    return null;
  }
  return {
    sourceId,
    targetId,
    zone,
    targetPanel,
    draggingPanel
  };
}
document.addEventListener("mouseup", (e) => {
  function end() {
    logger_default.info("Dragging finished");
    draggingPanel = null;
  }
  const result = locatePanel(e, true);
  document.body.style.cursor = "";
  if (!result) {
    end();
    return;
  }
  const { sourceId, targetId, zone } = result;
  controller.movePanel(sourceId, targetId, zone);
  saveNyaState();
  removePreviewClasses();
  end();
});
document.addEventListener("mousemove", (e) => {
  const result = locatePanel(e);
  if (!result)
    return;
  const { zone, targetPanel } = result;
  removePreviewClasses();
  targetPanel.querySelector(".panel-content").classList.add(`dock-${zone}`);
});

// src/mouse/resize.ts
var divider = null;
var leftPanel = null;
var axis = "width";
var resizeStarted = false;
var resizePending = false;
function setSize(el, axisValue, value) {
  const split = el.parentElement;
  const total = axisValue === "width" ? split.offsetWidth : split.offsetHeight;
  const min = controller.settings.minSize;
  if (!total)
    return value;
  const clamped = clamp(min, value, total - min);
  split.style.setProperty("--size", `${clamped}px`);
  const now = Math.round(clamped / total * 100);
  el.setAttribute("aria-valuenow", String(now));
  el.setAttribute("aria-valuemin", String(Math.round(min / total * 100)));
  el.setAttribute("aria-valuemax", String(100 - Math.round(min / total * 100)));
  return clamped;
}
document.addEventListener("mousedown", (e) => {
  const target = e.target;
  if (!target.classList.contains("nya-resize"))
    return;
  const split = target.parentElement;
  divider = target;
  leftPanel = split.children[0];
  axis = split.classList.contains("column") ? "height" : "width";
  resizeStarted = false;
  document.body.style.cursor = axis === "width" ? "col-resize" : "row-resize";
  logger_default.debug(`Resizing panel ${axis}`);
});
document.addEventListener("mousemove", (e) => {
  if (!divider)
    return;
  resizeStarted = true;
  const data = getRelativePosition(e, leftPanel);
  const value = setSize(divider, axis, axis === "width" ? data.x : data.y);
  logger_default.debug(`Resizing to ${value}`);
});
document.addEventListener("mouseup", (e) => {
  if (divider) {
    logger_default.debug("Resizing finished");
    if (resizeStarted)
      controller._pushHistory();
  }
  divider = null;
  resizeStarted = false;
  document.body.style.cursor = "";
  saveNyaState();
});
document.addEventListener("dblclick", (e) => {
  const target = e.target;
  if (!target.classList.contains("nya-resize"))
    return;
  const total = target.parentElement.classList.contains("column") ? target.parentElement.offsetHeight : target.parentElement.offsetWidth;
  setSize(target, getAxis(target), total / 2);
  controller._pushHistory();
  saveNyaState();
});
document.addEventListener("keydown", (e) => {
  const target = e.target;
  if (!target.classList.contains("nya-resize"))
    return;
  const axisValue = getAxis(target);
  const split = target.parentElement;
  const total = axisValue === "width" ? split.offsetWidth : split.offsetHeight;
  const first = split.children[0];
  const current = axisValue === "width" ? first.offsetWidth : first.offsetHeight;
  const step = Math.round(total * (e.shiftKey ? 0.1 : 0.02));
  const decrease = axisValue === "width" ? "ArrowLeft" : "ArrowUp";
  const increase = axisValue === "width" ? "ArrowRight" : "ArrowDown";
  let next;
  if (e.key === decrease)
    next = current - step;
  else if (e.key === increase)
    next = current + step;
  else if (e.key === "Enter" || e.key === "Home")
    next = total / 2;
  else
    return;
  e.preventDefault();
  const applied = setSize(target, axisValue, next);
  if (applied !== current)
    resizePending = true;
});
document.addEventListener("keyup", (e) => {
  if (!resizePending)
    return;
  resizePending = false;
  controller._pushHistory();
  saveNyaState();
});
function getAxis(el) {
  return el.parentElement.classList.contains("column") ? "height" : "width";
}

// src/utils/layout.ts
function fold(type, nodes) {
  if (nodes.length < 2)
    throw new Error(`nya-dock: ${type} needs at least two children`);
  if (nodes.length === 2)
    return {
      type,
      nodes: [
        nodes[0],
        nodes[1]
      ]
    };
  return {
    type,
    nodes: [
      nodes[0],
      fold(type, nodes.slice(1))
    ]
  };
}
function row(...nodes) {
  return fold("row", nodes);
}
function column(...nodes) {
  return fold("column", nodes);
}
function tabs(...args) {
  let ids;
  let active;
  if (Array.isArray(args[0])) {
    ids = args[0];
    active = args[1] ?? 0;
  } else {
    ids = args;
    active = 0;
  }
  if (ids.length === 0)
    throw new Error("nya-dock: tabs needs at least one id");
  return {
    type: "stack",
    tabs: [
      ...ids
    ],
    active
  };
}
// public/index.ts
logger_default.setLogLevel("DEBUG");
window.logger = logger_default;
window.controller = controller;
var app = qs("#app");
controller.master = app;
controller.setDefaultState(row("panel1", column("panel2", column(tabs(["panel3", "panel5"]), "panel4"))));
var panels = document.querySelectorAll(".panel");
for (const panel of panels) {
  controller.registerPanel(panel.id, panel);
}
controller.init();

//# debugId=55E31A4E15FC6A3764756E2164756E21
//# sourceMappingURL=index.js.map
