import * as React from 'react';
import * as classNames from 'classnames';
import * as warning from 'warning';
import { addEventListener, EventListener } from '../../dom/addEventListener';
import { Steps } from './Steps';
import { Marks } from './Marks';
import { Track } from './Track';
import { Handle } from './Handle';
import { 
    isNotTouchEvent, 
    getTouchPosition,
    getMousePosition,
    isEventFromHandle, 
    pauseEvent,  
    getHandleCenterPosition } from '../../EventUtils';

export type RenderResult = {
    tracks: JSX.Element | JSX.Element[],
    handles: Handle | Handle[]
}

export interface SliderBaseProps {
    min?: number,
    max?: number,
    step?: number,

    marks?: any,

    included?: boolean,
    className?: string,
    style?: React.CSSProperties,
    prefixCls?: string,
    disabled?: boolean,
    onBeforeChange?: Function,
    onChange?: Function,
    onAfterChange?: Function,
    handle?: Function,
    dots?: boolean,
    vertical?: boolean,
}

export interface SliderBaseState {
}

function noop() {}

export abstract class SliderBase<P extends SliderBaseProps, S extends SliderBaseState> extends React.Component<P, S> {
    private onTouchMoveListener: EventListener;
    private onTouchUpListener: EventListener;
    private onMouseMoveListener: EventListener;
    private onMouseUpListener: EventListener;

    static defaultProps: SliderBaseProps = {
        prefixCls: 'rc-slider',
        className: '',
        min: 0,
        max: 100,
        step: 1,
        marks: {},
        handle({ index, ...restProps }) {
            return <Handle {...restProps} key={index} />;
        },
        onBeforeChange: noop,
        onChange: noop,
        onAfterChange: noop,
        included: true,
        disabled: false,
        dots: false,
        vertical: false,
    }

    private dragOffset: number = 0;

    private handlesRefs: any;

    private sliderRef: any;

    constructor(props: P) {
        super(props);
        if (process.env.NODE_ENV !== 'production') {
            const { step, max, min } = props;
            warning(
                step && Math.floor(step) === step ? (max - min) % step === 0 : true,
                'Slider[max] - Slider[min] (%s) should be a multiple of Slider[step] (%s)',
                max - min,
                step
            );
        }
    }

    onMouseDown = (e) => {
        if (e.button !== 0) { return; }

        const isVertical = this.props.vertical;
        let position = getMousePosition(isVertical, e);
        if (!isEventFromHandle(e, this.handlesRefs)) {
            this.dragOffset = 0;
        } else {
            const handlePosition = getHandleCenterPosition(isVertical, e.target);
            this.dragOffset = position - handlePosition;
            position = handlePosition;
        }
        this.onStart(position);
        this.addDocumentMouseEvents();
        pauseEvent(e);
    }

    onTouchStart = (e) => {
        if (isNotTouchEvent(e)) return;

        const isVertical = this.props.vertical;
        let position = getTouchPosition(isVertical, e);
        if (!isEventFromHandle(e, this.handlesRefs)) {
            this.dragOffset = 0;
        } else {
            const handlePosition = getHandleCenterPosition(isVertical, e.target);
            this.dragOffset = position - handlePosition;
            position = handlePosition;
        }
        this.onStart(position);
        this.addDocumentTouchEvents();
        pauseEvent(e);
    }

    addDocumentTouchEvents() {
        // just work for Chrome iOS Safari and Android Browser
        this.onTouchMoveListener = addEventListener(document, 'touchmove', this.onTouchMove);
        this.onTouchUpListener = addEventListener(document, 'touchend', this.onEnd);
    }

    addDocumentMouseEvents() {
        this.onMouseMoveListener = addEventListener(document, 'mousemove', this.onMouseMove);
        this.onMouseUpListener = addEventListener(document, 'mouseup', this.onEnd);
    }

    removeDocumentEvents() {
        /* eslint-disable no-unused-expressions */
        this.onTouchMoveListener && this.onTouchMoveListener.remove();
        this.onTouchUpListener && this.onTouchUpListener.remove();

        this.onMouseMoveListener && this.onMouseMoveListener.remove();
        this.onMouseUpListener && this.onMouseUpListener.remove();
        /* eslint-enable no-unused-expressions */
    }

