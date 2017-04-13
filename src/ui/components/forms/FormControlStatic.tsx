import * as React from 'react';
import * as classNames from 'classnames';

interface FormControlStaticProps {
    className?: string,
    style?: React.CSSProperties,
}

export class FormControlStatic extends React.Component<FormControlStaticProps, {}> {
    constructor(props: FormControlStaticProps) {
        super(props);
    }

    render() {
        const { className, ...elementProps } = this.props;
        const classes = classNames(className, 'form-control-static');

        return (
            <p {...elementProps} className={classes} />
        );
    }
}
