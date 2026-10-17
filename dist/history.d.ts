import { NyaSplit, NyaStack } from "./types.js";
export interface HistoryState {
    split: NyaSplit | NyaStack;
    sizes: Record<string, string>;
}
export declare class HistoryManager {
    _stack: HistoryState[];
    _index: number;
    _maxSize: number;
    constructor(maxSize?: number);
    push(state: HistoryState): void;
    undo(): HistoryState | null;
    redo(): HistoryState | null;
    canUndo(): boolean;
    canRedo(): boolean;
}
