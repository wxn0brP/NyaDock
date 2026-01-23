import { DRAG } from "../const";
import logger from "../logger";
import { controller } from "../state";
import { saveNyaState } from "../storage";
import { Direction } from "../types";
import { detectDockZone, getRelativePosition } from "../utils/detect";

function removePreviewClass(zone: Direction) {
    document.querySelectorAll(`.dock-${zone}`).forEach(dock => dock.classList.remove("dock-" + zone));
}

function removePreviewClasses() {
    removePreviewClass("left");
    removePreviewClass("right");
    removePreviewClass("top");
    removePreviewClass("bottom");
}

let draggingPanel: HTMLDivElement = null;

document.addEventListener("mousedown", (e) => {
    const target = e.target as HTMLDivElement;
    if (!target.classList.contains("panel")) {
        logger.debug("Mousedown event ignored: target is not a panel");
        return;
    }

    const data = getRelativePosition(e, target);
    if (data.x > DRAG || data.y > DRAG) {
        logger.debug("Mousedown event ignored: not in drag area");
        return;
    }

    draggingPanel = target;
    logger.info("Dragging panel started", draggingPanel);
    document.body.style.cursor = "move";
});

function locatePanel(e: MouseEvent, log = false) {
    if (!draggingPanel) {
        if (log) logger.debug("Mouse event ignored: no panel is being dragged");
        return;
    }

    const allPanels = [...controller._panels.values()].filter(p => p !== draggingPanel);
    if (log) logger.debug("All panels", allPanels);

    const elemUnder = document.elementFromPoint(e.clientX, e.clientY);

    if (!elemUnder) {
        if (log) logger.debug("Mouse event ignored: no element under cursor");
        return null;
    }

    const targetPanel = (elemUnder as HTMLElement).closest(".panel") as HTMLDivElement | null;
    if (!targetPanel) {
        if (log) logger.debug("Mouse event ignored: no target panel under cursor");
        return null;
    }
    if (log) logger.debug("Target panel", targetPanel);

    if (!allPanels.includes(targetPanel)) {
        if (log) logger.debug("Mouse event ignored: target panel is not a valid drop target");
        return null;
    }

    const zone = detectDockZone(e, targetPanel);
    if (log) logger.info(`Docking to ${zone}`);
    if (zone === "center") {
        if (log) logger.debug("Docking to center, no action taken");
        return null;
    }

    let sourceId = draggingPanel.dataset.nya_id;
    const targetId = targetPanel.dataset.nya_id;

    if (!sourceId)
        sourceId = draggingPanel.querySelector<HTMLDivElement>(".panel[data-nya_id]")?.dataset.nya_id;

    if (!sourceId || !targetId) {
        if (log) logger.error("Panel ID not found");
        if (log) logger.error("Source ID:", sourceId);
        if (log) logger.error("Target ID:", targetId);
        return null;
    }

    if (sourceId === targetId) {
        if (log) logger.debug("Mouse event ignored: source and target are the same");
        return null;
    }

    return { sourceId, targetId, zone, targetPanel, draggingPanel };
}

document.addEventListener("mouseup", (e) => {
    function end() {
        logger.info("Dragging finished");
        draggingPanel = null;
    }

    const result = locatePanel(e, true);
    document.body.style.cursor = "";
    if (!result) {
        end();
        return;
    }
    const { sourceId, targetId, zone } = result;

    controller.movePanel(sourceId, targetId, zone);
    controller._render();
    controller._setDefaultSize();
    saveNyaState();
    removePreviewClasses();

    end();
});

document.addEventListener("mousemove", (e) => {
    const result = locatePanel(e);
    if (!result) return;

    const { zone, targetPanel } = result;

    removePreviewClasses();

    targetPanel.querySelector(".panel-content").classList.add(`dock-${zone}`);
});