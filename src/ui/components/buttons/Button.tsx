import * as React from 'react';
import * as classNames from 'classnames';
import { SafeAnchor } from '../SafeAnchor';
import { DEVICE_SIZES, DeviceSizeType, StateType, StyleType } from '../StyleConfig';

interface ButtonProps  {
    componentClass?: React.ReactType,
    className?: string,
    style?: React.CSSProperties,
    active?: boolean,
    disabled?: boolean,
    block?: boolean,
    onClick?: (event) => void,
    href?: string,
    type?: 'button' | 'reset' | 'submit',
    size?: DeviceSizeType,
    state?: StateType | StyleType,
}

export class Button extends React.Component<ButtonProps, {}> {
    public static defaultProps: ButtonProps = {
        state: 'default',
        active: false,
        block: false,
        disabled: false,
    }

    constructor(props: ButtonProps, context) {
        super(props, context);
    }

    private renderAnchor = (elementProps: ButtonProps, className: string) => {
        const { active, block, type, size, state, ...props } = elementProps;
        return (
            <SafeAnchor
                {...props}
                className={classNames(className, elementProps.disabled && 'disabled')} />
        );
    }

    renderButton(elementProps: ButtonProps, className: string) {
        const { componentClass, ...props } = elementProps;
        const Component = componentClass || 'button';

        return (
            <Component {...props} type={elementProps.type || 'button'} className={className} />
        );
    }

    render() {
        const { active, block, size, state, className, ...props } = this.props;

        const classes = {
            active,
            [`btn-${state}`]: !!state,
            [`btn-${size}`]: !!size,
            ['btn-block']: !!block,
        };

        const fullClassName = classNames('btn', className, classes);

        if (props.href) {
            return this.renderAnchor(props, fullClassName);
        }

        return this.renderButton(props, fullClassName);
    }
}
