import * as React from 'react';
import * as classNames from 'classnames';

interface FormProps extends React.HTMLProps<HTMLFormElement>  {
    horizontal: boolean,
    inline: boolean,
}

export class Form extends React.Component<FormProps, {}> {
    public static defaultProps: FormProps = {
        horizontal: false,
        inline: false,
    }

    constructor(props: FormProps, context) {
        super(props, context);
    }

    render() {
        const { horizontal, inline, className, ...elementProps } = this.props;

        const classes = classNames(className, {
            ['form-horizontal']: horizontal,
            ['form-inline']: inline,
        });

        return (
            <form {...elementProps} className={classes} />
        );
    }
}
