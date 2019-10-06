import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

class Welcome extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Container id="top-container" fluid={true}>
                <Row>
                    <Col id="inner-container">
                        <div>
                            <div id="welcome-text">
                                Welcome to Autobeats, {this.props.name}!
                                <p id="sub-text">
                                    Get started by choosing a playlist.
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Welcome;