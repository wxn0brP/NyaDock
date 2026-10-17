import logger from "./logger.js";
import "./mouse/index.js";
import { controller } from "./state.js";
export { controller, logger };
export { row, column, tabs } from "./utils/layout.js";
export declare const undo: () => boolean;
export declare const redo: () => boolean;
export declare const canUndo: () => boolean;
export declare const canRedo: () => boolean;
