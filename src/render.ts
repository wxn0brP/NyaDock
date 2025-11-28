import { NyaController, Split } from "./state";

export function render(controller: NyaController) {
    const tempElement = document.createElement("div");

    for (const panel of controller._panels.values()) {
        tempElement.appendChild(panel);
    }

    controller.master.innerHTML = "";

    const masterSplit = renderSplit(controller, controller._split);
    controller.master.appendChild(masterSplit);
}

function renderSplit(controller: NyaController, split: Split) {
    const div = document.createElement("div");
    div.classList.add("split");
    div.classList.add(split.type);

    for (const node of split.nodes) {
        if (typeof node === "string") {
            const panel = controller._panels.get(node);
            div.appendChild(panel);
        } else {
            const splitPanel = document.createElement("div");
            splitPanel.classList.add("panel");

            const splitContent = renderSplit(controller, node);
            splitPanel.appendChild(splitContent);

            div.appendChild(splitPanel);
        }
    }

    return div;
}