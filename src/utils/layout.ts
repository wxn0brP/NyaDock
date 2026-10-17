import { NyaSplit, NyaStack, SplitType } from "../types";

export type LayoutChild = string | NyaSplit | NyaStack;

function fold(type: SplitType, nodes: LayoutChild[]): NyaSplit {
	if (nodes.length < 2)
		throw new Error(`nya-dock: ${type} needs at least two children`);

	if (nodes.length === 2)
		return {
			type,
			nodes: [
				nodes[0],
				nodes[1],
			],
		};
	return {
		type,
		nodes: [
			nodes[0],
			fold(type, nodes.slice(1)),
		],
	};
}

export function row(...nodes: LayoutChild[]) {
	return fold("row", nodes);
}

export function column(...nodes: LayoutChild[]) {
	return fold("column", nodes);
}

export function tabs(ids: string[], active?: number): NyaStack;
export function tabs(...ids: string[]): NyaStack;
export function tabs(...args: any[]): NyaStack {
	let ids: string[];
	let active: number;

	if (Array.isArray(args[0])) {
		ids = args[0];
		active = args[1] ?? 0;
	} else {
		ids = args;
		active = 0;
	}

	if (ids.length === 0) throw new Error("nya-dock: tabs needs at least one id");

	return {
		type: "stack",
		tabs: [
			...ids,
		],
		active,
	};
}
