import { NyaSplit, NyaStack } from "../types.js";
export type LayoutChild = string | NyaSplit | NyaStack;
export declare function row(...nodes: LayoutChild[]): NyaSplit;
export declare function column(...nodes: LayoutChild[]): NyaSplit;
export declare function tabs(ids: string[], active?: number): NyaStack;
export declare function tabs(...ids: string[]): NyaStack;