    onStart = (position: number): void => { }

    onEnd = (): void => { };

    onMove = (e, position: number): void => { }

    onMouseMove = (e) => {
        const position = getMousePosition(this.props.vertical, e);
        this.onMove(e, position - this.dragOffset);
    }

    onTouchMove = (e) => {
        if (isNotTouchEvent(e)) {
            this.onEnd();
            return;
        }

        const position = getTouchPosition(this.props.vertical, e);
        this.onMove(e, position - this.dragOffset);
    }

    getSliderStart(): number {
        const slider = this.sliderRef;
        const rect = slider.getBoundingClientRect();

        return this.props.vertical ? rect.top : rect.left;
    }

    getSliderLength() {
        const slider = this.sliderRef;
        if (!slider) {
            return 0;
        }

        return this.props.vertical ? slider.clientHeight : slider.clientWidth;
    }

    private getClosestPoint(val, marks, step, min) {
        const points = Object.keys(marks).map(parseFloat);
        if (step !== null) {
            const closestStep = Math.round((val - min) / step) * step + min;
            points.push(closestStep);
        }

        const diffs = points.map(point => Math.abs(val - point));
        return points[diffs.indexOf(Math.min(...diffs))];
    }

    ensureValuePrecision(val: number, props: SliderBaseProps) {
        const { marks, step, min } = props;
        const closestPoint = this.getClosestPoint(val, marks, step, min);
        return step === null ? closestPoint : parseFloat(closestPoint.toFixed(this.getPrecision(step)));
    }

    getPrecision(step) {
        const stepString = step.toString();
        let precision = 0;
        if (stepString.indexOf('.') >= 0) {
            precision = stepString.length - stepString.indexOf('.') - 1;
        }

        return precision;
    }

    calcValue(offset) {
        const { vertical, min, max } = this.props as SliderBaseProps;
        const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
        const value = vertical ? (1 - ratio) * (max - min) + min : ratio * (max - min) + min;
        return value;
    }

    calcValueByPos(position) {
        const pixelOffset = position - this.getSliderStart();
        const nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
        return nextValue;
    }

    calcOffset(value) {
        const { min, max } = this.props as SliderBaseProps;
        const ratio = (value - min) / (max - min);
        return ratio * 100;
    }

    saveSlider = (slider) => {
        this.sliderRef = slider;
    }

    saveHandle(index, handle) {
        if (!this.handlesRefs) {
            this.handlesRefs = {};
        }

        this.handlesRefs[index] = handle;
    }

    abstract getLowerBound(): number;

    abstract getUpperBound(): number;

    protected abstract trimAlignValue(v, nextProps?: SliderBaseProps): number;

    abstract renderInternal(): RenderResult;

    render() {
        const {
            prefixCls,
            className,
            marks,
            dots,
            step,
            included,
            disabled,
            vertical,
            min,
            max,
            style,
        } = this.props as SliderBaseProps;
        const { children } = this.props;
        const { tracks, handles } = this.renderInternal();

        const sliderClassName = classNames({
            [prefixCls]: true,
            [`${prefixCls}-with-marks`]: Object.keys(marks).length,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-vertical`]: vertical,
            [className]: className,
        });

        return (
            <div ref={this.saveSlider}
                className={sliderClassName}
                onTouchStart={disabled ? noop : this.onTouchStart}
                onMouseDown={disabled ? noop : this.onMouseDown}
                style={style} >
                <div className={`${prefixCls}-rail`} />
                    {tracks}
                    <Steps prefixCls={prefixCls}
                        vertical={vertical}
                        marks={marks}
                        dots={dots}
                        step={step}
                        included={included}
                        lowerBound={this.getLowerBound()}
                        upperBound={this.getUpperBound()}
                        max={max}
                        min={min} />
                    {handles}
                    <Marks className={`${prefixCls}-mark`}
                        vertical={vertical}
                        marks={marks}
                        included={included}
                        lowerBound={this.getLowerBound()}
                        upperBound={this.getUpperBound()}
                        max={max}
                        min={min} />
                    {children}
                </div>
        );
    }
}