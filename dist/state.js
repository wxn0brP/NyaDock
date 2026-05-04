import { render } from "./render.js";
import { defaultState, loadState } from "./storage.js";
import { convertToSplits } from "./utils/convertSplit.js";
import { movePanel } from "./utils/movePanel.js";
export class NyaController {
    _split;
    _panels = new Map();
    _splits = new Map();
    master;
    settings = {
        key: "nya.dock",
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
export const controller = new NyaController();
