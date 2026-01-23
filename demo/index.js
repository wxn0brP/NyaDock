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
    let { display = "block" } = opts;
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
    if (!!did)
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
function removePreviewClass(zone) {
  document.querySelectorAll(`.dock-${zone}`).forEach((dock) => dock.classList.remove("dock-" + zone));
}
function removePreviewClasses() {
  removePreviewClass("left");
  removePreviewClass("right");
  removePreviewClass("top");
  removePreviewClass("bottom");
}
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
function locatePanel(e, log2 = false) {
  if (!draggingPanel) {
    if (log2)
      logger_default.debug("Mouse event ignored: no panel is being dragged");
    return;
  }
  const allPanels = [...controller._panels.values()].filter((p) => p !== draggingPanel);
  if (log2)
    logger_default.debug("All panels", allPanels);
  const elemUnder = document.elementFromPoint(e.clientX, e.clientY);
  if (!elemUnder) {
    if (log2)
      logger_default.debug("Mouse event ignored: no element under cursor");
    return null;
  }
  const targetPanel = elemUnder.closest(".panel");
  if (!targetPanel) {
    if (log2)
      logger_default.debug("Mouse event ignored: no target panel under cursor");
    return null;
  }
  if (log2)
    logger_default.debug("Target panel", targetPanel);
  if (!allPanels.includes(targetPanel)) {
    if (log2)
      logger_default.debug("Mouse event ignored: target panel is not a valid drop target");
    return null;
  }
  const zone = detectDockZone(e, targetPanel);
  if (log2)
    logger_default.info(`Docking to ${zone}`);
  if (zone === "center") {
    if (log2)
      logger_default.debug("Docking to center, no action taken");
    return null;
  }
  let sourceId = draggingPanel.dataset.nya_id;
  const targetId = targetPanel.dataset.nya_id;
  if (!sourceId)
    sourceId = draggingPanel.querySelector(".panel[data-nya_id]")?.dataset.nya_id;
  if (!sourceId || !targetId) {
    if (log2)
      logger_default.error("Panel ID not found");
    if (log2)
      logger_default.error("Source ID:", sourceId);
    if (log2)
      logger_default.error("Target ID:", targetId);
    return null;
  }
  if (sourceId === targetId) {
    if (log2)
      logger_default.debug("Mouse event ignored: source and target are the same");
    return null;
  }
  return { sourceId, targetId, zone, targetPanel, draggingPanel };
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
  controller._render();
  controller._setDefaultSize();
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

// public/index.ts
logger_default.setLogLevel("DEBUG");
window.logger = logger_default;
window.controller = controller;
var app = qs("#app");
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
var panels = document.querySelectorAll(".panel");
for (const panel of panels) {
  controller.registerPanel(panel.id, panel);
}
controller.init();

//# debugId=7874AC92BEFD5C7464756E2164756E21
//# sourceMappingURL=index.js.map
