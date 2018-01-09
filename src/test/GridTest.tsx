import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Row, Col } from '../index';

export interface GridTestProps {

}

class GridTestClass extends React.Component<GridTestProps, {}> {
    constructor(props: GridTestProps) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <Row>
                    <Col xs={0}>1 of 3</Col>
                    <Col xs={0}>2 of 3</Col>
                    <Col xs={0}>3 of 3</Col>
                </Row>

                <Row>
                    <Col xs={0}>1 of 3</Col>
                    <Col xs={6}>2 of 3 (wider)</Col>
                    <Col xs={0}>3 of 3</Col>
                </Row>

                <Row>
                    <Col xs={0} lg={2}>1 of 3</Col>
                    <Col md="auto">Variable width content</Col>
                    <Col xs={0} lg={2}>3 of 3</Col>
                </Row>

                <Row>
                    <Col xs={0}>First, but unordered</Col>
                    <Col xs={0} xsOrder={12}>Second, but last</Col>
                    <Col xs={0} xsOrder={1}>Third, but first</Col>
                </Row>
            </div>
        );
    }
}

export const GridTest = (props: GridTestProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(GridTestClass, props), container, () => {});
};
