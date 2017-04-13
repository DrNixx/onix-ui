import * as React from 'react';
import Transition from 'react-overlays/lib/Transition';
import * as classNames from 'classnames';

interface FadeProps {
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
     * Run the fade in animation when the component mounts, if it is initially
     * shown
     */
    transitionAppear?: boolean,

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

export class Fade extends React.Component<FadeProps, {}> {
    public static defaultProps: FadeProps = {
        in: false,
        timeout: 300,
        unmountOnExit: false,
        transitionAppear: false,
    }
    
    constructor(props: FadeProps) {
        super(props);
    }

    render() {
        return (
            <Transition
                {...this.props}
                className={classNames(this.props.className, 'fade')}
                enteredClassName="in"
                enteringClassName="in"
            />
        );
    }
}