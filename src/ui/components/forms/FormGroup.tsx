import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as classNames from 'classnames';

export interface FormGroupProps {
    className?: string,
    style?: React.CSSProperties,
    controlId?: string,
    validationState?: 'success' | 'warning' | 'error',
}

export class FormGroup extends React.Component<FormGroupProps, {}> {
    private static childContextTypes = {
        $bs_formGroup: PropTypes.object.isRequired,
    }

    constructor(props: FormGroupProps, context?) {
        super(props, context);
    }

    getChildContext = () => {
        const { controlId, validationState } = this.props;

        return {
            $bs_formGroup: {
                controlId,
                validationState
            },
        };
    }

    hasFeedback = (children) => {
        return React.Children.toArray(children).some(child => (
            React.isValidElement<any>(child) &&
            (child.props.bsRole === 'feedback' || (child.props.children && this.hasFeedback(child.props.children)))
        ), this);
    }

    render() {
        const { validationState, className, children, controlId, ...elementProps } = this.props;
        
        const classes = {
            'form-group': true,
            'has-feedback': this.hasFeedback(children),
        };

        if (validationState) {
            classes[`has-${validationState}`] = true;
        }

        return (
            <div {...elementProps} className={classNames(className, classes)}>
                {children}
            </div>
        );
    }
}
