import * as React from 'react';
import { Intl } from '../../../Intl';
import { FormControl, FormControlProps } from '../forms/FormControl';

interface PieceSelectorProps extends FormControlProps {
    defaultPiece?: string;
    onChangePiece?: (piece: string) => void;
}

export class PieceSelector extends React.Component<PieceSelectorProps, {}> {
    public static defaultProps: PieceSelectorProps = {
        defaultPiece: 'merida',
    }

    /**
     * constructor
     */
    constructor(props: PieceSelectorProps) {
        super(props);
    }

    private onChange = (e) => {
        const { onChangePiece } = this.props;
        const piece = e.target.value; 

        if (onChangePiece) {
            onChangePiece(piece);
        }
    }

    render() {
        const { defaultPiece } = this.props;

        return (
            <FormControl componentClass="select" scale="small" onChange={this.onChange} defaultValue={defaultPiece}>
                <option value="alpha">Alpha</option>
                    <option value="beholder">Beholder</option>
                    <option value="cases">Cases</option>
                    <option value="cats">Cats</option>
                    <option value="condal">Condal</option>
                    <option value="gk">Gk</option>
                    <option value="leipzig">Leipzig</option>
                    <option value="magnetic">Magnetic</option>
                    <option value="maya">Maya</option>
                    <option value="merida">Merida</option>
                    <option value="modern">Modern</option>
                    <option value="smart">Smart</option>
                    <option value="wooden">Wooden</option>
            </FormControl>
        );
    }
}