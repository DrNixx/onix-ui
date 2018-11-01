import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as classNames from 'classnames';
import * as warning from 'warning';
import { SIZE_MAP } from '../StyleConfig';
import { FormControlStatic } from './FormControlStatic';
import { FormControlFeedback } from './FormControlFeedback';


export interface FormControlProps extends React.HTMLProps<HTMLInputElement> {
    componentClass?: React.ReactType,
    
    /**
     * Only relevant if `componentClass` is `'input'`.
     */
    type?: string,
    
    /**
     * Uses `controlId` from `<FormGroup>` if not explicitly specified.
     */
    
    id?: string,
    /**
     * Attaches a ref to the `<input>` element. Only functions can be used here.
     *
     * ```js
     * <FormControl inputRef={ref => { this.input = ref; }} />
     * ```
     */
    
    inputRef?: React.Ref<React.ReactType>,

    scale?: 'large' | 'small',
}

export class FormControl extends React.Component<FormControlProps, {}> {
    public static defaultProps: FormControlProps = {
        componentClass: 'input',
    }

    public static contextTypes = {
        $bs_formGroup: PropTypes.object,
    };

    public static Static = FormControlStatic;

    public static Feedback = FormControlFeedback;

    constructor(props: FormControlProps, context?) {
        super(props, context);
    }

    render() {
        const formGroup = this.context.$bs_formGroup;
        const controlId = formGroup && formGroup.controlId;

        const {
            componentClass: Component,
            type,
            id = controlId,
            inputRef,
            className,
            scale,
            ...elementProps
        } = this.props;

        warning(controlId == null || id === controlId, '`controlId` is ignored on `<FormControl>` when `id` is specified.');

        // input[type="file"] should not have .form-control.
        let classes = {};
        let atype = type;
        if (type !== 'file') {
            classes['form-control'] = true;
            if ((Component == "input") && !atype) {
                atype = 'text';
            }
        }

        // If user provides a size, make sure to append it to classes as input-
        // e.g. if bsSize is small, it will append input-sm
        if (scale) {
            const s = SIZE_MAP[scale] || scale;
            classes[`input-${s}`] = true;
        }

        return (
            <Component
                {...elementProps}
                type={atype}
                id={id}
                ref={inputRef}
                className={classNames(className, classes)}
            />
        );
    }
}
