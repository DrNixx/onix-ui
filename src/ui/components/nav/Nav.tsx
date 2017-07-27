import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import * as classNames from 'classnames';
import * as keycode from 'keycode';
import * as warning from 'warning';
import ElementChildren from '../ElementChildren';
import { createChainedFunction } from 'onix-core/built/fn/utils/index';
import { TabSelectHandler } from './ContextTypes';

export interface NavProps  {
    className?: string,
    style?: React.CSSProperties,

    /**
     * Navigation style
     */
    bsStyle?: 'nav-tabs' | 'nav-pills',

    /**
     * Marks the NavItem with a matching `eventKey` as active. Has a
     * higher precedence over `activeHref`.
     */
    activeKey?: string | number,

    /**
     * Marks the child NavItem with a matching `href` prop as active.
     */
    activeHref?: string,

    /**
     * NavItems are be positioned vertically.
     */
    stacked?: boolean,

    justified?: boolean,

    /**
     * A callback fired when a NavItem is selected.
     *
     */
    onSelect?: TabSelectHandler,

    /**
     * ARIA role for the Nav, in the context of a TabContainer, the default will
     * be set to "tablist", but can be overridden by the Nav when set explicitly.
     *
     * When the role is set to "tablist" NavItem focus is managed according to
     * the ARIA authoring practices for tabs:
     * https://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#tabpanel
     */
    role?: string,

    /**
     * Apply styling an alignment for use in a Navbar. This prop will be set
     * automatically when the Nav is used inside a Navbar.
     */
    navbar?: boolean,

    /**
     * Float the Nav to the right. When `navbar` is `true` the appropriate
     * contextual classes are added as well.
     */
    pullRight?: boolean,

    /**
     * Float the Nav to the left. When `navbar` is `true` the appropriate
     * contextual classes are added as well.
     */
    pullLeft?: boolean,
}

export class Nav extends React.Component<NavProps, {}> {

    public static defaultProps: NavProps = {
        bsStyle: 'nav-tabs',
        justified: false,
        pullRight: false,
        pullLeft: false,
        stacked: false,
        navbar: false,
    }

    private static contextTypes = {
        $bs_navbar: PropTypes.shape({
            bsClass: PropTypes.string,
            onSelect: PropTypes.func,
        }),

        $bs_tabContainer: PropTypes.shape({
            activeKey: PropTypes.any,
            onSelect: PropTypes.func.isRequired,
            getTabId: PropTypes.func.isRequired,
            getPaneId: PropTypes.func.isRequired,
        }),
    };


    private _needsRefocus: boolean = false;

    constructor(props: NavProps) {
        super(props);
    }

    componentDidUpdate() {
        if (!this._needsRefocus) {
            return;
        }

        this._needsRefocus = false;

        const { children } = this.props;
        const { activeKey, activeHref } = this.getActiveProps();

        const activeChild = ElementChildren.find(children, child => (
            this.isActive(child, activeKey, activeHref)
        ));

        const childrenArray = ElementChildren.toArray(children);
        const activeChildIndex = childrenArray.indexOf(activeChild);

        const childNodes = ReactDOM.findDOMNode(this).children;
        const activeNode = childNodes && childNodes[activeChildIndex];

        if (!activeNode || !activeNode.firstChild) {
            return;
        }

        (activeNode.firstChild as HTMLElement).focus();
    }

    handleTabKeyDown = (onSelect: TabSelectHandler, event: React.KeyboardEvent<any>) => {
        let nextActiveChild;
        
        switch (event.keyCode) {
            case keycode.codes.left:
            case keycode.codes.up:
                nextActiveChild = this.getNextActiveChild(-1);
                break;
            case keycode.codes.right:
            case keycode.codes.down:
                nextActiveChild = this.getNextActiveChild(1);
                break;
            default:
                // It was a different key; don't handle this keypress.
                return;
        }

        event.preventDefault();

        if (onSelect && nextActiveChild && nextActiveChild.props.eventKey) {
            onSelect(nextActiveChild.props.eventKey, event);
        }

        this._needsRefocus = true;
    }

