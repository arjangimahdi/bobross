import type { BobRossConfig } from "./types";

import { onPointer } from "./events";
import { getDimensions, setStyle, setTransform, setTransition } from "./css";
import { addPointer, getMiddle, removePointer } from "./pointers";

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
    
    protected orgX: number = 0
    protected orgY: number = 0
    protected startClientX: number = 0
    protected startClientY: number = 0
    protected startScale: number = 0

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

        this.zoom(2)
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

        const minX = (-(scaleWidth - dims.parent.width) + diffHorizontal) / toScale        
        const maxX = (diffHorizontal) / toScale
        
        result.x = Math.max(Math.min(result.x, maxX), minX)

        const maxY = diffVertical / toScale
        const minY = (-(scaleHeight - dims.parent.height) + diffVertical) / toScale

        result.y = Math.max(Math.min(result.y, maxY), minY)

        return result
    }

    public zoom(toScale: number) {
        const result = this.constrainScale(toScale);
        const panResult = this.constrainXY(this.y, this.x, result.scale);
        
        this.scale = result.scale
        this.x = panResult.x
        this.y = panResult.y

        requestAnimationFrame(() => {
            setTransform(this.element as HTMLElement, {x: panResult.x, y: panResult.y, scale: result.scale})
        })
    }

    public handleDown = (event: PointerEvent) => {
        this.isPanning = true        
        addPointer(this.pointers, event)
        this.isPanning = true

        this.orgX = this.x
        this.orgY = this.y

        const point = getMiddle(this.pointers)

        this.startClientX = point.clientX
        this.startClientY = point.clientY
        this.startScale = this.scale
    };
    public handleMove = (event: PointerEvent) => {
        if (!this.isPanning) return

        addPointer(this.pointers, event);
        
        const current = getMiddle(this.pointers)

        let toScale = this.scale

        let panX = this.orgX + (current.clientX - this.startClientX) / this.scale
        let panY = this.orgY + (current.clientY - this.startClientY) / this.scale

        const result = this.constrainXY(panX, panY, toScale)

        if (this.x !== result.x || this.y !== result.y) {
            this.x = result.x
            this.y = result.y
            requestAnimationFrame(() => {
                setTransform(this.element as HTMLElement, {x: result.x, y: result.y, scale: this.scale})
            })
        }
    };
    public handleUp = (event: PointerEvent) => {
        removePointer(this.pointers, event)
        if (!this.isPanning) return 
        this.isPanning = false
        this.orgX = this.orgY = this.startClientX = this.startClientY = undefined
    };

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
