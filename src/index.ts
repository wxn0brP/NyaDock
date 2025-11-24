import "@wxn0brp/flanker-ui/html";
import { createPanel, panel2Split } from "./createPanel";
import "./mouse";
import { updateSize } from "./update";

const app = qs("#app");

const panel1 = createPanel();
panel1.innerHTML = "panel1";
app.appendChild(panel1);

const panel2 = createPanel();
panel2.innerHTML = "panel2";
app.appendChild(panel2);

updateSize(app, "50%");

const panel3 = createPanel();
panel3.innerHTML = "panel3";

updateSize(panel2Split(panel2, panel3, "column"), "50%");