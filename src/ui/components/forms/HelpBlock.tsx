import * as React from 'react';
import * as classNames from 'classnames';

export interface HelpBlockProps   {
    className?: string,
    style?: React.CSSProperties,
}

export class HelpBlock extends React.Component<HelpBlockProps, {}> {
    constructor(props: HelpBlockProps) {
        super(props);
    }

    render() {
        const { className, ...elementProps } = this.props;
        const classes = classNames(className, 'help-block');

        return (
            <span {...elementProps} className={classes} />
        );
    }
}
