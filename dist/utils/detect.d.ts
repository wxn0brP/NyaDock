import { Direction } from "../types.js";
export declare function getRelativePosition(e: MouseEvent, element: HTMLElement): {
    x: number;
    y: number;
};
export declare function detectDockZone(e: MouseEvent, panel: HTMLElement, threshold?: number): Direction | "center";
