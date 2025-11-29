import { NyaSplit } from "../types";

export function convertToSplits(arr: any[]): NyaSplit {
    if (arr.length === 0) {
        throw new Error("Array structure must have at least one element");
    }

    let isColumnLayout = false;
    let actualArray = arr;

    if (arr.length === 3 && arr[2] === 1) {
        isColumnLayout = true;
        actualArray = arr.slice(0, 2) as any[];
    }

    if (actualArray.length === 1) {
        const element = actualArray[0];
        if (Array.isArray(element)) {
            const nestedSplit = convertToSplits(element);
            return {
                type: isColumnLayout ? "column" : "row",
                nodes: [nestedSplit, "empty"]
            };
        } else {
            return {
                type: isColumnLayout ? "column" : "row",
                nodes: [element as string, "empty"]
            };
        }
    } else if (actualArray.length === 2) {
        const [first, second] = actualArray;

        const firstElement = Array.isArray(first) ? convertToSplits(first) : first;
        const secondElement = Array.isArray(second) ? convertToSplits(second) : second;

        return {
            type: isColumnLayout ? "column" : "row",
            nodes: [firstElement, secondElement]
        };
    } else {
        const [first, ...rest] = actualArray;

        let restStructure = [rest[0]];
        for (let i = 1; i < rest.length; i++) {
            if (isColumnLayout) {
                restStructure = [restStructure, rest[i], 1];
            } else {
                restStructure = [restStructure, rest[i]];
            }
        }

        const firstElement = Array.isArray(first) ? convertToSplits(first) : first;
        const restElement = Array.isArray(restStructure) ? convertToSplits(restStructure) : restStructure;

        return {
            type: isColumnLayout ? "column" : "row",
            nodes: [firstElement, restElement]
        };
    }
}