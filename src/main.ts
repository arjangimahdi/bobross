import type { BobRossConfig } from "./types";

import { onPointer, destroyPointer } from "./events";
import { getDimensions, setStyle, setTransform, setTransition } from "./css";
import { addPointer } from "./pointers";

const defaultConfig: BobRossConfig = {
    animate: false,
    disablePan: false,
    disableZoom: false,
    disableX: false,
    disableY: false,
    maxScale: 4,
    minScale: 0.25,
    overflow: "hidden",
    startX: 0,
    startY: 0,
    startScale: 1,
};

export class BobRoss {
    public element: HTMLElement | HTMLCanvasElement | null = null;
    public context: CanvasRenderingContext2D | null = null;
    public parent: HTMLElement | null = null;

    private bound: boolean = false;
    private pointers: PointerEvent[] = [];

    protected x: number = 0;
    protected y: number = 0;
    protected scale: number = 1;

    protected isPanning: boolean = false;

    protected configs: BobRossConfig = defaultConfig;

    public init(el: HTMLElement, configs?: BobRossConfig): void {
        this.checkElementExists(el);

        this.element = el;
        this.parent = el.parentNode as HTMLElement;
        this.context = (this.element as HTMLCanvasElement).getContext("2d");

        this.context?.fillRect(0, 0, this.element.clientWidth, this.element.clientHeight);

        this.configs = {
            ...defaultConfig,
            ...configs,
        };

        this.parent.style.overflow = this.configs.overflow;
        
        this.bind();

        setStyle(this.element, "transformOrigin", "center");
        setTransition(this.element)

        const result = this.constrainScale(2);
        const panResult = this.constrainXY(150, 100, 2);

        setTimeout(() => {
            requestAnimationFrame(() => {
                setTransform(this.element as HTMLElement, {x: panResult.x, y: panResult.y, scale: result.scale})
            })
        }, 2000);
    }

    public constrainScale(toScale: number) {
        const result = {scale: this.scale, ...this.configs}

        let minScale = this.configs.minScale
        let maxScale = this.configs.maxScale

        const dims = getDimensions(this.element as HTMLElement)

        const elemWidth = dims.elem.width / this.scale
        const elemHeight = dims.elem.height / this.scale
        const elemScaledWidth = dims.parent.width / elemWidth
        const elemScaledHeight = dims.parent.height / elemHeight

        maxScale = Math.max(maxScale, elemScaledWidth, elemScaledHeight)

        result.scale = Math.min(Math.max(toScale, minScale), maxScale)

        return result
    }
    public constrainXY(toX : number | string, toY: number | string, toScale: number) {
        const result = { x: this.x, y: this.y, ...this.configs }

        toX = parseFloat(toX as string)
        toY = parseFloat(toY as string)

        if (!this.configs.disableX) result.x = toX
        if (!this.configs.disableY) result.y = toY

        const dims = getDimensions(this.element as HTMLElement)
        
        const realWidth = dims.elem.width / this.scale
        const realHeight = dims.elem.height / this.scale
        const scaleWidth = realWidth * toScale
        const scaleHeight = realHeight * toScale
        const diffHorizontal = (scaleWidth - realWidth) / 2
        const diffVertical = (scaleHeight - realHeight) / 2

        const minX = diffHorizontal / toScale
        const maxX = (dims.parent.width - scaleWidth + diffHorizontal) / toScale
        result.x = Math.max(Math.min(result.x, maxX), minX)
        const minY = diffVertical / toScale
        const maxY = (dims.parent.height - scaleHeight + diffVertical) / toScale
        result.y = Math.max(Math.min(result.y, maxY), minY)

        return result
    }

    public handleDown = (event: PointerEvent) => {};
    public handleMove = (event: PointerEvent) => {};
    public handleUp = (event: PointerEvent) => {};

    private bind(): void {
        if (this.bound) return;

        this.bound = true;

        onPointer(this.element as HTMLCanvasElement, "down", this.handleDown);
        onPointer(this.element as HTMLCanvasElement, "move", this.handleMove, { passive: true });
        onPointer(this.element as HTMLCanvasElement, "up", this.handleUp, { passive: true });
    }

    private checkElementExists(el: HTMLElement): Error | void {
        if (!el) {
            throw new Error("Babross needs an element to start actions");
        }
    }
}
