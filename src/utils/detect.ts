import { Direction } from "../types";

export function getRelativePosition(e: MouseEvent, element: HTMLElement) {
    const rect = element.getBoundingClientRect();

    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

export function detectDockZone(e: MouseEvent, panel: HTMLElement, threshold = 0.35): Direction | "center" {
    const rect = panel.getBoundingClientRect();

    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    if (relX < threshold) return "left";
    if (relX > 1 - threshold) return "right";
    if (relY < threshold) return "top";
    if (relY > 1 - threshold) return "bottom";

    return "center";
}