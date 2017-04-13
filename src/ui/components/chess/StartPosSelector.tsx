import * as React from 'react';
import { Intl } from '../../../Intl';
import { FenEmptyBoard, FenStandartStart } from '../../../chess/Engine';
import { OpeningPosition } from '../../../chess/Constants';
import { FormControl } from '../forms/FormControl';

interface StartPosSelectorProps {
    fen?: string,
    openingsPos: OpeningPosition[],
    onChange?: (fen: string) => void,
}

export class StartPosSelector extends React.Component<StartPosSelectorProps, {}> {
    /**
     * constructor
     */
    constructor(props: StartPosSelectorProps) {
        super(props);
    }

    private onChange = (e) => {
        let fen: string = e.target.value; 

        if (fen === "---") {
            fen = window.prompt(Intl.t("builder", "paste_fen_prompt"), "");
        }

        if (this.props.onChange) {
            this.props.onChange(fen);
        }
    }

    private getOpenings = (openingsPos) => {
        if (openingsPos && openingsPos.length) {
            let openings = [];
            for (let i = 0; i < openingsPos.length; i++) {
                const option = openingsPos[i];
                openings.push(
                    <option key={i} value={option.fen}>{option.name}</option>
                );
            }

            return (
                <optgroup label={Intl.t("builder", "popular_opening")}>
                    {openings}
                </optgroup>
            );

        } else {
            return null;
        }
    }
    
    render() {
        let { fen, openingsPos } = this.props;
        fen = fen || "";
        
        return (
            <FormControl componentClass="select" scale="small" onChange={this.onChange} value={fen}>
                <optgroup label={Intl.t("builder", "set_board")}>
                    <option value="">{Intl.t("builder", "position_label")}</option>
                    <option value={FenStandartStart}>{Intl.t("builder", "std_fen")}</option>
                    <option value={FenEmptyBoard}>{Intl.t("builder", "empty_fen")}</option>
                    <option value="---">{Intl.t("builder", "get_fen")}</option>
                </optgroup>
                {this.getOpenings(openingsPos)}
            </FormControl>
        );
    }
}
