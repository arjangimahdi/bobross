function findEventIndex(pointers: PointerEvent[], event: PointerEvent) {
    let i = pointers.length;
    while (i--) {
        if (pointers[i].pointerId === event.pointerId) {
            return i;
        }
    }
    return -1;
}

export function addPointer(pointers: PointerEvent[], event: PointerEvent) {
    let i;
    if ((event as any).touches) {
        i = 0;
        for (const touch of (event as any).touches) {
            touch.pointerId = i++;
            addPointer(pointers, touch);
        }
        return;
    }
    i = findEventIndex(pointers, event);
    if (i > -1) {
        pointers.splice(i, 1);
    }
    pointers.push(event);
}

export function removePointer(pointers: PointerEvent[], event: PointerEvent) {
    if ((event as any).touches) {
      while (pointers.length) {
        pointers.pop()
      }
      return
    }
    const i = findEventIndex(pointers, event)
    if (i > -1) {
      pointers.splice(i, 1)
    }
  }

export function getMiddle(pointers: PointerEvent[]) {
    pointers = pointers.slice(0)

    let event1 : Pick<PointerEvent, 'clientX' | 'clientY'> = pointers.pop() as PointerEvent
    let event2 : PointerEvent | undefined

    while ((event2 = pointers.pop())) {
        event1 = {
            clientX: (event2.clientX - event1.clientX) / 2 + event1.clientX,
            clientY: (event2.clientY - event1.clientY) / 2 + event1.clientY
        }
    }
    return event1
}

export function getDistance(pointers: PointerEvent[]) {
    if (pointers.length < 2) {
      return 0
    }
    const event1 = pointers[0]
    const event2 = pointers[1]
    return Math.sqrt(
      Math.pow(Math.abs(event2.clientX - event1.clientX), 2) +
        Math.pow(Math.abs(event2.clientY - event1.clientY), 2)
    )
}