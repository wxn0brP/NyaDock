import "@wxn0brp/flanker-ui/html";
import logger from "./logger.js";
import "./mouse/index.js";
import { controller } from "./state.js";
logger.setLogLevel("DEBUG");
window.logger = logger;
window.controller = controller;
const app = qs("#app");
const panel1 = document.createElement("div");
panel1.innerHTML = `
    <div class="panel-header">Panel 1</div>
    <div class="panel-content">
        <h3>Welcome to Panel 1</h3>
        <p>This is the first panel in the layout.</p>
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
        <div class="button-group">
            <button onclick="controller.reset()">Reset Config</button>
        </div>
    </div>
`;
const panel2 = document.createElement("div");
panel2.innerHTML = `
    <div class="panel-header">Panel 2</div>
    <div class="panel-content">
        <h3>Content for Panel 2</h3>
        <p>This is the second panel, split from the main container.</p>
        <div class="button-group">
            <button>Button 1</button>
            <button>Button 2</button>
        </div>
    </div>
`;
const panel3 = document.createElement("div");
panel3.innerHTML = `
    <div class="panel-header">Panel 3</div>
    <div class="panel-content">
        <h3>Additional Panel</h3>
        <p>This is the third panel in the layout.</p>
        <div class="info-box">
            <p>This panel was created by splitting with Panel 2.</p>
        </div>
    </div>
`;
const panel4 = document.createElement("div");
panel4.innerHTML = `
    <div class="panel-header">Panel 4</div>
    <div class="panel-content">
        <h3>Form Panel</h3>
        <form>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name"><br><br>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email"><br><br>
            <input type="submit" value="Submit">
        </form>
    </div>
`;
const panel5 = document.createElement("div");
panel5.innerHTML = `
    <div class="panel-header">Panel 5</div>
    <div class="panel-content">
        <h3>Table Panel</h3>
        <table border="1">
            <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Age</th>
            </tr>
            <tr>
                <td>Jill</td>
                <td>Smith</td>
                <td>50</td>
            </tr>
            <tr>
                <td>Eve</td>
                <td>Jackson</td>
                <td>94</td>
            </tr>
        </table>
    </div>
`;
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
controller.registerPanel("panel1", panel1);
controller.registerPanel("panel2", panel2);
controller.registerPanel("panel3", panel3);
controller.registerPanel("panel4", panel4);
controller.registerPanel("panel5", panel5);
controller.init();
