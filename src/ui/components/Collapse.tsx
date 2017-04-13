import * as React from 'react';
import * as classNames from 'classnames';
import * as css from 'dom-helpers/style';
import Transition from 'react-overlays/lib/Transition';
import { capitalize } from '../../fn/String';
import { intVal } from '../../fn/Number';
import { createChainedFunction } from '../Functions';

const MARGINS = {
  height: ['marginTop', 'marginBottom'],
  width: ['marginLeft', 'marginRight'],
};

// reading a dimension prop will cause the browser to recalculate,
// which will let our animations work
function triggerBrowserReflow(node) {
    node.offsetHeight; // eslint-disable-line no-unused-expressions
}

function getDimensionValue(dimension, elem) {
    let value = elem[`offset${capitalize(dimension)}`];
    let margins = MARGINS[dimension];

    return (value + intVal(css(elem, margins[0])) + intVal(css(elem, margins[1])));
}

interface CollapseProps  {
    className?: string,
    style?: React.CSSProperties,

    /**
     * Show the component; triggers the expand or collapse animation
     */
    in?: boolean,

    /**
     * Unmount the component (remove it from the DOM) when it is collapsed
     */
    unmountOnExit?: boolean,

    /**
     * Run the expand animation when the component mounts, if it is initially
     * shown
     */
    transitionAppear?: boolean,

    /**
     * Duration of the collapse animation in milliseconds, to ensure that
     * finishing callbacks are fired even if the original browser transition end
     * events are canceled
     */
    timeout?: number,

    /**
     * Callback fired before the component expands
     */
    onEnter?: Function
    /**
     * Callback fired after the component starts to expand
     */
    onEntering?: Function,
    /**
     * Callback fired after the component has expanded
     */
    onEntered?: Function,
    /**
     * Callback fired before the component collapses
     */
    onExit?: Function,
    /**
     * Callback fired after the component starts to collapse
     */
    onExiting?: Function,
    /**
     * Callback fired after the component has collapsed
     */
    onExited?: Function

    /**
     * The dimension used when collapsing, or a function that returns the
     * dimension
     *
     * _Note: Bootstrap only partially supports 'width'!
     * You will need to supply your own CSS animation for the `.width` CSS class._
     */
    dimension?: 'height' | 'width' | Function,

    /**
     * Function that returns the height or width of the animating DOM node
     *
     * Allows for providing some custom logic for how much the Collapse component
     * should animate in its specified dimension. Called with the current
     * dimension prop value and the DOM node.
     */
    getDimensionValue?: Function,

    /**
     * ARIA role of collapsible element
     */
    role?: string,
}

interface CollapseState {
    activeKey: any,
}

export class Collapse extends React.Component<CollapseProps, CollapseState> {
    public static defaultProps: CollapseProps = {
        in: false,
        timeout: 300,
        unmountOnExit: false,
        transitionAppear: false,

        dimension: 'height',
        getDimensionValue,
    }

    constructor(props: CollapseProps, context?) {
        super(props, context);

        this.handleEnter = this.handleEnter.bind(this);
        this.handleEntering = this.handleEntering.bind(this);
        this.handleEntered = this.handleEntered.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.handleExiting = this.handleExiting.bind(this);
    }

    /* -- Expanding -- */
    private handleEnter = (elem) => {
        const dimension = this._dimension();
        elem.style[dimension] = '0';
    }

    private handleEntering = (elem) => {
        const dimension = this._dimension();
        elem.style[dimension] = this._getScrollDimensionValue(elem, dimension);
    }

    private handleEntered = (elem) => {
        const dimension = this._dimension();
        elem.style[dimension] = null;
    }

    /* -- Collapsing -- */
    private handleExit = (elem) => {
        const dimension = this._dimension();
        elem.style[dimension] = this.props.getDimensionValue(dimension, elem) + 'px';
        triggerBrowserReflow(elem);
    }

    handleExiting = (elem) => {
        const dimension = this._dimension();
        elem.style[dimension] = '0';
    }

    _dimension() {
        return typeof this.props.dimension === 'function'
            ? this.props.dimension()
            : this.props.dimension;
    }

    // for testing
    _getScrollDimensionValue(elem, dimension) {
        return `${elem[`scroll${capitalize(dimension)}`]}px`;
    }

    render() {
        const {
        onEnter, onEntering, onEntered, onExit, onExiting, className, ...props
        } = this.props;

        delete props.dimension;
        delete props.getDimensionValue;

        const handleEnter = createChainedFunction(this.handleEnter, onEnter);
        const handleEntering = createChainedFunction(this.handleEntering, onEntering);
        const handleEntered = createChainedFunction(this.handleEntered, onEntered);
        const handleExit = createChainedFunction(this.handleExit, onExit);
        const handleExiting = createChainedFunction(this.handleExiting, onExiting);

        const classes = {
            width: this._dimension() === 'width',
        };

        return (
            <Transition
                {...props}
                aria-expanded={props.role ? props.in : null}
                className={classNames(className, classes)}
                exitedClassName="collapse"
                exitingClassName="collapsing"
                enteredClassName="collapse in"
                enteringClassName="collapsing"
                onEnter={handleEnter}
                onEntering={handleEntering}
                onEntered={handleEntered}
                onExit={handleExit}
                onExiting={handleExiting} />
        );
    }
}