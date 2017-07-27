import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Tabs, Tab } from '../index';

export interface TabsTestProps {

}

export interface TabsTestState {
    key: string | number;
}

class TabsTestClass extends React.Component<TabsTestProps, TabsTestState> {
    constructor(props: TabsTestProps) {
        super(props);
        this.state = {
            key: 1
        };
    }

    handleSelect = (key) => {
        this.setState({key: key});
    }

    render() {

        const props = {
            ...this.props,
            onSelect: this.handleSelect, 
            id: "controlled-tab-example"
        }

        return (
            <Tabs {...props} activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
                <Tab eventKey={1} title="Tab 1">Tab 1 content</Tab>
                <Tab eventKey={2} title="Tab 2">Tab 2 content</Tab>
                <Tab eventKey={3} title="Tab 3" disabled>Tab 3 content</Tab>
            </Tabs>
        );
    }
}

export const TabsTest = (props: TabsTestProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(TabsTestClass, props), container, () => {});
};
