import { isStructStack, toStack } from "./tabs.js";
function convertNode(node) {
    if (Array.isArray(node))
        return convertToSplits(node);
    if (isStructStack(node))
        return toStack(node);
    return node;
}
export function convertToSplits(arr) {
    if (arr.length === 0) {
        throw new Error("Array structure must have at least one element");
    }
    let isColumnLayout = false;
    let actualArray = arr;
    if (arr.length === 3 && arr[2] === 1) {
        isColumnLayout = true;
        actualArray = arr.slice(0, 2);
    }
    if (actualArray.length === 1) {
        return {
            type: isColumnLayout ? "column" : "row",
            nodes: [
                convertNode(actualArray[0]),
                "empty",
            ],
        };
    }
    else if (actualArray.length === 2) {
        const [first, second] = actualArray;
        return {
            type: isColumnLayout ? "column" : "row",
            nodes: [
                convertNode(first),
                convertNode(second),
            ],
        };
    }
    else {
        const [first, ...rest] = actualArray;
        let restStructure = [
            rest[0],
        ];
        for (let i = 1; i < rest.length; i++) {
            if (isColumnLayout) {
                restStructure = [
                    restStructure,
                    rest[i],
                    1,
                ];
            }
            else {
                restStructure = [
                    restStructure,
                    rest[i],
                ];
            }
        }
        return {
            type: isColumnLayout ? "column" : "row",
            nodes: [
                convertNode(first),
                convertNode(restStructure),
            ],
        };
    }
}
