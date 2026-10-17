import { NyaController } from "./state";
import { NyaNode, NyaSplit, NyaStack } from "./types";
import { isStack } from "./utils/tabs";

export function render(controller: NyaController) {
	const tempElement = document.createElement("div");

	for (const panel of controller._panels.values()) {
		tempElement.appendChild(panel);
	}

	controller.master.innerHTML = "";

	const root = controller._split;
	controller.master.appendChild(
		isStack(root)
			? renderStack(controller, root, "0")
			: renderSplit(controller, root, "0"),
	);
}

function renderSplit(controller: NyaController, split: NyaSplit, prefix = "0") {
	const div = document.createElement("div");
	div.classList.add("split");
	div.classList.add(split.type);
	div.dataset.nya_split = prefix;
	controller._splits.set(prefix, div);

	const [first, second] = split.nodes;
	div.appendChild(renderNode(controller, first, `${prefix}.0`));
	div.appendChild(renderSeparator(split));
	div.appendChild(renderNode(controller, second, `${prefix}.1`));

	return div;
}

function renderNode(
	controller: NyaController,
	node: NyaNode | NyaSplit | NyaStack,
	prefix: string,
) {
	if (typeof node === "string") {
		const panel = controller._panels.get(node);
		if (panel) panel.style.display = "";
		return panel;
	}
	if (isStack(node)) return renderStack(controller, node, prefix);

	const splitPanel = document.createElement("div");
	splitPanel.classList.add("panel");
	splitPanel.appendChild(renderSplit(controller, node, prefix));
	return splitPanel;
}

function renderStack(
	controller: NyaController,
	stack: NyaStack,
	prefix: string,
) {
	const div = document.createElement("div");
	div.classList.add("nya-stack");
	div.dataset.nya_stack = prefix;

	const tabs = document.createElement("div");
	tabs.classList.add("nya-stack-tabs");

	const body = document.createElement("div");
	body.classList.add("nya-stack-body");

	stack.tabs.forEach((id, index) => {
		const panel = controller._panels.get(id);
		if (!panel) return;

		const button = document.createElement("button");
		button.type = "button";
		button.classList.add("nya-tab");
		if (index === stack.active) button.classList.add("active");
		button.textContent = panelTitle(panel, id);
		button.dataset.nya_tab = id;
		button.addEventListener("click", () => controller.selectTab(id));
		tabs.appendChild(button);

		panel.style.display = index === stack.active ? "" : "none";
		body.appendChild(panel);
	});

	div.appendChild(tabs);
	div.appendChild(body);

	return div;
}

function panelTitle(panel: HTMLDivElement, fallback: string) {
	const header = panel.querySelector(".panel-header");
	return header?.textContent?.trim() || fallback;
}

function renderSeparator(split: NyaSplit) {
	const divider = document.createElement("div");
	divider.classList.add("nya-resize");
	divider.setAttribute("role", "separator");
	divider.setAttribute(
		"aria-orientation",
		split.type === "row" ? "vertical" : "horizontal",
	);
	divider.setAttribute("aria-valuemin", "0");
	divider.setAttribute("aria-valuemax", "100");
	divider.setAttribute("aria-valuenow", "50");
	divider.tabIndex = 0;
	return divider;
}
