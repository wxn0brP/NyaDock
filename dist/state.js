import { render } from "./render.js";
import { defaultState, loadState } from "./storage.js";
import { RESIZE_MIN } from "./const.js";
import { convertToSplits } from "./utils/convertSplit.js";
import { movePanel } from "./utils/movePanel.js";
import { activateTab, isStructStack, toStack } from "./utils/tabs.js";
import { HistoryManager } from "./history.js";
export class NyaController {
    _split;
    _panels = new Map();
    _splits = new Map();
    master;
    settings = {
        key: "nya.dock",
        minSize: RESIZE_MIN,
    };
    _struct;
    history;
    constructor() {
        this.history = new HistoryManager();
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
        this._splits.forEach(split => {
            split.style.setProperty("--size", "50%");
        });
        this._syncSeparators();
    }
    _syncSeparators() {
        const min = this.settings.minSize;
        this._splits.forEach(split => {
            const divider = split.querySelector(":scope > .nya-resize");
            if (!divider)
                return;
            const isColumn = split.classList.contains("column");
            const total = isColumn ? split.offsetHeight : split.offsetWidth;
            const first = split.firstElementChild;
            if (!total || !first)
                return;
            const percent = (value) => Math.round((value / total) * 100);
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
        stack
            .querySelectorAll(":scope > .nya-stack-tabs > .nya-tab")
            .forEach((tab, index) => tab.classList.toggle("active", index === active));
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
            sizes,
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
export const controller = new NyaController();
