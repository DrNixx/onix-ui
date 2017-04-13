import * as React from 'react';
import { PanelGroup, PanelGroupProps, PanelGroupState } from './PanelGroup';

export class Accordion extends React.Component<PanelGroupProps, {}> {
    constructor(props: PanelGroupProps, context?) {
        super(props, context);
    }

    render() {
        const { accordion, ...props } = this.props;
        return (
            <PanelGroup {...props} accordion={true}>
                {this.props.children}
            </PanelGroup>
        );
    }
}