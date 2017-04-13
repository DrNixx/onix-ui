import * as React from 'react';
import * as classNames from 'classnames';
import * as warning from 'warning';
import { TabContextType } from './ContextTypes';
import { TabContent } from './TabContent';
import { Fade } from '../../fx/Fade';
import { createChainedFunction } from '../../Functions';

export interface TabPaneProps {
    className?: string;
    /**
     * Uniquely identify the `<TabPane>` among its siblings.
     */
    eventKey: string | number,

    /**
     * Use animation when showing or hiding `<TabPane>`s. Use `false` to disable,
     * `true` to enable the default `<Fade>` animation or any `<Transition>`
     * component.
     */
    animation?: boolean | React.ReactType,

    /** @private **/
    id?: string,

    /** @private **/
    'aria-labelledby'?: string,

    /**
     * Transition onEnter callback when animation is not `false`
     */
    onEnter?: Function,

    /**
     * Transition onEntering callback when animation is not `false`
     */
    onEntering?: Function,

    /**
     * Transition onEntered callback when animation is not `false`
     */
    onEntered?: Function,

    /**
     * Transition onExit callback when animation is not `false`
     */
    onExit?: Function,

    /**
     * Transition onExiting callback when animation is not `false`
     */
    onExiting?: Function,

    /**
     * Transition onExited callback when animation is not `false`
     */
    onExited?: Function,

    /**
     * Unmount the tab (remove it from the DOM) when it is no longer visible
     */
    unmountOnExit?: Function,
}

export class TabPane extends React.Component<TabPaneProps, {}> {
    private in: boolean;

    private static contextTypes = {
        $bs_tabContainer: React.PropTypes.shape({
            getId: React.PropTypes.func,
            unmountOnExit: React.PropTypes.bool,
        }),
        $bs_tabContent: React.PropTypes.shape({
            bsClass: React.PropTypes.string,
            animation: React.PropTypes.oneOfType([
                React.PropTypes.bool, React.PropTypes.element,
            ]),
            activeKey: React.PropTypes.any,
            unmountOnExit: React.PropTypes.bool,
            onPaneEnter: React.PropTypes.func.isRequired,
            onPaneExited: React.PropTypes.func.isRequired,
            exiting: React.PropTypes.bool.isRequired,
        }),
    }

    private static childContextTypes = {
        $bs_tabContainer: React.PropTypes.oneOf([null]),
    }

    constructor(props: TabPaneProps, context: TabContextType) {
        super(props, context);

        this.handleEnter = this.handleEnter.bind(this);
        this.handleExited = this.handleExited.bind(this);

        this.in = false;
    }

    componentDidMount() {
        if (this.shouldBeIn()) {
            // In lieu of the action event firing.
            this.handleEnter();
        }
    }

    componentDidUpdate() {
        if (this.in) {
            if (!this.shouldBeIn()) {
                // We shouldn't be active any more. Notify the parent.
                this.handleExited();
            }
        } else if (this.shouldBeIn()) {
            // We are the active child. Notify the parent.
            this.handleEnter();
        }
    }

    componentWillUnmount() {
        if (this.in) {
            // In lieu of the action event firing.
            this.handleExited();
        }
    }

    handleEnter = () => {
        const { $bs_tabContent: tabContent } = this.context as TabContextType;
        if (!tabContent) {
            return;
        }

        this.in = tabContent.onPaneEnter(this, this.props.eventKey);
    }

    handleExited = () => {
        const { $bs_tabContent: tabContent } = this.context as TabContextType;
        if (!tabContent) {
            return;
        }

        tabContent.onPaneExited(this);
        this.in = false;
    }

    getAnimation = (): boolean | React.ReactType => {
        const { animation } = this.props;

        if (animation) {
            return animation;
        }

        const { $bs_tabContent: tabContent } = this.context as TabContextType;
        return tabContent && tabContent.animation;
    }

    isActive() {
        const { $bs_tabContent: tabContent } = this.context as TabContextType;
        const activeKey = tabContent && tabContent.activeKey;

        return this.props.eventKey === activeKey;
    }

    shouldBeIn() {
        return this.getAnimation() && this.isActive();
    }

    render() {
        const {
            children,
            eventKey,
            className,
            onEnter,
            onEntering,
            onEntered,
            onExit,
            onExiting,
            onExited,
            unmountOnExit: propsUnmountOnExit,
            ...props
        } = this.props;

        const elementProps = {
            id: props.id,
            'aria-labelledby': props['aria-labelledby']
        }

        const { $bs_tabContent: tabContent, $bs_tabContainer: tabContainer } = this.context as TabContextType;

        const active = this.isActive();
        const animated = this.getAnimation();

        const unmountOnExit = propsUnmountOnExit != null ?
        propsUnmountOnExit : tabContent && tabContent.unmountOnExit;

        if (!active && !animated && unmountOnExit) {
            return null;
        }

        const Transition = animated === true ? Fade : animated || null;

        const bsClass = tabContent ? 'tab-pane' : "";

        const classes = {
            [bsClass]: true,
            ['active']: active
        };

        if (tabContainer) {
            warning(!elementProps.id && !elementProps['aria-labelledby'],
                'In the context of a `<TabContainer>`, `<TabPanes>` are given ' +
                'generated `id` and `aria-labelledby` attributes for the sake of ' +
                'proper component accessibility. Any provided ones will be ignored. ' +
                'To control these attributes directly provide a `generateChildId` ' +
                'prop to the parent `<TabContainer>`.'
            );

            elementProps.id = tabContainer.getPaneId(eventKey);
            elementProps['aria-labelledby'] = tabContainer.getTabId(eventKey);
        }

        const pane = (
            <div {...elementProps}
                role="tabpanel"
                aria-hidden={!active}
                className={classNames(className, classes)}>{children}</div>
        );

        if (Transition) {
            const exiting = tabContent && tabContent.exiting;

            return (
                <Transition
                    in={active && !exiting}
                    onEnter={createChainedFunction(this.handleEnter, onEnter)}
                    onEntering={onEntering}
                    onEntered={onEntered}
                    onExit={onExit}
                    onExiting={onExiting}
                    onExited={createChainedFunction(this.handleExited, onExited)}
                    unmountOnExit={unmountOnExit}
                    >
                    {pane}
                </Transition>
            );
        }

        return pane;
    }


}