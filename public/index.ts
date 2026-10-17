import "@wxn0brp/flanker-ui/html";
import { column, controller, logger, row, tabs } from "../src";

logger.setLogLevel("DEBUG");
(window as any).logger = logger;
(window as any).controller = controller;

const app = qs("#app");

controller.master = app;
controller.setDefaultState(
    row(
        "panel1",
        column(
            "panel2",
            column(tabs([ "panel3", "panel5" ]), "panel4"),
        ),
    ),
);

const panels = document.querySelectorAll<HTMLDivElement>(".panel");
for (const panel of panels) {
    controller.registerPanel(panel.id, panel);
}

controller.init();
