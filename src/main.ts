import { onPointer, destroyPointer } from "./events";
import { addPointer } from "./pointers";

const defaultConfig = {};

export class BobRoss {
    public element: HTMLElement | null = null;
    public parent: HTMLElement | HTMLDivElement | null = null;

    public x: number = 0;
    public y: number = 0;
    public scale: number = 1;

    public bound: boolean = false;
    public pointers: PointerEvent[] = [];

    constructor(elem: HTMLElement | HTMLCanvasElement) {
        if (!elem) {
            throw new Error("BobRoss requires an element as an argument");
        }

        this.element = elem;
        this.parent = this.element.parentNode as HTMLElement;
    }

    init(): void {
        this.bind();
    }

    handleDown = (e: PointerEvent): void => {};
    handleMove(e: PointerEvent): void {}
    handleUp(e: PointerEvent): void {}

    bind(): void {
        if (this.bound) return;

        this.bound = true;

        onPointer(this.element as HTMLCanvasElement, "down", this.handleDown);
        onPointer(this.element as HTMLCanvasElement, "move", this.handleMove, { passive: true });
        onPointer(this.element as HTMLCanvasElement, "up", this.handleUp, { passive: true });
    }

    unbind(): void {
        this.bound = false;

        destroyPointer(this.element as HTMLCanvasElement, "down", this.handleDown);
        destroyPointer(this.element as HTMLCanvasElement, "move", this.handleMove);
        destroyPointer(this.element as HTMLCanvasElement, "up", this.handleUp);
    }
}
