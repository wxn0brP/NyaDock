import { DRAG } from "../const";
import { controller } from "../state";
import logger from "../logger";
import { detectDockZone, getRelativePosition } from "../utils/detect";

let draggingPanel: HTMLDivElement = null;

document.addEventListener("mousedown", (e) => {
    logger.debug("mousedown event triggered");
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

document.addEventListener("mouseup", (e) => {
    logger.debug("mouseup event triggered");
    if (!draggingPanel) {
        logger.debug("Mouseup event ignored: no panel is being dragged");
        return;
    }

    document.body.style.cursor = "";

    function end() {
        logger.info("Dragging finished");
        draggingPanel = null;
    }

    const allPanels = [...controller._panels.values()].filter(p => p !== draggingPanel);
    logger.debug("All panels", allPanels);

    const elemUnder = document.elementFromPoint(e.clientX, e.clientY);

    if (!elemUnder) {
        logger.debug("Mouseup event ignored: no element under cursor");
        return end();
    }

    const targetPanel = (elemUnder as HTMLElement).closest(".panel") as HTMLDivElement | null;
    if (!targetPanel) {
        logger.debug("Mouseup event ignored: no target panel under cursor");
        return end();
    }
    logger.debug("Target panel", targetPanel);

    if (!allPanels.includes(targetPanel)) {
        logger.debug("Mouseup event ignored: target panel is not a valid drop target");
        return end();
    }

    const zone = detectDockZone(e, targetPanel);
    logger.info(`Docking to ${zone}`);
    if (zone === "center") {
        logger.debug("Docking to center, no action taken");
        return end();
    }

    let sourceId = draggingPanel.dataset.nya_id;
    const targetId = targetPanel.dataset.nya_id;

    if (!sourceId)
        sourceId = draggingPanel.qs(".panel")?.dataset.nya_id;

    if (!sourceId || !targetId) {
        logger.error("Panel ID not found");
        logger.error("Source ID:", sourceId);
        logger.error("Target ID:", targetId);
        return end();
    }

    if (sourceId === targetId) {
        logger.debug("Mouseup event ignored: source and target are the same");
        return end();
    }

    controller.movePanel(sourceId, targetId, zone);
    controller.render();
    controller.setDefaultSize();

    end();
});