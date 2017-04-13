import * as React from 'react';
import * as classNames from 'classnames';
import { TabContextType, TabSelectHandler } from './ContextTypes';

const TAB = 'tab';
const PANE = 'pane';

interface TabContainerProps {
    id: string,

    className: string,

    style?: React.CSSProperties,
    
    /**
     * A function that takes an `eventKey` and `type` and returns a unique id for
     * child tab `<NavItem>`s and `<TabPane>`s. The function _must_ be a pure
     * function, meaning it should always return the _same_ id for the same set
     * of inputs. The default value requires that an `id` to be set for the
     * `<TabContainer>`.
     *
     * The `type` argument will either be `"tab"` or `"pane"`.
     *
     * @defaultValue (eventKey, type) => `${this.props.id}-${type}-${key}`
     */
    generateChildId?: Function,

    /**
     * A callback fired when a tab is selected.
     *
     * @controllable activeKey
     */
    onSelect?: TabSelectHandler,

    /**
     * The `eventKey` of the currently active tab.
     *
     * @controllable onSelect
     */
    activeKey?: string | number,
}

interface TabContainerState {
    activeKey: string | number;
}

export class TabContainer extends React.Component<TabContainerProps, TabContainerState> {
    private static childContextTypes = {
        $bs_tabContainer: React.PropTypes.shape({
            activeKey: React.PropTypes.any,
            onSelect: React.PropTypes.func.isRequired,
            getTabId: React.PropTypes.func.isRequired,
            getPaneId: React.PropTypes.func.isRequired,
        }),
    }

    constructor(props: TabContainerProps) {
        super(props);
        this.state = {
            activeKey: this.props.activeKey
        };
    }

    getId = (props: TabContainerProps) => {
        let error = null;
        if (!props.generateChildId) {
            error = props.id;
            if (!error) {
                error = new Error(
                    'In order to properly initialize Tabs in a way that is accessible ' +
                    'to assistive technologies (such as screen readers) an `id` or a ' +
                    '`generateChildId` prop to TabContainer is required'
                );
            }
        }

        return error;
    }

    private onSelect = (key: string | number) => {
        this.setState({activeKey: key});
    }

    getChildContext() {
        const { onSelect, generateChildId } = this.props;
        const { activeKey } = this.state;
        const id = this.getId(this.props);
        const getId = generateChildId || ((key, type) => (id ? `${id}-${type}-${key}` : null));

        const handler = onSelect || this.onSelect;

        return {
            $bs_tabContainer: {
                activeKey,
                onSelect: handler,
                getTabId: key => getId(key, TAB),
                getPaneId: key => getId(key, PANE),
            },
        };
    }

    render() {
        const { children, ...props } = this.props;

        delete props.generateChildId;
        delete props.onSelect;
        delete props.activeKey;

        return React.cloneElement(React.Children.only(children), props);
    }
}
