import * as React from 'react';
import * as classNames from 'classnames';
import { Collapse } from '../Collapse';

interface PanelProps  {
    id?: string,
    className?: string,
    style?: React.CSSProperties,
    bsStyle?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary',
    collapsible?: boolean,
    onSelect?: Function,
    header?: React.ReactNode,
    footer?: React.ReactNode,
    defaultExpanded?: boolean,
    expanded?: boolean,
    eventKey?: any,
    headerRole?: string,
    panelRole?: string,

    // From Collapse.
    onEnter?: Function,
    onEntering?: Function,
    onEntered?: Function,
    onExit?: Function,
    onExiting?: Function,
    onExited?: Function,
}

interface PanelState  {
    expanded: boolean,
}


export class Panel extends React.Component<PanelProps, PanelState> {
    public static defaultProps = {
        defaultExpanded: false,
        bsStyle: 'default',
    }

    constructor(props: PanelProps, context?) {
        super(props, context);

        this.handleClickTitle = this.handleClickTitle.bind(this);

        const { defaultExpanded } = props;
        this.state = {
            expanded: !!defaultExpanded,
        };
    }

    handleClickTitle = (e) => {
        // FIXME: What the heck? This API is horrible. This needs to go away!
        e.persist();
        e.selected = true;

        if (this.props.onSelect) {
            this.props.onSelect(this.props.eventKey, e);
        } else {
            e.preventDefault();
        }

        if (e.selected) {
            this.setState({ expanded: !this.state.expanded });
        }
    }

    renderHeader(collapsible: boolean, header: React.ReactNode, id: string, role: string, expanded: boolean) {
        const titleClassName = 'panel-title';

        if (!collapsible) {
            if (!React.isValidElement<any>(header)) {
                return header;
            }

            return React.cloneElement(header, {
                className: classNames('panel-title', header.props.className),
            });
        }

        if (!React.isValidElement<any>(header)) {
            return (
                <h4 role="presentation" className={titleClassName}>
                    {this.renderAnchor(header, id, role, expanded)}
                </h4>
            );
        }

        return React.cloneElement(header, {
            className: classNames(titleClassName, header.props.className),
            children: this.renderAnchor(header.props.children, id, role, expanded),
        });
    }

    renderAnchor(header, id, role, expanded) {
        return (
            <a role={role}
                href={id && `#${id}`}
                onClick={this.handleClickTitle}
                aria-controls={id}
                aria-expanded={expanded}
                aria-selected={expanded}
                className={expanded ? null : 'collapsed' }>{header}</a>
        );
    }

    renderCollapsibleBody(id, expanded, role, children, animationHooks) {
        return (
            <Collapse in={expanded} {...animationHooks}>
                <div
                  id={id}
                  role={role}
                  className={'panel-collapse'}
                  aria-hidden={!expanded}>{this.renderBody(children)}</div>
            </Collapse>
        );
    }

    renderBody(rawChildren : React.ReactNode) {
        const children = [];
        let bodyChildren = [];

        const bodyClassName = 'panel-body';

        function maybeAddBody() {
            if (!bodyChildren.length) {
                return;
            }

            // Derive the key from the index here, since we need to make one up.
            children.push(
                <div key={children.length} className={bodyClassName}>
                    {bodyChildren}
                </div>
            );

            bodyChildren = [];
        }

        // Convert to array so we can re-use keys.
        React.Children.toArray(rawChildren).forEach(child => {
            if (React.isValidElement<any>(child) && child.props.fill) {
                maybeAddBody();
                // Remove the child's unknown `fill` prop.
                children.push(React.cloneElement(child, { fill: undefined }));
                return;
            }

            bodyChildren.push(child);
        });

        maybeAddBody();
        return children;
    }

    render() {
        const {
            collapsible,
            style,
            bsStyle,
            header,
            id,
            footer,
            headerRole,
            panelRole,
            className,
            children,
            expanded,
            onEnter,
            onEntering,
            onEntered,
            onExit,
            onExiting,
            onExited,
        } = this.props;

        const isExpanded = expanded !== null ? expanded : this.state.expanded;

        return (
          <div className={classNames('panel', `panel-${bsStyle}`, className)}
              style={style}
              id={collapsible ? null : id}>
              {header && (
                  <div className={'panel-heading'}>
                      {this.renderHeader(collapsible, header, id, headerRole, isExpanded)}
                  </div>
              )}

              {collapsible ?
                  this.renderCollapsibleBody(
                      id, isExpanded, panelRole, children, 
                      { onEnter, onEntering, onEntered, onExit, onExiting, onExited }
                  ) : this.renderBody(children)
              }

              {footer && (
                  <div className={'panel-footer'}>
                      {footer}
                  </div>
              )}
          </div>
        );
    }
}