export class EventBaseObject {
    public timeStamp: number;
    public target;
    public currentTarget;

    protected _isDefaultPrevented = false;

    protected _isPropagationStopped = false;

    protected _isImmediatePropagationStopped = false;

    constructor() {
        this.timeStamp = Date.now();
        this.target = undefined;
        this.currentTarget = undefined;
    }

    public get isEventObject(): boolean {
        return true;
    }

    public get isDefaultPrevented(): boolean {
        return this._isDefaultPrevented;
    }

    public get isPropagationStopped(): boolean {
        return this._isPropagationStopped;
    }

    public get isImmediatePropagationStopped(): boolean {
        return this._isImmediatePropagationStopped;
    }

    preventDefault() {
        this._isDefaultPrevented = true;
    }

    stopPropagation() {
        this._isPropagationStopped = true;
    }

    stopImmediatePropagation() {
        this._isImmediatePropagationStopped = true;
        // fixed 1.2
        // call stopPropagation implicitly
        this.stopPropagation();
    }

    halt(immediate) {
        if (immediate) {
            this.stopImmediatePropagation();
        } else {
            this.stopPropagation();
        }
        
        this.preventDefault();
    }
}
