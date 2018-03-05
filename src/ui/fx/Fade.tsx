import * as React from 'react';
import Transition, { ENTERED, ENTERING } from 'react-transition-group/Transition';
import * as classNames from 'classnames';

export interface FadeProps {
    /**
     * Component class name
     */
    className?: string,

    /**
     * Show the component; triggers the fade in or fade out animation
     */
    in?: boolean,

    /**
     * Unmount the component (remove it from the DOM) when it is faded out
     */
    unmountOnExit?: boolean,

    /**
     * Duration of the fade animation in milliseconds, to ensure that finishing
     * callbacks are fired even if the original browser transition end events are
     * canceled
     */
    timeout?: number,

    /**
     * Callback fired before the component fades in
     */
    onEnter?: Function,
    /**
     * Callback fired after the component starts to fade in
     */
    onEntering?: Function,
    /**
     * Callback fired after the has component faded in
     */
    onEntered?: Function,
    /**
     * Callback fired before the component fades out
     */
    onExit?: Function,
    /**
     * Callback fired after the component starts to fade out
     */
    onExiting?: Function,
    /**
     * Callback fired after the component has faded out
     */
    onExited?: Function,
}

export interface FadeState {
    in: boolean
}

export class Fade extends React.Component<FadeProps, {}> {
    public static defaultProps: FadeProps = {
        in: false,
        timeout: 300,
        unmountOnExit: false,
    }
    
    constructor(props: FadeProps) {
        super(props);

        this.state = {
            in: props.in
        }
    }

    render() {

        const className = classNames(
            this.props.className, 
            'fade',
            {
                ['show']: this.props.in
            }
        );

        return (
            <Transition
                {...this.props}
                className={className}
            />
        );
    }
}