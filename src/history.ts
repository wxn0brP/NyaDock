import { NyaSplit, NyaStack } from "./types";

export interface HistoryState {
	split: NyaSplit | NyaStack;
	sizes: Record<string, string>;
}

export class HistoryManager {
	_stack: HistoryState[] = [];
	_index = -1;
	_maxSize: number;

	constructor(maxSize = 50) {
		this._maxSize = maxSize;
	}

	push(state: HistoryState) {
		this._stack.splice(this._index + 1);
		this._stack.push(state);

		if (this._stack.length > this._maxSize) this._stack.shift();

		this._index = this._stack.length - 1;
	}

	undo(): HistoryState | null {
		if (!this.canUndo()) return null;

		this._index--;
		return this._stack[this._index];
	}

	redo(): HistoryState | null {
		if (!this.canRedo()) return null;

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
