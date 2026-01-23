export function render(controller) {
    const tempElement = document.createElement("div");
    for (const panel of controller._panels.values()) {
        tempElement.appendChild(panel);
    }
    controller.master.innerHTML = "";
    const masterSplit = renderSplit(controller, controller._split);
    controller.master.appendChild(masterSplit);
}
function renderSplit(controller, split, prefix = "0") {
    const div = document.createElement("div");
    div.classList.add("split");
    div.classList.add(split.type);
    div.dataset.nya_split = prefix;
    controller._splits.set(prefix, div);
    for (let i = 0; i < split.nodes.length; i++) {
        const node = split.nodes[i];
        if (typeof node === "string") {
            const panel = controller._panels.get(node);
            div.appendChild(panel);
        }
        else {
            const splitPanel = document.createElement("div");
            splitPanel.classList.add("panel");
            const splitContent = renderSplit(controller, node, `${prefix}.${i}`);
            splitPanel.appendChild(splitContent);
            div.appendChild(splitPanel);
        }
    }
    return div;
}
