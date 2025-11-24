export function updateSize(split: HTMLDivElement, size: number | string) {
    const staticPanel = split.children[0] as HTMLDivElement;
    const type = split.classList.contains("column") ? "height" : "width";
    staticPanel.style[type] = typeof size === "number" ? `${size}px` : size;
}

export function getRelativePosition(e: MouseEvent, element: HTMLElement) {
    const rect = element.getBoundingClientRect();

    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}