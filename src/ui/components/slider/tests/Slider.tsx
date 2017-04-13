import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Slider } from '../Slider';

export interface CustomizedSliderProps {
    className?: string;
}

interface CustomizedSliderState {
    value: number;
}

class CustomizedSlider extends React.Component<CustomizedSliderProps, CustomizedSliderState> {
    constructor(props: CustomizedSliderProps) {
        super(props);
        this.state = {
            value: 50,
        }
    }

    onSliderChange = (value) => {
        console.log(value);
        this.setState({
            value,
        });
    }
  
    onAfterChange = (value) => {
        console.log(value); //eslint-disable-line
    }
  
    render() {
        return (
            <Slider className={this.props.className} value={this.state.value}
                onChange={this.onSliderChange} onAfterChange={this.onAfterChange} />
        );
    }
}

export const CustomizedSliderTest = (props: CustomizedSliderProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(CustomizedSlider, props), container);
};