    getNextActiveChild(offset) {
        const { children } = this.props;
        const validChildren = ElementChildren.filter(children, child => {
            return child.props.eventKey && !child.props.disabled
        });

        const { activeKey, activeHref } = this.getActiveProps();
        const activeChild = ElementChildren.find(children, child => (
            this.isActive(child, activeKey, activeHref)
        ));

        // This assumes the active child is not disabled.
        const activeChildIndex = validChildren.indexOf(activeChild);
        if (activeChildIndex === -1) {
            // Something has gone wrong. Select the first valid child we can find.
            return validChildren[0];
        }

        let nextIndex = activeChildIndex + offset;
        const numValidChildren = validChildren.length;

        if (nextIndex >= numValidChildren) {
            nextIndex = 0;
        } else if (nextIndex < 0) {
            nextIndex = numValidChildren - 1;
        }

        return validChildren[nextIndex];
    }

    getActiveProps() {
        const tabContainer = this.context.$bs_tabContainer;

        if (tabContainer) {
            warning(this.props.activeKey == null && !this.props.activeHref,
                'Specifying a `<Nav>` `activeKey` or `activeHref` in the context of ' +
                'a `<TabContainer>` is not supported. Instead use `<TabContainer ' +
                `activeKey={${this.props.activeKey}} />\`.`
            );

            return tabContainer;
        }

        return this.props;
    }

    isActive = ({ props }, activeKey, activeHref) => {
        if (
            props.active ||
            activeKey != null && props.eventKey === activeKey ||
            activeHref && props.href === activeHref
        ) {
            return true;
        }

        return props.active;
    }

    getTabProps(child, tabContainer, navRole, active, onSelect: TabSelectHandler) {
        if (!tabContainer && navRole !== 'tablist') {
            // No tab props here.
            return null;
        }

        let {
            id,
            'aria-controls': controls,
            eventKey,
            role,
            onKeyDown,
            tabIndex,
        } = child.props;

        if (tabContainer) {
            warning(!id && !controls,
                'In the context of a `<TabContainer>`, `<NavItem>`s are given ' +
                'generated `id` and `aria-controls` attributes for the sake of ' +
                'proper component accessibility. Any provided ones will be ignored. ' +
                'To control these attributes directly, provide a `generateChildId` ' +
                'prop to the parent `<TabContainer>`.'
            );

            id = tabContainer.getTabId(eventKey);
            controls = tabContainer.getPaneId(eventKey);
        }

        if (navRole === 'tablist') {
            role = role || 'tab';
            onKeyDown = createChainedFunction(
                event => this.handleTabKeyDown(onSelect, event), onKeyDown
            );
            tabIndex = active ? tabIndex : -1;
        }

        return {
            id,
            role,
            onKeyDown,
            'aria-controls': controls,
            tabIndex,
        };
    }

    render() {
        const {
            bsStyle,
            stacked,
            justified,
            onSelect,
            role: propsRole,
            navbar: propsNavbar,
            pullRight,
            pullLeft,
            className,
            children,
            ...propsEx
        } = this.props;

        const tabContainer = this.context.$bs_tabContainer;
        const role = propsRole || (tabContainer ? 'tablist' : null);

        const { activeKey, activeHref } = this.getActiveProps();
        const { activeKey: ak, activeHref: ar, ...props } = propsEx;
        //delete props.activeKey; // Accessed via this.getActiveProps().
        //delete props.activeHref; // Accessed via this.getActiveProps().

        const classes = {
            ['nav']: true,
            [bsStyle]: true,
            ['nav-stacked']: stacked,
            ['nav-justified']: justified,
        };

        const navbar = propsNavbar != null ? propsNavbar : this.context.$bs_navbar;
        let pullLeftClassName;
        let pullRightClassName;

        if (navbar) {
            classes['navbar-nav'] = true;
            pullRightClassName = 'navbar-right';
            pullLeftClassName = 'navbar-left';
        } else {
            pullRightClassName = 'pull-right';
            pullLeftClassName = 'pull-left';
        }

        classes[pullRightClassName] = pullRight;
        classes[pullLeftClassName] = pullLeft;

        const mxClasses = classNames(className, classes);

        return (
            <ul
                {...props}
                role={role}
                className={mxClasses}>
                    {ElementChildren.map(children, child => {
                        const active = this.isActive(child, activeKey, activeHref);
                        const childOnSelect = createChainedFunction(
                            child.props.onSelect,
                            onSelect,
                            navbar && navbar.onSelect,
                            tabContainer && tabContainer.onSelect
                        );

                        return React.cloneElement(child, {
                            ...this.getTabProps(
                                child, tabContainer, role, active, childOnSelect
                            ),
                            active,
                            activeKey,
                            activeHref,
                            onSelect: childOnSelect,
                        });
                    })}
            </ul>
        );
    }
}
