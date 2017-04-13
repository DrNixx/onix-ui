import { DomEventObject } from './DomEventObject';

export type EventListener = {
    remove(): void;
}

export function addEventListener(target, eventType, callback): EventListener {
    function wrapCallback(e) {
        const ne = new DomEventObject(e);
        callback.call(target, ne);
    }

    if (target.addEventListener) {
        target.addEventListener(eventType, wrapCallback, false);
        return {
            remove() {
                target.removeEventListener(eventType, wrapCallback, false);
            },
        };
    } else if (target.attachEvent) {
        target.attachEvent(`on${eventType}`, wrapCallback);
        return {
            remove() {
                target.detachEvent(`on${eventType}`, wrapCallback);
            },
        };
    }
}