import * as React from 'react';
import * as classNames from 'classnames';
import ElementChildren from '../ElementChildren';
import { createChainedFunction } from '../../Functions';

export interface PanelGroupProps  {
    className?: string,
    style?: React.CSSProperties,
    accordion?: boolean,
    activeKey?: any,
    defaultActiveKey?: any,
    onSelect?: Function,
    role?: string,
}

export interface PanelGroupState {
    activeKey: any,
}

export class PanelGroup extends React.Component<PanelGroupProps, PanelGroupState> {
    public static defaultProps = {
        accordion: false,
    }

    constructor(props: PanelGroupProps, context?) {
        super(props, context);

        this.handleSelect = this.handleSelect.bind(this);

        this.state = {
            activeKey: props.defaultActiveKey,
        };
    }

    handleSelect(key, e: React.SyntheticEvent<any>) {
        e.preventDefault();

        if (this.props.onSelect) {
            this.props.onSelect(key, e);
        }

        if (this.state.activeKey === key) {
            key = null;
        }

        this.setState({ activeKey: key });
    }

    render() {
        const {
            accordion,
            activeKey: propsActiveKey,
            defaultActiveKey,
            className,
            onSelect,
            children,
            ...props
        } = this.props;

        let activeKey;
        if (accordion) {
            activeKey = propsActiveKey != null ? propsActiveKey : this.state.activeKey;
            props.role = props.role || 'tablist';
        }

        const classes = classNames('panel-group', className)

        return (
            <div className={classes} {...props}>
                {ElementChildren.map(children, child => {
                    let childProps = {
                        bsStyle: child.props.bsStyle,
                    };

                    if (accordion) {
                        childProps = {
                            ...childProps,
                            headerRole: 'tab',
                            panelRole: 'tabpanel',
                            collapsible: true,
                            expanded: child.props.eventKey === activeKey,
                            onSelect: createChainedFunction(
                                this.handleSelect, child.props.onSelect
                            )
                        };
                    }

                    return React.cloneElement(child, childProps);
                })}
            </div>
        );
    }
}