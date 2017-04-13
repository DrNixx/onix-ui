import * as React from 'react';
import * as classNames from 'classnames';
import { isValueOutOfRange, ensureValueInRange } from '../../../fn/Number';
import { pauseEvent } from '../../EventUtils';
import { SliderBase, SliderBaseProps, SliderBaseState, RenderResult } from './SliderBase';
import { Track } from './Track';
import { Handle } from './Handle';

interface SliderProps extends SliderBaseProps {
    defaultValue?: number,
    value?: number,
}

interface SliderState extends SliderBaseState {
    value: number,
    dragging: boolean,
}

export class Slider extends SliderBase<SliderProps, SliderState> {
    static displayName = 'Slider'; 

    constructor(props: SliderProps) {
        super(props);

        const defaultValue = props.defaultValue !== undefined ? props.defaultValue : props.min;
        const value = props.value !== undefined ? props.value : defaultValue;

        this.state = {
            value: this.trimAlignValue(value),
            dragging: false,
        };
    }

    componentWillReceiveProps(nextProps: SliderProps) {
        if (!('value' in nextProps || 'min' in nextProps || 'max' in nextProps)) return;
        const prevValue = this.state.value;
        const value = nextProps.value !== undefined ? nextProps.value : prevValue;
        const nextValue = this.trimAlignValue(value, nextProps);
        if (nextValue === prevValue) return;

        this.setState({ 
            ...this.state,
            value: nextValue 
        });

        const { min, max } = nextProps;
        if (isValueOutOfRange(value, min, max)) {
            this.props.onChange(nextValue);
        }
    }

    onChange = (state) => {
        const props = this.props;
        const isNotControlled = !('value' in props);
        if (isNotControlled) {
            this.setState(state);
        }

        const changedValue = state.value;
        props.onChange(changedValue);
    }

    onStart = (position) => {
        this.setState({ 
            ...this.state,
            dragging: true 
        });

        const props = this.props;
        const prevValue = this.getValue();
        props.onBeforeChange(prevValue);

        const value = this.calcValueByPos(position);
        //this.startValue = value;
        //this.startPosition = position;

        if (value === prevValue) return;

        this.onChange({ value });
    }

    onEnd = () => {
        this.setState({ 
            ...this.state,
            dragging: false 
        });
        this.removeDocumentEvents();
        this.props.onAfterChange(this.getValue());
    }

    onMove = (e, position) => {
        pauseEvent(e);
        const state = this.state;
        const value = this.calcValueByPos(position);
        const oldValue = state.value;
        if (value === oldValue) return;

        this.onChange({ value });
    }

    getValue() {
        return this.state.value;
    }

    getLowerBound() {
        return this.props.min;
    }

    getUpperBound() {
        return this.state.value;
    }

    trimAlignValue(v, nextProps = {}) {
        const mergedProps = { ...this.props, ...nextProps };
        const { min, max } = mergedProps;
        const val = ensureValueInRange(v, min, max);
        return this.ensureValuePrecision(val, mergedProps);
    }

    renderInternal(): RenderResult
    {
        const { prefixCls, vertical, included, handle: handleGenerator, } = this.props;
        const { value, dragging } = this.state;
        const offset = this.calcOffset(value);
        const handle = handleGenerator({
            className: `${prefixCls}-handle`,
            vertical,
            offset,
            value,
            dragging,
            ref: h => this.saveHandle(0, h),
        });
        const track = (
            <Track className={`${prefixCls}-track`}
                vertical={vertical}
                included={included}
                offset={0}
                length={offset} />
        );

        return { tracks: track, handles: handle };
    }
}