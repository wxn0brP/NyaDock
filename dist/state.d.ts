import { Direction, NyaSplit, StructNode } from "./types.js";
export declare class NyaController {
    _split: NyaSplit;
    _panels: Map<string, HTMLDivElement>;
    _splits: Map<string, HTMLDivElement>;
    master: HTMLDivElement;
    settings: {
        key: string;
    };
    _struct: NyaSplit;
    setDefaultState(state: NyaSplit | StructNode): void;
    init(): void;
    registerPanel(id: string, panel: HTMLDivElement): void;
    _render(): void;
    _setDefaultSize(): void;
    movePanel(sourceId: string, targetId: string, zone: Direction): void;
    reset(): void;
}
export declare const controller: NyaController;
