function fold(type, nodes) {
    if (nodes.length < 2)
        throw new Error(`nya-dock: ${type} needs at least two children`);
    if (nodes.length === 2)
        return {
            type,
            nodes: [
                nodes[0],
                nodes[1],
            ],
        };
    return {
        type,
        nodes: [
            nodes[0],
            fold(type, nodes.slice(1)),
        ],
    };
}
export function row(...nodes) {
    return fold("row", nodes);
}
export function column(...nodes) {
    return fold("column", nodes);
}
export function tabs(...args) {
    let ids;
    let active;
    if (Array.isArray(args[0])) {
        ids = args[0];
        active = args[1] ?? 0;
    }
    else {
        ids = args;
        active = 0;
    }
    if (ids.length === 0)
        throw new Error("nya-dock: tabs needs at least one id");
    return {
        type: "stack",
        tabs: [
            ...ids,
        ],
        active,
    };
}
