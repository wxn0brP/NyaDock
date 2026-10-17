export type Direction = "left" | "right" | "top" | "bottom";

export type NyaNode = string;
export type SplitType = "row" | "column";

export interface NyaStack {
	type: "stack";
	tabs: string[];
	active: number;
}

export interface NyaSplit {
	nodes: [
		NyaNode | NyaSplit | NyaStack,
		NyaNode | NyaSplit | NyaStack,
	];
	type: SplitType;
}

export type StructNode = [
	string | StructNode | StructStack,
	string | StructNode | StructStack,
	1?,
];

export type StructStack = {
	tabs: string[];
	active?: number;
};
