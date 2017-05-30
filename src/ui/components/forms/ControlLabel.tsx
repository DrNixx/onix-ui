import * as React from 'react';
import { PropTypes } from 'prop-types';
import * as classNames from 'classnames';
import * as warning from 'warning';

export interface ControlLabelProps   {
    className?: string,
    style?: React.CSSProperties,
    htmlFor?: boolean,
    srOnly?: boolean,
}

export class ControlLabel extends React.Component<ControlLabelProps, {}> {
    public static defaultProps: ControlLabelProps = {
        srOnly: false,
    }

    public static contextTypes = {
        $bs_formGroup: PropTypes.object,
    };

    constructor(props: ControlLabelProps, context?) {
        super(props, context);
    }

    render() {
        const formGroup = this.context.$bs_formGroup;
        const controlId = formGroup && formGroup.controlId;

        const { htmlFor = controlId, srOnly, className, ...elementProps } = this.props;
        
        warning(
            controlId == null || htmlFor === controlId,
            '`controlId` is ignored on `<ControlLabel>` when `htmlFor` is specified.'
        );

        const classes = {
            'control-label': true,
            'sr-only': srOnly,
        };

        return (
            <label {...elementProps} htmlFor={htmlFor} className={classNames(className, classes)} />
    );
    }
}
