import * as React from 'react';
import * as classNames from 'classnames';

export interface HandleProps {
    className?: string,
    vertical?: boolean,
    offset?: number,
}

export class Handle extends React.Component<HandleProps, {}> {
    public static defaultProps: HandleProps = {
        offset: 0,
    }

    constructor(props: HandleProps, context?) {
        super(props, context);
    }

    render() {
        const { className, vertical, offset } = this.props;

        const style = vertical ? { bottom: `${offset}%` } : { left: `${offset}%` };
        return <div className={className} style={style} />;
    }
}