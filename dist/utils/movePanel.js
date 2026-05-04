export function movePanel(controller, sourceId, targetId, zone) {
    if (!controller._split || sourceId === targetId)
        return;
    if (controller._split.nodes.length === 0) {
        controller._split = {
            nodes: [sourceId, targetId],
            type: (zone === "left" || zone === "right") ? "row" : "column",
        };
        return;
    }
    function recursiveRemove(node) {
        if (typeof node === "string") {
            return node === sourceId ? null : node;
        }
        const [nodeA, nodeB] = node.nodes;
        const newA = recursiveRemove(nodeA);
        const newB = recursiveRemove(nodeB);
        if (newA && newB) {
            if (newA !== nodeA || newB !== nodeB) {
                return { ...node, nodes: [newA, newB] };
            }
            return node;
        }
        return newA || newB;
    }
    const treeAfterRemove = recursiveRemove(controller._split);
    const newSplitNode = {
        type: (zone === "left" || zone === "right") ? "row" : "column",
        nodes: (zone === "left" || zone === "top") ? [sourceId, targetId] : [targetId, sourceId],
    };
    function recursiveDock(node) {
        if (typeof node === "string") {
            return node === targetId ? newSplitNode : node;
        }
        const [nodeA, nodeB] = node.nodes;
        if (typeof nodeA === "string" && nodeA === targetId) {
            return { ...node, nodes: [newSplitNode, nodeB] };
        }
        if (typeof nodeB === "string" && nodeB === targetId) {
            return { ...node, nodes: [nodeA, newSplitNode] };
        }
        const newA = recursiveDock(nodeA);
        const newB = recursiveDock(nodeB);
        if (newA !== nodeA || newB !== nodeB) {
            return { ...node, nodes: [newA, newB] };
        }
        return node;
    }
    let finalTree;
    if (!treeAfterRemove) {
        finalTree = newSplitNode;
    }
    else {
        finalTree = recursiveDock(treeAfterRemove);
    }
    controller._split = finalTree;
}
