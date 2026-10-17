import { Direction, NyaSplit, NyaStack, StructNode, StructStack } from "./types.js";
import { HistoryManager, HistoryState } from "./history.js";
export declare class NyaController {
    _split: NyaSplit | NyaStack;
    _panels: Map<string, HTMLDivElement>;
    _splits: Map<string, HTMLDivElement>;
    master: HTMLDivElement;
    settings: {
        key: string;
        minSize: number;
    };
    _struct: NyaSplit | NyaStack;
    history: HistoryManager;
    constructor();
    setDefaultState(state: NyaSplit | NyaStack | StructNode | StructStack): void;
    init(): void;
    registerPanel(id: string, panel: HTMLDivElement): void;
    _render(): void;
    _setDefaultSize(): void;
    _syncSeparators(): void;
    _syncStack(panelId: string, active: number): void;
    selectTab(panelId: string): boolean;
    _captureState(): HistoryState;
    _pushHistory(): void;
    _restoreState(state: HistoryState): void;
    undo(): boolean;
    redo(): boolean;
    canUndo(): boolean;
    canRedo(): boolean;
    movePanel(sourceId: string, targetId: string, zone: Direction | "center"): void;
    reset(): void;
}
export declare const controller: NyaController;
