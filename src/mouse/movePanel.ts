import { DRAG } from "../const";
import { detectDockZone, getRelativePosition, swapPanels, updateSize, updateStaticPanelSize } from "../utils";

let draggingPanel: HTMLDivElement = null;

document.addEventListener("mousedown", (e) => {
    const target = e.target as HTMLDivElement;
    if (!target.classList.contains("panel")) return;

    const data = getRelativePosition(e, target);
    if (data.x > DRAG || data.y > DRAG) return;

    draggingPanel = target;
    document.body.style.cursor = "move";
});

document.addEventListener("mouseup", (e) => {
    if (!draggingPanel) return;
    document.body.style.cursor = "";

    function end() {
        draggingPanel = null;
    }

    const master = draggingPanel.closest(".master") as HTMLDivElement;
    const allPanels = [...master.querySelectorAll(".panel")].filter(
        p => p !== draggingPanel
    );

    const elemUnder = document.elementFromPoint(e.clientX, e.clientY);

    if (!elemUnder) return end();

    const targetPanel = (elemUnder as HTMLElement).closest(".panel") as HTMLDivElement | null;
    if (!targetPanel) return end();

    if (!allPanels.includes(targetPanel)) return end();

    /**
     * <div id="app" class="master split row">
     *      <div class="panel base" style="width: 50%;">panel1</div>            targetPanel
     *      <div class="panel">
     *          <div class="split column">
     *              <div class="panel base" style="height: 50%;">panel2</div>   siblingPanel
     *              <div class="panel base">panel3</div>                        draggingPanel
     *          </div>
     *      </div>
     *  </div>
     */

    const zone = detectDockZone(e, targetPanel);
    if (zone === "center") return end();

    if (draggingPanel.parentElement.classList.contains("master")) {
        const typeRow = draggingPanel.parentElement.classList.contains("row");
        draggingPanel.parentElement.classList.toggle("row", !typeRow);
        draggingPanel.parentElement.classList.toggle("column", typeRow);

        const siblingPanel = [...targetPanel.parentElement!.children].find(el => el !== targetPanel) as HTMLDivElement;
        siblingPanel.style.width = "";
        siblingPanel.style.height = "";

        const draggingChildrenIndex = [...draggingPanel.parentElement.children].indexOf(draggingPanel);

        draggingPanel.parentElement.appendChild(siblingPanel);
        targetPanel.parentElement.appendChild(draggingPanel);

        if (draggingChildrenIndex === 0)
            swapPanels(siblingPanel.parentElement);

        updateSize(siblingPanel.parentElement);

        const newSplitContainer = draggingPanel.parentElement;

        const columnType = zone === "left" || zone === "right";
        newSplitContainer.classList.toggle("column", !columnType);
        newSplitContainer.classList.toggle("row", columnType);

        if (zone === "left" || zone === "top")
            swapPanels(newSplitContainer);

        updateSize(draggingPanel.parentElement);

        return end();
    }

    const siblingPanel = [...draggingPanel.parentElement!.children].find(el => el !== draggingPanel) as HTMLDivElement;
    siblingPanel.style.width = "";
    siblingPanel.style.height = "";

    targetPanel.parentElement.dataset.id = "ny-id-target";
    targetPanel.parentElement.replaceChild(draggingPanel.parentElement.parentElement, targetPanel);

    const nyID = qs("ny-id-target", 1);
    nyID.appendChild(siblingPanel);
    nyID.dataset.id = "";

    draggingPanel.parentElement.appendChild(targetPanel);

    /**
     * <div id="app" class="master split row">
     *      <div class="panel" style="width: 50%;">
     *          <div class="split row">
     *              <div class="panel base" style="width: 50%;">panel3</div>    draggingPanel
     *              <div class="panel base">panel1</div>                        targetPanel
     *          </div>
     *      </div>
     *      <div class="panel base">panel2</div>                                siblingPanel
     *  </div>
     */

    targetPanel.style.width = "";
    targetPanel.style.height = "";

    const newSplitContainer = draggingPanel.parentElement;
    if (!newSplitContainer) return end();

    const columnType = zone === "left" || zone === "right";
    newSplitContainer.classList.toggle("column", !columnType);
    newSplitContainer.classList.toggle("row", columnType);
    updateSize(draggingPanel.parentElement);

    if (zone === "right" || zone === "bottom")
        swapPanels(newSplitContainer);

    const newSplitPanel = newSplitContainer.parentElement;
    if (!newSplitPanel) return end();

    updateStaticPanelSize(newSplitPanel);

    end();
});