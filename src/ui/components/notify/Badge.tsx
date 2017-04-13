import * as React from 'react';
import * as classNames from 'classnames';

interface BadgeProps {
    className?: string,
    style?: React.CSSProperties,
    bsStyle?: 'badge' | 'warning' | 'important' | 'info' | 'inverse';
    pullRight?: boolean,
    hideZero?: boolean,
    value?: number,
}

export class Badge extends React.Component<BadgeProps, {}> {
    public static defaultProps: BadgeProps = {
        pullRight: false,
        hideZero: true,
        value: 0,
    }

    constructor(props: BadgeProps, context?) {
        super(props, context);
    }

    render() {
        const { pullRight, className, style, value, hideZero, bsStyle } = this.props;
        
        const hasContent = value || !hideZero; 

        const classes = {
            [`badge-${bsStyle}`]: bsStyle,
            'pull-right': pullRight,
            // Hack for collapsing on IE8.
            hidden: !hasContent,
        };

        return (
            <span className={classNames('badge', bsStyle, classes, className)} style={style}>{value}</span>
        );
    }
}