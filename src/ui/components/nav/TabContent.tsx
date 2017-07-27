import * as React from 'react';
import { PropTypes } from 'prop-types';
import * as classNames from 'classnames';
import { TabContextType } from './ContextTypes';

export interface TabContentProps {
    className?: string,

    componentClass?: React.ReactType,

    /**
     * Sets a default animation strategy for all children `<TabPane>`s. Use
     * `false` to disable, `true` to enable the default `<Fade>` animation or any
     * `<Transition>` component.
     */
    animation?: boolean | React.ReactType,

    /**
     * Unmount tabs (remove it from the DOM) when they are no longer visible
     */
    unmountOnExit?: boolean,
}

export interface TabContentState {
    activeKey: string | number,
    activeChild: any
}

export class TabContent extends React.Component<TabContentProps, TabContentState> {
    private isUnmounted = false;

    private static contextTypes = {
        $bs_tabContainer: PropTypes.shape({
            activeKey: PropTypes.any,
        }),
    }

    private static childContextTypes = {
        $bs_tabContent: PropTypes.shape({
            bsClass: PropTypes.string,
            animation: PropTypes.oneOfType([
                PropTypes.bool, PropTypes.element,
            ]),
            activeKey: PropTypes.any,
            unmountOnExit: PropTypes.bool,
            onPaneEnter: PropTypes.func.isRequired,
            onPaneExited: PropTypes.func.isRequired,
            exiting: PropTypes.bool.isRequired,
        }),
    }

    public static defaultProps: TabContentProps = {
        componentClass: 'div',
        animation: true,
        unmountOnExit: false,
    }

    constructor(props: TabContentProps, context: TabContextType) {
        super(props, context);

        this.handlePaneEnter = this.handlePaneEnter.bind(this);
        this.handlePaneExited = this.handlePaneExited.bind(this);

        // Active entries in state will be `null` unless `animation` is set. Need
        // to track active child in case keys swap and the active child changes
        // but the active key does not.
        this.state = {
            activeKey: null,
            activeChild: null,
        };
    }

    getChildContext(): TabContextType {
        const { animation, unmountOnExit } = this.props;

        const stateActiveKey = this.state.activeKey;
        const containerActiveKey = this.getContainerActiveKey();

        const activeKey =
            stateActiveKey != null ? stateActiveKey : containerActiveKey;
        const exiting =
            stateActiveKey != null && stateActiveKey !== containerActiveKey;

        return {
            $bs_tabContent: {
                animation,
                activeKey,
                unmountOnExit,
                onPaneEnter: this.handlePaneEnter,
                onPaneExited: this.handlePaneExited,
                exiting,
            },
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.animation && this.state.activeChild) {
            this.setState({ activeKey: null, activeChild: null });
        }
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    handlePaneEnter = (child, childKey) => {
        if (!this.props.animation) {
            return false;
        }

        // It's possible that this child should be transitioning out.
        if (childKey !== this.getContainerActiveKey()) {
            return false;
        }

        this.setState({
            activeKey: childKey,
            activeChild: child,
        });

        return true;
    }

    handlePaneExited = (child) => {
        // This might happen as everything is unmounting.
        if (this.isUnmounted) {
            return;
        }

        this.setState(({ activeChild }) => {
            if (activeChild !== child) {
                return null;
            }

            return {
                activeKey: null,
                activeChild: null,
            };
        });
    }

    getContainerActiveKey = () => {
        const { $bs_tabContainer: tabContainer } = this.context as TabContextType;
        return tabContainer && tabContainer.activeKey;
    }

    render() {
        const { componentClass: Component, className, ...props } = this.props;
        const { animation, unmountOnExit, ...otherProps } = props;

        return (
            <Component
                {...otherProps}
                className={classNames(className, 'tab-content')}
            />
        );
    }
}