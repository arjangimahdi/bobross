import { CurrentValues } from "./types";

let styles: CSSStyleDeclaration;
const prefixes = ["webkit", "moz", "ms"];

function createStyle() {
    if (styles) {
        return styles;
    }
    return (styles = document.createElement("div").style);
}

const prefixCache: { [key: string]: string } = {};
function getPrefixedName(name: string) {
    if (prefixCache[name]) {
        return prefixCache[name];
    }
    const styles = createStyle();
    if (name in styles) {
        return (prefixCache[name] = name);
    }
    const capName = name[0].toUpperCase() + name.slice(1);
    let i = prefixes.length;
    while (i--) {
        const prefixedName = `${prefixes[i]}${capName}`;
        if (prefixedName in styles) {
            return (prefixCache[name] = prefixedName);
        }
    }
}

export function setTransition(elem: HTMLElement | HTMLCanvasElement) {
    const transform = getPrefixedName("transform");
    setStyle(elem, "transition", `${transform} 400ms`);
}

export function setTransform(elem: HTMLElement | HTMLCanvasElement, { x, y, scale }: CurrentValues) {
    setStyle(elem, "transform", `scale(${scale}) translate(${x}px, ${y}px)`);
}

export function setStyle(el: HTMLElement | SVGElement, name: string, value: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    el.style[getPrefixedName(name) as any] = value;
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
