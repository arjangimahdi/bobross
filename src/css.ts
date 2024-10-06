import { TriangleValues } from "./types";

let styles: CSSStyleDeclaration;
const vendorPrefixes = ["webkit", "moz", "ms"];
const prefixHistory: { [key: string]: string } = {};

function createStyle() {
    if (styles) return styles;

    return (styles = document.createElement("div").style);
}

function getPrefixedKey(key: string) {
    if (prefixHistory[key]) return prefixHistory[key];
    
    const styles = createStyle();

    if (key in styles) return (prefixHistory[key] = key);
    
    const capitalized = key[0].toUpperCase() + key.slice(1);
    for (let i = vendorPrefixes.length - 1; i >= 0; i--) {
        const prefixedKey = `${vendorPrefixes[i]}${capitalized}`;
        if (styles.hasOwnProperty(prefixedKey)) {
            prefixHistory[key] = prefixedKey;
            return prefixedKey;
        }
    }
}

export function setTransition(elem: HTMLElement | HTMLCanvasElement) {
    const transform = getPrefixedKey("transform");
    setStyle(elem, "transition", `${transform} 400ms`);
}

export function setTransform(elem: HTMLElement | HTMLCanvasElement, { x, y, scale }: TriangleValues) {
    setStyle(elem, "transform", `scale(${scale}) translate(${x}px, ${y}px)`);
}

export function setStyle(elem: HTMLElement | SVGElement, key: string, value: string) {
    elem.style[getPrefixedKey(key) as any] = value;
}

export function getDimensions(elem: HTMLElement) {
    const parent = elem.parentNode as HTMLElement;
    const style = window.getComputedStyle(elem);
    const parentStyle = window.getComputedStyle(parent);
    const rectElem = elem.getBoundingClientRect();
    const rectParent = parent.getBoundingClientRect();

    return {
        elem: {
            style,
            width: rectElem.width,
            height: rectElem.height,
        },
        parent: {
            style: parentStyle,
            width: rectParent.width,
            height: rectParent.height,
        },
    };
}
