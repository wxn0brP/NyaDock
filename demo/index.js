// node_modules/@wxn0brp/flanker-ui/dist/html.js
(() => {
  var f = Object.defineProperty;
  var a = (t, e) => f(t, "name", { value: e, configurable: true });
  var i = { html(t) {
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
    let { time: n = 200, cb: s } = e, r = this, l = t === 0 ? 1 : 0, m = Math.min(1, Math.max(0, t)), u = performance.now();
    r.style.opacity = m.toString();
    function o(T) {
      let d = T - u, h = Math.min(d / n, 1), L = m + (l - m) * h;
      r.style.opacity = L.toString(), h < 1 ? requestAnimationFrame(o) : (r.style.opacity = l.toString(), s?.());
    }
    return a(o, "step"), requestAnimationFrame(o), this;
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
  }, qi(t, e = 0) {
    return this.qs(t, e);
  } };
  function c(t, e) {
    let n = {};
    if (e.length === 0)
      return n;
    if (e.every((s) => typeof s == "object"))
      return Object.assign({}, ...e);
    for (let s of e)
      for (let [r, l] of Object.entries(t))
        if (typeof s === l) {
          n[r] = s;
          break;
        }
    return n;
  }
  a(c, "convert");
  Object.assign(HTMLElement.prototype, i);
  Object.assign(document, i);
  Object.assign(document.body, i);
  Object.assign(document.documentElement, i);
  for (let t of ["qs", "qi"])
    typeof i[t] == "function" && (window[t] = function(...e) {
      return i[t].apply(document, e);
    });
})();

// src/createPanel.ts
function createPanel(basePanel = true) {
  const div = document.createElement("div");
  div.classList.add("panel");
  if (basePanel)
    div.classList.add("base");
  return div;
}
function createSplit(type) {
  const div = document.createElement("div");
  div.classList.add("split");
  div.classList.add(type);
  return div;
}
function panel2Split(replacedPanel, newPanel, type) {
  const splitPanel = createPanel(false);
  const split = createSplit(type);
  const parentElement = replacedPanel.parentElement;
  splitPanel.appendChild(split);
  parentElement.replaceChild(splitPanel, replacedPanel);
  split.appendChild(replacedPanel);
  split.appendChild(newPanel);
  return split;
}

// src/const.ts
var DRAG = 30;
var RESIZE_MIN = 100;

// src/utils.ts
function updateSize(split, size = "50%") {
  const staticPanel = split.children[0];
  const data = typeof size === "number" ? `${size}px` : size;
  if (split.classList.contains("column")) {
    staticPanel.style.height = data;
    staticPanel.style.width = "";
  } else {
    staticPanel.style.width = data;
    staticPanel.style.height = "";
  }
  const siblingPanel = split.children[1];
  siblingPanel.style.width = "";
  siblingPanel.style.height = "";
}
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
function swapPanels(split) {
  const staticPanel = split.children[0];
  const staticPanelWidth = staticPanel.style.width;
  const staticPanelHeight = staticPanel.style.height;
  const dynamicPanel = split.children[1];
  staticPanel.style.width = "";
  staticPanel.style.height = "";
  dynamicPanel.style.width = staticPanelWidth;
  dynamicPanel.style.height = staticPanelHeight;
  split.appendChild(staticPanel);
}

// src/mouse/movePanel.ts
var draggingPanel = null;
document.addEventListener("mousedown", (e) => {
  const target = e.target;
  if (!target.classList.contains("panel"))
    return;
  const data = getRelativePosition(e, target);
  if (data.x > DRAG || data.y > DRAG)
    return;
  draggingPanel = target;
  document.body.style.cursor = "move";
});
document.addEventListener("mouseup", (e) => {
  if (!draggingPanel)
    return;
  document.body.style.cursor = "";
  const master = draggingPanel.closest(".master");
  const allPanels = [...master.querySelectorAll(".panel")].filter((p) => p !== draggingPanel);
  const elemUnder = document.elementFromPoint(e.clientX, e.clientY);
  if (!elemUnder) {
    draggingPanel = null;
    return;
  }
  const targetPanel = elemUnder.closest(".panel");
  if (!targetPanel) {
    draggingPanel = null;
    return;
  }
  if (!allPanels.includes(targetPanel)) {
    draggingPanel = null;
    return;
  }
  function end() {
    draggingPanel = null;
  }
  targetPanel.parentElement.dataset.id = "ny-id";
  const zone = detectDockZone(e, targetPanel);
  if (zone === "center") {
    end();
    return;
  }
  const siblingPanel = [...draggingPanel.parentElement.children].find((el) => el !== draggingPanel);
  siblingPanel.style.width = "";
  siblingPanel.style.height = "";
  targetPanel.parentElement.replaceChild(draggingPanel.parentElement.parentElement, targetPanel);
  const nyID = qs("ny-id", 1);
  nyID.appendChild(siblingPanel);
  nyID.dataset.id = "";
  draggingPanel.parentElement.appendChild(targetPanel);
  targetPanel.style.width = "";
  targetPanel.style.height = "";
  const newSplitContainer = draggingPanel.parentElement;
  if (!newSplitContainer)
    return end();
  const columnType = zone === "left" || zone === "right";
  newSplitContainer.classList.toggle("column", !columnType);
  newSplitContainer.classList.toggle("row", columnType);
  updateSize(draggingPanel.parentElement);
  if (zone === "right" || zone === "bottom")
    swapPanels(newSplitContainer);
  const newSplitPanel = newSplitContainer.parentElement;
  if (!newSplitPanel)
    return end();
  newSplitPanel.style.width = "50%";
  newSplitPanel.style.height = "";
  end();
});

// node_modules/@wxn0brp/flanker-ui/dist/utils.js
function clamp(min, value, max) {
  return Math.min(Math.max(value, min), max);
}

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
  updateSize(draggingPanel2.parentElement, value);
});
document.addEventListener("mouseup", (e) => {
  draggingPanel2 = null;
  document.body.style.cursor = "";
});

// src/index.ts
var app = qs("#app");
var panel1 = createPanel();
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
    </div>
`;
app.appendChild(panel1);
var panel2 = createPanel();
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
app.appendChild(panel2);
updateSize(app);
var panel3 = createPanel();
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
updateSize(panel2Split(panel2, panel3, "column"));

//# debugId=5D112980FE106D0764756E2164756E21
//# sourceMappingURL=index.js.map
