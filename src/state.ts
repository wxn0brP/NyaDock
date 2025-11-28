import { render } from "./render";
import { Direction } from "./utils";

export type Node = string;
export type SplitType = "row" | "column";

export interface Split {
    nodes: [Node | Split, Node | Split];
    type: SplitType;
}

export class NyaController {
    _split: Split;
    _panels = new Map<string, HTMLDivElement>();
    _splits = new Map<string, HTMLDivElement>();
    master: HTMLDivElement;

    loadState(state: Split) {
        this._split = state;
    }

    getDefaultState(): Split {
        return {
            nodes: [] as any,
            type: "row",
        }
    }

    registerPanel(id: string, panel: HTMLDivElement) {
        panel.dataset.nya_id = id;
        panel.classList.add("panel");
        panel.classList.add("base");
        this._panels.set(id, panel);
    }

    render() {
        this._splits.clear();
        render(this);
    }

    setDefaultSize() {
        this.master.querySelectorAll<HTMLDivElement>(".split").forEach(split => split.style.setProperty("--size", "50%"));
    }

    public movePanel(sourceId: string, targetId: string, zone: Direction) {
        if (!this._split || sourceId === targetId) {
            return;
        }

        if ((this._split.nodes as any).length === 0) {
            this._split = {
                nodes: [sourceId, targetId],
                type: (zone === "left" || zone === "right") ? "row" : "column",
            };
            return;
        }

        function recursiveRemove(node: Node | Split): Node | Split | null {
            if (typeof node === "string") {
                return node === sourceId ? null : node;
            }
            const [nodeA, nodeB] = node.nodes;
            const newA = recursiveRemove(nodeA);
            const newB = recursiveRemove(nodeB);
            if (newA && newB) {
                if (newA !== nodeA || newB !== nodeB) {
                    return { ...node, nodes: [newA, newB] };
                }
                return node;
            }
            return newA || newB;
        }

        const treeAfterRemove = recursiveRemove(this._split);

        const newSplitNode: Split = {
            type: (zone === "left" || zone === "right") ? "row" : "column",
            nodes: (zone === "left" || zone === "top") ? [sourceId, targetId] : [targetId, sourceId],
        };

        function recursiveDock(node: Node | Split): Node | Split {
            if (typeof node === "string") {
                return node === targetId ? newSplitNode : node;
            }

            const [nodeA, nodeB] = node.nodes;

            if (typeof nodeA === "string" && nodeA === targetId) {
                return { ...node, nodes: [newSplitNode, nodeB] };
            }
            if (typeof nodeB === "string" && nodeB === targetId) {
                return { ...node, nodes: [nodeA, newSplitNode] };
            }

            const newA = recursiveDock(nodeA);
            const newB = recursiveDock(nodeB);

            if (newA !== nodeA || newB !== nodeB) {
                return { ...node, nodes: [newA, newB] };
            }
            return node;
        }

        let finalTree: Node | Split;
        if (!treeAfterRemove) {
            finalTree = newSplitNode;
        } else {
            finalTree = recursiveDock(treeAfterRemove);
        }

        this._split = finalTree as Split;
    }
}

export const controller = new NyaController();