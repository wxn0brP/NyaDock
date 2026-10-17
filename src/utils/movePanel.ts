import { NyaController } from "../state";
import { Direction, NyaNode, NyaSplit, NyaStack } from "../types";
import { isStack } from "./tabs";

type Zone = Direction | "center";

function removeNode(
	node: NyaNode | NyaSplit | NyaStack,
	id: string,
): NyaNode | NyaSplit | NyaStack | null {
	if (typeof node === "string") return node === id ? null : node;

	if (isStack(node)) {
		if (!node.tabs.includes(id)) return node;
		const tabs = node.tabs.filter(tab => tab !== id);
		if (tabs.length === 0) return null;
		if (tabs.length === 1) return tabs[0];
		return {
			...node,
			tabs,
			active: Math.min(node.active, tabs.length - 1),
		};
	}

	const first = removeNode(node.nodes[0], id);
	const second = removeNode(node.nodes[1], id);
	if (!first) return second;
	if (!second) return first;
	if (first !== node.nodes[0] || second !== node.nodes[1])
		return {
			...node,
			nodes: [
				first,
				second,
			],
		};
	return node;
}

function insertTab(
	node: NyaNode | NyaSplit | NyaStack,
	targetId: string,
	id: string,
): NyaNode | NyaSplit | NyaStack {
	if (typeof node === "string") {
		if (node !== targetId) return node;
		return {
			type: "stack",
			tabs: [
				node,
				id,
			],
			active: 1,
		};
	}

	if (isStack(node)) {
		if (!node.tabs.includes(targetId)) return node;
		if (node.tabs.includes(id))
			return {
				...node,
				active: node.tabs.indexOf(id),
			};
		const tabs = [
			...node.tabs,
			id,
		];
		return {
			...node,
			tabs,
			active: tabs.length - 1,
		};
	}

	const first = insertTab(node.nodes[0], targetId, id);
	const second = insertTab(node.nodes[1], targetId, id);
	if (first !== node.nodes[0] || second !== node.nodes[1])
		return {
			...node,
			nodes: [
				first,
				second,
			],
		};
	return node;
}

function buildSplit(
	sourceId: string,
	target: NyaNode | NyaSplit | NyaStack,
	zone: Direction,
): NyaSplit {
	return {
		type: zone === "left" || zone === "right" ? "row" : "column",
		nodes:
			zone === "left" || zone === "top"
				? [
						sourceId,
						target,
					]
				: [
						target,
						sourceId,
					],
	};
}

function dockAround(
	node: NyaNode | NyaSplit | NyaStack,
	targetId: string,
	sourceId: string,
	zone: Direction,
): NyaNode | NyaSplit | NyaStack {
	if (typeof node === "string") {
		if (node !== targetId) return node;
		return buildSplit(sourceId, node, zone);
	}

	if (isStack(node)) {
		if (!node.tabs.includes(targetId)) return node;
		return buildSplit(sourceId, node, zone);
	}

	const first = dockAround(node.nodes[0], targetId, sourceId, zone);
	const second = dockAround(node.nodes[1], targetId, sourceId, zone);
	if (first !== node.nodes[0] || second !== node.nodes[1])
		return {
			...node,
			nodes: [
				first,
				second,
			],
		};
	return node;
}

function isSameStack(
	node: NyaNode | NyaSplit | NyaStack,
	sourceId: string,
	targetId: string,
): boolean {
	if (isStack(node))
		return node.tabs.includes(sourceId) && node.tabs.includes(targetId);
	if (typeof node === "string") return false;
	return (
		isSameStack(node.nodes[0], sourceId, targetId) ||
		isSameStack(node.nodes[1], sourceId, targetId)
	);
}

function reorderTab(
	node: NyaNode | NyaSplit | NyaStack,
	sourceId: string,
	targetId: string,
): NyaNode | NyaSplit | NyaStack {
	if (typeof node === "string") return node;

	if (isStack(node)) {
		if (!node.tabs.includes(sourceId) || !node.tabs.includes(targetId))
			return node;

		const tabs = node.tabs.filter(tab => tab !== sourceId);
		tabs.splice(tabs.indexOf(targetId), 0, sourceId);
		if (tabs.join() === node.tabs.join()) return node;

		return {
			...node,
			tabs,
			active: tabs.indexOf(sourceId),
		};
	}

	const first = reorderTab(node.nodes[0], sourceId, targetId);
	const second = reorderTab(node.nodes[1], sourceId, targetId);
	if (first !== node.nodes[0] || second !== node.nodes[1])
		return {
			...node,
			nodes: [
				first,
				second,
			],
		};
	return node;
}

export function movePanel(
	controller: NyaController,
	sourceId: string,
	targetId: string,
	zone: Zone,
) {
	if (!controller._split || sourceId === targetId) return;

	if (zone === "center" && isSameStack(controller._split, sourceId, targetId)) {
		const reordered = reorderTab(controller._split, sourceId, targetId);
		if (reordered !== controller._split)
			controller._split = reordered as NyaSplit | NyaStack;
		return;
	}

	const withoutSource = removeNode(controller._split, sourceId);
	if (!withoutSource) return;

	const tree =
		zone === "center"
			? insertTab(withoutSource, targetId, sourceId)
			: dockAround(withoutSource, targetId, sourceId, zone);

	if (typeof tree === "string") return;
	controller._split = tree;
}
