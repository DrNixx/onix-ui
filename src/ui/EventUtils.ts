import { findDOMNode } from 'react-dom';

export function isEventFromHandle(e, handles) {
    return Object.keys(handles)
        .some(key => e.target === findDOMNode(handles[key]));
}

export function isNotTouchEvent(e) {
    return e.touches.length > 1 || 
        (e.type.toLowerCase() === 'touchend' && e.touches.length > 0);
}

export function getTouchPosition(vertical, e) {
  return vertical ? e.touches[0].clientY : e.touches[0].pageX;
}

export function pauseEvent(e) {
    e.stopPropagation();
    e.preventDefault();
}

export function getMousePosition(vertical, e) {
    return vertical ? e.clientY : e.pageX;
}

export function getHandleCenterPosition(vertical, handle) {
    const coords = handle.getBoundingClientRect();
    return vertical ?
        coords.top + (coords.height * 0.5) :
        coords.left + (coords.width * 0.5);
}