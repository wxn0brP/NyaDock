import { render } from "./render";

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
}

export const controller = new NyaController();