export function getRelativePosition(e, element) {
    const rect = element.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}
export function detectDockZone(e, panel, threshold = 0.35) {
    const rect = panel.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    if (relX < threshold)
        return "left";
    if (relX > 1 - threshold)
        return "right";
    if (relY < threshold)
        return "top";
    if (relY > 1 - threshold)
        return "bottom";
    return "center";
}
