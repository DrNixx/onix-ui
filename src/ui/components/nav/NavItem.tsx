import * as React from 'react';
import * as classNames from 'classnames';
import { createChainedFunction } from '../../Functions';
import { SafeAnchor } from '../SafeAnchor';
import { TabSelectHandler } from './ContextTypes';

interface NavItemProps  {
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
        const { active, disabled, onClick, className, style, ...props } = this.props;

        delete props.onSelect;
        delete props.eventKey;

        // These are injected down by `<Nav>` for building `<SubNav>`s.
        delete props.activeKey;
        delete props.activeHref;

        if (!props.role) {
            if (props.href === '#') {
                props.role = 'button';
            }
        } else if (props.role === 'tab') {
            props['aria-selected'] = active;
        }

        const handler = createChainedFunction(onClick, this.handleClick);

        return (
            <li role="presentation"
                className={classNames(className, { active, disabled })}
                style={style}>
                <SafeAnchor
                    {...props}
                    disabled={disabled}
                    onClick={handler} />
            </li>
        );
    }
}