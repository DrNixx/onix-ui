import * as React from 'react';
import * as classNames from 'classnames';
import { SIZE_MAP, StateType, StyleType } from '../StyleConfig';

interface InputGroupProps   {
    className?: string,
    style?: React.CSSProperties,
    scale?: 'large' | 'small',
}

export class InputGroup extends React.Component<InputGroupProps, {}> {
    constructor(props: InputGroupProps) {
        super(props);
    }

    render() {
        const { className, scale, ...elementProps } = this.props;
        
        const s = SIZE_MAP[scale] || scale;
        const classes = {
            ['input-group']: true,
            [`input-group-${s}`]: !!scale,
        };

        return (
            <span {...elementProps} className={classNames(className, classes)} />
        );
    }
}
