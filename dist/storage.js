import { throttle } from "@wxn0brp/flanker-ui/utils";
import { controller } from "./state.js";
import logger from "./logger.js";
export function saveState(controller) {
    const state = controller._split;
    const sizes = {};
    controller._splits.forEach((split, key) => {
        sizes[key] = split.style.getPropertyValue("--size");
    });
    localStorage.setItem(controller.settings.key, JSON.stringify({ state, sizes }));
}
export function defaultState(controller) {
    controller._split = Object.assign({}, controller._struct);
    controller._render();
    controller._setDefaultSize();
    saveState(controller);
}
export function loadState(controller) {
    const stateString = localStorage.getItem(controller.settings.key);
    if (!stateString)
        return defaultState(controller);
    const { state, sizes } = JSON.parse(stateString);
    controller._split = state;
    controller._render();
    controller._splits.forEach((split, key) => {
        split.style.setProperty("--size", sizes[key]);
    });
}
export const saveNyaState = throttle(() => {
    logger.debug("Saving state");
    saveState(controller);
}, 3000);
