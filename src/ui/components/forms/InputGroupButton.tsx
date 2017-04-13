import * as React from 'react';
import * as classNames from 'classnames';

interface InputGroupButtonProps   {
    className?: string,
    style?: React.CSSProperties,
}

export class InputGroupButton extends React.Component<InputGroupButtonProps, {}> {
    constructor(props: InputGroupButtonProps) {
        super(props);
    }

    render() {
        const { className, ...elementProps } = this.props;
        return (
            <span {...elementProps} className={classNames(className, 'input-group-btn')} />
        );
    }
}
