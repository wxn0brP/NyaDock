import { DRAG } from "../const.js";
import { controller } from "../state.js";
import logger from "../logger.js";
import { detectDockZone, getRelativePosition } from "../utils/detect.js";
import { saveNyaState } from "../storage.js";
let draggingPanel = null;
document.addEventListener("mousedown", (e) => {
    const target = e.target;
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
    const targetPanel = elemUnder.closest(".panel");
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
        sourceId = draggingPanel.qs(".panel[data-nya_id]")?.dataset.nya_id;
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
    controller._render();
    controller._setDefaultSize();
    saveNyaState();
    end();
});
