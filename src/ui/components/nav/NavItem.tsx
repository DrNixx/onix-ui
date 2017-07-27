import * as React from 'react';
import * as classNames from 'classnames';
import { createChainedFunction } from 'onix-core';
import { SafeAnchor } from '../SafeAnchor';
import { TabSelectHandler } from './ContextTypes';

export interface NavItemProps  {
    className?: string,
    style?: React.CSSProperties,
    active?: boolean,
    disabled?: boolean,
    role?: string,
    href?: string,
    onClick?: Function,
    onSelect?: TabSelectHandler,
    eventKey?: string | number,
    activeKey?: string | number,
    activeHref?: string,
}


export class NavItem extends React.Component<NavItemProps, {}> {
    public static defaultProps = {
        active: false,
        disabled: false
    }

    constructor(props: NavItemProps, context) {
        super(props, context);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e) => {
        if (this.props.onSelect) {
            e.preventDefault();

            if (!this.props.disabled) {
                this.props.onSelect(this.props.eventKey, e);
            }
        }
    }

    render() {
        const { active, disabled, onClick, className, style, onSelect, eventKey, activeKey, activeHref, role, ...props } = this.props;
        let arole = role;

        if (!arole) {
            if (props.href === '#') {
                arole = 'button';
            }
        } else if (arole === 'tab') {
            props['aria-selected'] = active;
        }

        const handler = createChainedFunction(onClick, this.handleClick);

        return (
            <li role="presentation"
                className={classNames(className, { active, disabled })}
                style={style}>
                <SafeAnchor
                    {...props}
                    role={arole}
                    disabled={disabled}
                    onClick={handler} />
            </li>
        );
    }
}