import { DRAG } from "../const";
import { getRelativePosition } from "../update";

export function movePanel() {
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

        const master = draggingPanel.closest(".master") as HTMLDivElement;
        const allPanels = [...master.querySelectorAll(".panel")].filter(
            p => p !== draggingPanel
        );

        const elemUnder = document.elementFromPoint(e.clientX, e.clientY);

        if (!elemUnder) {
            draggingPanel = null;
            return;
        }

        const targetPanel = (elemUnder as HTMLElement).closest(".panel") as HTMLDivElement | null;

        if (!targetPanel) {
            draggingPanel = null;
            return;
        }

        if (!allPanels.includes(targetPanel)) {
            draggingPanel = null;
            return;
        }

        /**
         * <div id="app" class="master split row">
         *      <div class="panel base" style="width: 50%;">panel1</div>     targetPanel
         *      <div class="panel">
         *          <div class="split column">
         *              <div class="panel base" style="height: 50%;">panel2</div>
         *              <div class="panel base">panel3</div>     draggingPanel
         *          </div>
         *      </div>
         *  </div>
         */

        targetPanel.parentElement.dataset.id = "ny-id";

        const siblingPanel = [...draggingPanel.parentElement!.children].find(el => el !== draggingPanel) as HTMLDivElement;
        targetPanel.parentElement.replaceChild(draggingPanel.parentElement.parentElement, targetPanel);

        const nyID = qs("ny-id", 1);
        nyID.appendChild(siblingPanel);
        delete nyID.dataset.id;

        draggingPanel.parentElement.appendChild(targetPanel);


        /**
         * <div id="app" class="master split row">
         *      <div class="panel" style="width: 50%;">
         *          <div class="split row">
         *              <div class="panel base" style="width: 50%;">panel3</div>  draggingPanel
         *              <div class="panel base">panel1</div>         targetPanel
         *          </div>
         *      </div>
         *      <div class="panel base">panel2</div>
         *  </div>
         */

        siblingPanel.style.width = "";
        siblingPanel.style.height = "";
        draggingPanel.style.width = "50%";
        draggingPanel.style.height = "";
        targetPanel.style.width = "";
        targetPanel.style.height = "";

        draggingPanel.parentElement.classList.remove("column");
        draggingPanel.parentElement.classList.remove("row");

        draggingPanel.parentElement.parentElement.style.width = "50%";
        draggingPanel.parentElement.parentElement.style.height = "";

        draggingPanel = null;
    });
}