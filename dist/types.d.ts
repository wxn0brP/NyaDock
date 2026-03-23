export type Direction = "left" | "right" | "top" | "bottom";
export type NyaNode = string;
export type SplitType = "row" | "column";
export interface NyaSplit {
    nodes: [NyaNode | NyaSplit, NyaNode | NyaSplit];
    type: SplitType;
}
export type StructNode = [string | StructNode, string | StructNode, 1?];
