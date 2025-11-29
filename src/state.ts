import { render } from "./render";
import { Direction, NyaSplit } from "./types";
import { movePanel } from "./utils/movePanel";

export class NyaController {
    _split: NyaSplit;
    _panels = new Map<string, HTMLDivElement>();
    _splits = new Map<string, HTMLDivElement>();
    master: HTMLDivElement;

    loadState(state: NyaSplit) {
        this._split = state;
    }

    getDefaultState(): NyaSplit {
        return {
            nodes: [] as any,
            type: "row",
        }
    }

    registerPanel(id: string, panel: HTMLDivElement) {
        panel.dataset.nya_id = id;
        panel.classList.add("panel");
        this._panels.set(id, panel);
    }

    render() {
        this._splits.clear();
        return render(this);
    }

    setDefaultSize() {
        this.master.querySelectorAll<HTMLDivElement>(".split").forEach(split => split.style.setProperty("--size", "50%"));
    }

    movePanel(sourceId: string, targetId: string, zone: Direction) {
        return movePanel(this, sourceId, targetId, zone);
    }
}

export const controller = new NyaController();