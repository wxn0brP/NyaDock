import { render } from "./render";
import { defaultState, loadState } from "./storage";
import { Direction, NyaSplit, StructNode } from "./types";
import { convertToSplits } from "./utils/convertSplit";
import { movePanel } from "./utils/movePanel";

export class NyaController {
	_split: NyaSplit;
	_panels = new Map<string, HTMLDivElement>();
	_splits = new Map<string, HTMLDivElement>();
	master: HTMLDivElement;
	settings = {
		key: "nya.dock",
	};
	_struct: NyaSplit;

	setDefaultState(state: NyaSplit | StructNode) {
		this._struct = Array.isArray(state) ? convertToSplits(state) : state;
	}

	init() {
		if (!this.master) throw new Error("Master element not set");
		if (!this._struct) throw new Error("Structure not set");

		loadState(this);
	}

	registerPanel(id: string, panel: HTMLDivElement) {
		panel.dataset.nya_id = id;
		panel.classList.add("panel");
		this._panels.set(id, panel);
	}

	_render() {
		this._splits.clear();
		return render(this);
	}

	_setDefaultSize() {
		this._splits.forEach(split => {
			split.style.setProperty("--size", "50%");
		});
	}

	movePanel(sourceId: string, targetId: string, zone: Direction) {
		return movePanel(this, sourceId, targetId, zone);
	}

	reset() {
		defaultState(this);
	}
}

export const controller = new NyaController();
