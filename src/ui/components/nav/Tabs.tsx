import * as React from 'react';
import * as classNames from 'classnames';
import { TabContainer } from './TabContainer';
import { TabContent } from './TabContent';
import { Nav } from './Nav';
import { NavItem } from './NavItem';
import ElementChildren from '../ElementChildren'
import { TabSelectHandler } from './ContextTypes';

export interface TabsProps  {
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

    triangle?: boolean,

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
        triangle: false,
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
            triangle,
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
            'nav-tabs-linetriangle': triangle,
            'nav-tabs-simple': !triangle,
            'nav-tabs-left': side == 'left',
            'nav-tabs-right': side == 'right'
        });

        return (
            <TabContainer
                id={id}
                activeKey={activeKey}
                onSelect={onSelect}
                style={style}>
                <div>
                    <Nav className={classes} {...props} role="tablist">
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