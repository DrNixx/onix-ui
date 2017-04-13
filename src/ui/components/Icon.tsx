import * as React from 'react';
import * as classNames from 'classnames';

interface IconProps {
    glyph: string,
    className?: string,
    style?: React.CSSProperties,
}

export class Icon extends React.Component<IconProps, {}> {
    constructor(props: IconProps) {
        super(props);
    }

    render() {
        const { className, glyph, ...elementProps } = this.props;
        const classes = classNames(className, glyph);

        return (
            <i {...elementProps} className={classes} />
        );
    }
}
