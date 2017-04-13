import * as React from 'react';
import * as classNames from 'classnames';
import { TabContainer } from './TabContainer';
import { TabContent } from './TabContent';
import { Nav } from './Nav';
import { NavItem } from './NavItem';
import ElementChildren from '../ElementChildren'
import { TabSelectHandler } from './ContextTypes';

interface TabsProps  {
    /**
     * Mark the Tab with a matching `eventKey` as active.
     *
     * @controllable onSelect
     */
    activeKey?: string | number, 
    
    /**
     * Navigation style
     */
    bsStyle?: 'nav-tabs' | 'nav-pills',

    side?: 'left' | 'right';

    animation?: boolean,

    id?: string,

    className?: string,

    style?: React.CSSProperties,

    /**
     * Callback fired when a Tab is selected.
     *
     */
    onSelect?: TabSelectHandler,

    /**
     * Unmount tabs (remove it from the DOM) when it is no longer visible
     */
    unmountOnExit?: boolean,
}

function getDefaultActiveKey(children) {
    let defaultActiveKey;
    ElementChildren.forEach(children, child => {
        if (defaultActiveKey == null) {
            defaultActiveKey = child.props.eventKey;
        }
    });

    return defaultActiveKey;
}

export class Tabs extends React.Component<TabsProps, {}> {

    public static defaultProps: TabsProps = {
        bsStyle: 'nav-tabs',
        animation: true,
        unmountOnExit: false
    };

    constructor(props: TabsProps) {
        super(props);
    }

    renderTab(child) {
        const { title, eventKey, disabled, tabClassName } = child.props;
        if (title == null) {
            return null;
        }

        return (
            <NavItem
                eventKey={eventKey}
                disabled={disabled}
                className={tabClassName}>{title}</NavItem>
        );
    }

    render() {
        const {
            id,
            side,
            onSelect,
            animation,
            unmountOnExit,
            className,
            style,
            children,
            activeKey = getDefaultActiveKey(children),
            ...props
        } = this.props;

        let classes = classNames(className, {
            'tabbable': !!side,
            'tabs-left': side == 'left',
            'tabs-right': side == 'right'
        });

        return (
            <TabContainer
                id={id}
                activeKey={activeKey}
                onSelect={onSelect}
                className={classes}
                style={style}>
                <div>
                    <Nav {...props} role="tablist">
                        {ElementChildren.map(children, this.renderTab)}
                    </Nav>
                    <TabContent animation={animation} unmountOnExit={unmountOnExit}>
                        {children}
                    </TabContent>
                </div>
            </TabContainer>
        );
    }
}

export { Tab } from './Tab';