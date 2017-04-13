import * as React from 'react';
import { Intl } from '../../../Intl';
import { FormControl, FormControlProps } from '../forms/FormControl';

interface WhoMoveSelectorProps extends FormControlProps {
    defaultTurn?: number;
    onChangeTurn?: (color: number) => void;
}

export class WhoMoveSelector extends React.Component<WhoMoveSelectorProps, {}> {
    public static defaultProps: WhoMoveSelectorProps = {
        defaultTurn: 0,
    }

    /**
     * constructor
     */
    constructor(props: WhoMoveSelectorProps) {
        super(props);
    }

    private onChange = (e) => {
        const { onChangeTurn } = this.props;
        const color: number = e.target.value; 

        if (onChangeTurn) {
            onChangeTurn(color);
        }
    }

    render() {
        const { defaultTurn } = this.props;
        return (
            <FormControl componentClass="select" scale="small" onChange={this.onChange} defaultValue={defaultTurn.toString()}>
                <option value="0">{Intl.t("chess", "white_move")}</option>
                <option value="1">{Intl.t("chess", "black_move")}</option>
            </FormControl>
        );
    }
}
