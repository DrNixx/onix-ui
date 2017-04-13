import * as React from 'react';
import * as classNames from 'classnames';
import { copy } from '../../CopyToClipboard';
import { Intl } from '../../../Intl';
import { InputGroup } from './InputGroup';
import { InputGroupAddon } from './InputGroupAddon';
import { FormControl, FormControlProps } from './FormControl';
import { SIZE_MAP } from '../StyleConfig';

interface TextWithCopyProps extends FormControlProps {
    value?: string,
}

interface TextWithCopyState {
    className: string;
}

export class TextWithCopy extends React.Component<TextWithCopyProps, TextWithCopyState> {
    /**
     * constructor
     */
    constructor(props: TextWithCopyProps) {
        super(props);

        this.state = { 
            className: null,
        };
    }

    private onCopy = (e) => {
        if (copy(this.props.value)) {
            this.setSuccess();
        }
    }

    private setSuccess = () => {
        const that = this;
        this.setState({ 
            className: 'text-success',
        }, function() {
            setTimeout(that.setPrimary, 2000);
        });
    }

    private setPrimary = () => {
        this.setState({ 
            className: null,
        });
    }

    render() {
        let { id, scale, readOnly, ref, ...elementProps } = this.props;

        let classes = [];
        if (scale) {
            const s = SIZE_MAP[scale] || scale;
            classes[`input-${s}`] = true;
        }

        return (
            <InputGroup scale={scale}>
                <FormControl 
                    {...elementProps}
                    className={classNames(this.state.className)} 
                    readOnly={true} />
                <InputGroupAddon state="primary" onClick={this.onCopy} title={Intl.t("forms", "copy_to_clipboard")} arrow={true} glyph="xi-copy" />
            </InputGroup>
        );
    }
}