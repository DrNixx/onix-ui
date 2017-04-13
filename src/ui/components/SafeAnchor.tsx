import * as React from 'react';
import * as classNames from 'classnames';

interface SafeAnchorProps  {
    className?: string,
    style?: React.CSSProperties,
    href?: string,
    onClick?: (event) => void,
    disabled?: boolean,
    role?: string,
    tabIndex?: number | string,
    componentClass?: React.ReactType,
}

function isTrivialHref(href) {
    return !href || href.trim() === '#';
}

export class SafeAnchor extends React.Component<SafeAnchorProps, {}> {
    public static defaultProps: SafeAnchorProps = {
        componentClass: 'a'
    }
    
    constructor(props: SafeAnchorProps, context) {
        super(props, context);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (event: React.SyntheticEvent<any>) => {
        const { disabled, href, onClick } = this.props;

        if (disabled || isTrivialHref(href)) {
            event.preventDefault();
        }

        if (disabled) {
            event.stopPropagation();
            return;
        }

        if (onClick) {
            onClick(event);
        }
    }

    render() {
        const { componentClass: Component, disabled, ...props_out } = this.props;
        let { role, href, tabIndex, style, ...props} = props_out;
        
        if (isTrivialHref(href)) {
            role = role || 'button';
            // we want to make sure there is a href attribute on the node
            // otherwise, the cursor incorrectly styled (except with role='button')
            href = href || '#';
        }

        if (disabled) {
            tabIndex = -1;
            style = { pointerEvents: 'none', ...style };
        }

        const elem_prop = {
            ...props_out, 
            role, 
            href, 
            tabIndex, 
            style 
        }

        return (
        <Component
            { ...elem_prop }
            onClick={this.handleClick} />
        );    
    }
}