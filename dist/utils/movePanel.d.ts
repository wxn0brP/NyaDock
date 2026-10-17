import { NyaController } from "../state.js";
import { Direction } from "../types.js";
type Zone = Direction | "center";
export declare function movePanel(controller: NyaController, sourceId: string, targetId: string, zone: Zone): void;
export {};
