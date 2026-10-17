import { NyaNode, NyaSplit, NyaStack, StructStack } from "../types.js";
export declare function isStack(node: unknown): node is NyaStack;
export declare function isStructStack(node: unknown): node is StructStack;
export declare function toStack(struct: StructStack): NyaStack;
export declare function activateTab(tree: NyaNode | NyaSplit | NyaStack, panelId: string): {
    tree: NyaNode | NyaSplit | NyaStack;
    active: number;
};
