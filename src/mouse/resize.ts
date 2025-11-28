import { clamp } from "@wxn0brp/flanker-ui/utils";
import { DRAG, RESIZE_MIN } from "../const";
import logger from "../logger";
import { controller } from "../state";
import { getRelativePosition } from "../utils";

let draggingPanel: HTMLDivElement = null;
let leftPanel: HTMLDivElement = null;
let panelType: "width" | "height" = "width";

document.addEventListener("mousedown", (e) => {
    const target = e.target as HTMLDivElement;
    if (!target.classList.contains("panel")) return;

    const _panelType = target.parentElement.classList.contains("column") ? "height" : "width";
    const _leftPanel = target.parentElement.children[0] as HTMLDivElement;
    const data = getRelativePosition(e, _leftPanel);

    if (_panelType === "width") {
        const delta = _leftPanel.offsetWidth - data.x;
        if (delta > DRAG || delta < 0) return;
    } else {
        const delta = _leftPanel.offsetHeight - data.y;
        if (delta > DRAG || delta < 0) return;
    }

    draggingPanel = target;
    leftPanel = _leftPanel;
    panelType = _panelType;
    logger.debug(`Resizing panel ${panelType}`);

    document.body.style.cursor = panelType === "width" ? "col-resize" : "row-resize";
});

document.addEventListener("mousemove", (e) => {
    if (!draggingPanel) return;

    const data = getRelativePosition(e, leftPanel);
    let value = 0;
    if (panelType === "width")
        value = clamp(RESIZE_MIN, data.x, draggingPanel.parentElement.offsetWidth - RESIZE_MIN);
    else
        value = clamp(RESIZE_MIN, data.y, draggingPanel.parentElement.offsetHeight - RESIZE_MIN);

    const id = draggingPanel.parentElement.dataset.nya_split;
    const split = controller._splits.get(id);
    split.style.setProperty("--size", `${value}px`);
    logger.debug(`Resizing to ${value}`);
});

document.addEventListener("mouseup", (e) => {
    if (draggingPanel)
        logger.debug("Resizing finished");
    draggingPanel = null;
    document.body.style.cursor = "";
});