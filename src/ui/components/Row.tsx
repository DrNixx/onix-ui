import * as React from 'react';
import * as classNames from 'classnames';

interface RowProps  {
    className?: string,
    style?: React.CSSProperties,
    componentClass?: React.ReactType,
}

export class Row extends React.Component<RowProps, {}> {
    public static defaultProps: RowProps = {
        componentClass: 'div'
    }
    
    constructor(props: RowProps, context) {
        super(props, context);
    }

    render() {
        const { componentClass: Component, className, style, ...props } = this.props;

        return (
            <Component className={classNames("row", className)} style={style} {...props} />
        );    
    }
}