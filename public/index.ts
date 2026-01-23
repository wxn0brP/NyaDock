import "@wxn0brp/flanker-ui/html";
import { controller, logger } from "../src";

logger.setLogLevel("DEBUG");
(window as any).logger = logger;
(window as any).controller = controller;

const app = qs("#app");

controller.master = app;
controller.setDefaultState([
    "panel1",
    [
        "panel2",
        [
            ["panel3", "panel5", 1],
            "panel4",
        ],
        1
    ]
]);

const panels = document.querySelectorAll<HTMLDivElement>(".panel");
for (const panel of panels) {
    controller.registerPanel(panel.id, panel);
}

controller.init();