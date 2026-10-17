export class HistoryManager {
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
