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
    // Add touches if applicable
    if ((event as any).touches) {
        i = 0;
        for (const touch of (event as any).touches) {            
            touch.pointerId = i++;
            addPointer(pointers, touch);
        }
        return;
    }
    i = findEventIndex(pointers, event);    
    // Update if already present
    if (i > -1) {  
        pointers.splice(i, 1);
    }    
    pointers.push(event);
}
