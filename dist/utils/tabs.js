export function isStack(node) {
    return (typeof node === "object" &&
        node !== null &&
        node.type === "stack");
}
export function isStructStack(node) {
    return (typeof node === "object" &&
        node !== null &&
        Array.isArray(node.tabs));
}
export function toStack(struct) {
    return {
        type: "stack",
        tabs: [
            ...struct.tabs,
        ],
        active: struct.active ?? 0,
    };
}
export function activateTab(tree, panelId) {
    if (typeof tree === "string")
        return {
            tree,
            active: -1,
        };
    if (isStack(tree)) {
        const index = tree.tabs.indexOf(panelId);
        if (index === -1 || index === tree.active)
            return {
                tree,
                active: -1,
            };
        return {
            tree: {
                ...tree,
                active: index,
            },
            active: index,
        };
    }
    const first = activateTab(tree.nodes[0], panelId);
    if (first.active !== -1) {
        return {
            tree: {
                ...tree,
                nodes: [
                    first.tree,
                    tree.nodes[1],
                ],
            },
            active: first.active,
        };
    }
    const second = activateTab(tree.nodes[1], panelId);
    if (second.active !== -1) {
        return {
            tree: {
                ...tree,
                nodes: [
                    tree.nodes[0],
                    second.tree,
                ],
            },
            active: second.active,
        };
    }
    return {
        tree,
        active: -1,
    };
}
