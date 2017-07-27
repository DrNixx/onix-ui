import * as React from 'react';
import { TabPane, TabPaneProps } from './TabPane';

export interface TabProps extends TabPaneProps {
    disabled?: boolean,

    title?: React.ReactType,

    /**
     * tabClassName is used as className for the associated NavItem
     */
    tabClassName?: string
}

export class Tab extends React.Component<TabProps, {}> {
    constructor(props: TabProps) {
        super(props);
    }

    render() {
        const props = { ...this.props };

        // These props are for the parent `<Tabs>` rather than the `<TabPane>`.
        delete props.title;
        delete props.disabled;
        delete props.tabClassName;

        return <TabPane {...props} />;
    }
}