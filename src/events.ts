let events = {
  up: "mouseleave mouseup",
  down: "mousedown",
  move: "mousemove",
};

if (typeof window !== "undefined") {
  if (typeof window.PointerEvent !== "undefined") {
      events = {
          down: "pointerdown",
          move: "pointermove",
          up: "pointerup pointerleave pointercancel",
      };
  } else if (typeof window.TouchEvent !== "undefined") {
      events = {
          down: "touchstart",
          move: "touchmove",
          up: "touchend touchcancel",
      };
  }
}

type PointerEventName = "pointerdown" | "pointermove" | "pointerup" | "pointerleave" | "pointercancel";

export const onPointer = (
  element: HTMLElement | HTMLCanvasElement,
  event: keyof typeof events,
  handler: (e: PointerEvent) => void,
  options?: boolean | AddEventListenerOptions
): void => {
  events[event].split(" ").forEach((eventName) => {
      (element as HTMLElement).addEventListener<PointerEventName>(eventName as PointerEventName, handler, options);
  });
};

export const destroyPointer = (
  element: HTMLElement | HTMLCanvasElement,
  event: keyof typeof events,
  handler: (e: PointerEvent) => void
) => {
  events[event].split(" ").forEach((eventName) => {
      (element as HTMLElement).removeEventListener<PointerEventName>(eventName as PointerEventName, handler);
  });
};
