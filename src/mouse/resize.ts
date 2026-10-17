import { clamp } from "@wxn0brp/flanker-ui/utils";
import logger from "../logger";
import { controller } from "../state";
import { getRelativePosition } from "../utils/detect";
import { saveNyaState } from "../storage";

let divider: HTMLDivElement = null;
let leftPanel: HTMLDivElement = null;
let axis: "width" | "height" = "width";
let resizeStarted = false;
let resizePending = false;

function setSize(
	el: HTMLDivElement,
	axisValue: "width" | "height",
	value: number,
) {
	const split = el.parentElement;
	const total = axisValue === "width" ? split.offsetWidth : split.offsetHeight;
	const min = controller.settings.minSize;
	if (!total) return value;

	const clamped = clamp(min, value, total - min);
	split.style.setProperty("--size", `${clamped}px`);

	const now = Math.round((clamped / total) * 100);
	el.setAttribute("aria-valuenow", String(now));
	el.setAttribute("aria-valuemin", String(Math.round((min / total) * 100)));
	el.setAttribute(
		"aria-valuemax",
		String(100 - Math.round((min / total) * 100)),
	);

	return clamped;
}

document.addEventListener("mousedown", e => {
	const target = e.target as HTMLDivElement;
	if (!target.classList.contains("nya-resize")) return;

	const split = target.parentElement;
	divider = target;
	leftPanel = split.children[0] as HTMLDivElement;
	axis = split.classList.contains("column") ? "height" : "width";
	resizeStarted = false;

	document.body.style.cursor = axis === "width" ? "col-resize" : "row-resize";
	logger.debug(`Resizing panel ${axis}`);
});

document.addEventListener("mousemove", e => {
	if (!divider) return;

	resizeStarted = true;

	const data = getRelativePosition(e, leftPanel);
	const value = setSize(divider, axis, axis === "width" ? data.x : data.y);
	logger.debug(`Resizing to ${value}`);
});

document.addEventListener("mouseup", e => {
	if (divider) {
		logger.debug("Resizing finished");
		if (resizeStarted) controller._pushHistory();
	}

	divider = null;
	resizeStarted = false;
	document.body.style.cursor = "";
	saveNyaState();
});

document.addEventListener("dblclick", e => {
	const target = e.target as HTMLDivElement;
	if (!target.classList.contains("nya-resize")) return;

	const total = target.parentElement.classList.contains("column")
		? target.parentElement.offsetHeight
		: target.parentElement.offsetWidth;

	setSize(target, getAxis(target), total / 2);
	controller._pushHistory();
	saveNyaState();
});

document.addEventListener("keydown", e => {
	const target = e.target as HTMLDivElement;
	if (!target.classList.contains("nya-resize")) return;

	const axisValue = getAxis(target);
	const split = target.parentElement;
	const total = axisValue === "width" ? split.offsetWidth : split.offsetHeight;
	const first = split.children[0] as HTMLElement;
	const current =
		axisValue === "width" ? first.offsetWidth : first.offsetHeight;
	const step = Math.round(total * (e.shiftKey ? 0.1 : 0.02));

	const decrease = axisValue === "width" ? "ArrowLeft" : "ArrowUp";
	const increase = axisValue === "width" ? "ArrowRight" : "ArrowDown";

	let next: number;
	if (e.key === decrease) next = current - step;
	else if (e.key === increase) next = current + step;
	else if (e.key === "Enter" || e.key === "Home") next = total / 2;
	else return;

	e.preventDefault();

	const applied = setSize(target, axisValue, next);
	if (applied !== current) resizePending = true;
});

document.addEventListener("keyup", e => {
	if (!resizePending) return;
	resizePending = false;
	controller._pushHistory();
	saveNyaState();
});

function getAxis(el: HTMLDivElement) {
	return el.parentElement.classList.contains("column") ? "height" : "width";
}
