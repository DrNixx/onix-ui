import * as React from 'react';
import * as classNames from 'classnames';
import { SIZE_MAP, StateType, StyleType } from '../StyleConfig';
import { Icon } from '../Icon';

export interface InputGroupAddonProps extends React.HTMLProps<HTMLSpanElement>   {
    className?: string,
    style?: React.CSSProperties,
    state?: StateType | StyleType,
    arrow?: boolean,
    glyph?: string,
}

export class InputGroupAddon extends React.Component<InputGroupAddonProps, {}> {
    public static defaultProps: InputGroupAddonProps = {
        arrow: false,
        glyph: null,
    }

    constructor(props: InputGroupAddonProps) {
        super(props);
    }

    render() {
        const { className, state, arrow, glyph, children, ...elementProps } = this.props;

        const classes = {
            [`${state}`]: !!state,
        };

        const getArrow = () => {
            return arrow ? (
                <span className="arrow" />
            ) : null;
        }

        const getIcon = () => {
            return glyph ? (
                <Icon glyph={glyph} />
            ) : null;
        };

        return (
            <span {...elementProps} className={classNames(className, 'input-group-addon', classes)}>
                {getArrow()}
                {getIcon()}
            </span>
        );
    }
}
