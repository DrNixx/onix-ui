import * as React from 'react';
import * as classNames from 'classnames';
import { StateType, StyleType } from '../StyleConfig';


export interface CheckboxProps extends React.HTMLProps<HTMLInputElement>   {
    circle?: boolean,

    state?: StateType | StyleType,

    /**
     * Attaches a ref to the `<input>` element. Only functions can be used here.
     *
     * ```js
     * <Checkbox inputRef={ref => { this.input = ref; }} />
     * ```
     */
    inputRef?: React.Ref<HTMLInputElement>,

    onChangeState?: (chk: boolean, val: string) => void;
}

export class Checkbox extends React.Component<CheckboxProps, {}> {
    public static defaultProps: CheckboxProps = {
        circle: false,
        disabled: false,
    }

    constructor(props: CheckboxProps) {
        super(props);
    }

    private onChange = (e) => {
        const { onChange, onChangeState } = this.props;

        if (onChange) {
            onChange(e);
        }

        if (onChangeState) {
            onChangeState(e.target.checked, e.target.value);
        }
    }

    render() {
        const { id, circle, disabled, state, inputRef, className, style, onChangeState, children, ...elementProps } = this.props;

        const classes = {
            'checkbox': true,
            [`check-${state}`]: !!state,
            ['checkbox-circle']: circle,
            disabled,
        };

        return (
            <div className={classNames(className, classes)} style={style}>
                <input {...elementProps} id={id} ref={inputRef} type="checkbox" disabled={disabled} onChange={this.onChange} />
                <label htmlFor={id}>{children}</label>
            </div>
        );
    }
}
