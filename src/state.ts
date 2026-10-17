import { render } from "./render";
import { defaultState, loadState } from "./storage";
import { RESIZE_MIN } from "./const";
import {
	Direction,
	NyaSplit,
	NyaStack,
	StructNode,
	StructStack,
} from "./types";
import { convertToSplits } from "./utils/convertSplit";
import { movePanel } from "./utils/movePanel";
import { activateTab, isStructStack, toStack } from "./utils/tabs";
import { HistoryManager, HistoryState } from "./history";

export class NyaController {
	_split: NyaSplit | NyaStack;
	_panels = new Map<string, HTMLDivElement>();
	_splits = new Map<string, HTMLDivElement>();
	master: HTMLDivElement;
	settings = {
		key: "nya.dock",
		minSize: RESIZE_MIN,
	};
	_struct: NyaSplit | NyaStack;
	history: HistoryManager;

	constructor() {
		this.history = new HistoryManager();
	}

	setDefaultState(state: NyaSplit | NyaStack | StructNode | StructStack) {
		if (Array.isArray(state)) this._struct = convertToSplits(state);
		else if (isStructStack(state)) this._struct = toStack(state);
		else this._struct = state as NyaSplit | NyaStack;
	}

	init() {
		if (!this.master) throw new Error("Master element not set");
		if (!this._struct) throw new Error("Structure not set");

		loadState(this);
		this._pushHistory();
	}

	registerPanel(id: string, panel: HTMLDivElement) {
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
			const divider = split.querySelector<HTMLElement>(":scope > .nya-resize");
			if (!divider) return;

			const isColumn = split.classList.contains("column");
			const total = isColumn ? split.offsetHeight : split.offsetWidth;
			const first = split.firstElementChild as HTMLElement;
			if (!total || !first) return;

			const percent = (value: number) => Math.round((value / total) * 100);
			const size = isColumn ? first.offsetHeight : first.offsetWidth;

			divider.setAttribute("aria-valuenow", String(percent(size)));
			divider.setAttribute("aria-valuemin", String(percent(min)));
			divider.setAttribute("aria-valuemax", String(100 - percent(min)));
		});
	}

	_syncStack(panelId: string, active: number) {
		const body = this._panels.get(panelId)?.parentElement;
		const stack = body?.parentElement;
		if (!body || !stack) return;

		stack
			.querySelectorAll(":scope > .nya-stack-tabs > .nya-tab")
			.forEach((tab, index) =>
				tab.classList.toggle("active", index === active),
			);

		body.querySelectorAll(":scope > .panel").forEach((panel, index) => {
			(panel as HTMLElement).style.display = index === active ? "" : "none";
		});
	}

	selectTab(panelId: string) {
		const { tree, active } = activateTab(this._split, panelId);
		if (active === -1) return false;

		this._split = tree as NyaSplit | NyaStack;
		this._syncStack(panelId, active);
		this._pushHistory();
		return true;
	}

	_captureState(): HistoryState {
		const sizes: Record<string, string> = {};
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

	_restoreState(state: HistoryState) {
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

	movePanel(sourceId: string, targetId: string, zone: Direction | "center") {
		const previous = this._split;
		const result = movePanel(this, sourceId, targetId, zone);
		if (this._split === previous) return result;

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
