import * as React from 'react';
import { PropTypes } from 'prop-types';
import * as classNames from 'classnames';
import { Icon } from '../Icon';

export interface FormControlFeedbackProps {
    className?: string,
    style?: React.CSSProperties,
    bsRole?: string, 
}

export class FormControlFeedback extends React.Component<FormControlFeedbackProps, {}> {
    public static defaultProps: FormControlFeedbackProps = {
        bsRole: 'feedback',
    }

    static contextTypes = {
        $bs_formGroup: PropTypes.object,
    };

    constructor(props: FormControlFeedbackProps, context?) {
        super(props, context);
    }

    getGlyph(validationState) {
        switch (validationState) {
            case 'success': 
                return 'xi-ok';
            case 'warning': 
                return 'xi-warning-sign';
            case 'error': 
                return 'xi-remove';
            default: 
                return null;
        }
    }

    renderDefaultFeedback(formGroup, className, classes, elementProps) {
        const glyph = this.getGlyph(formGroup && formGroup.validationState);
        if (!glyph) {
            return null;
        }

        return (
            <Icon {...elementProps} glyph={glyph} className={classNames(className, classes)} />
        );
    }

    render() {
        const { className, children, bsRole, ...elementProps } = this.props;
        
        const classes = 'form-control-feedback';

        if (!children) {
            return this.renderDefaultFeedback(this.context.$bs_formGroup, className, classes, elementProps);
        }

        const child = React.Children.only(children);
        return React.cloneElement(child, {
            ...elementProps,
            className: classNames(child.props.className, className, classes),
        });
    }
}
