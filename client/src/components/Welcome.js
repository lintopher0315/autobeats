import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Coverflow from 'react-coverflow';

class Welcome extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Container id="top-container" fluid={true}>
                <Row>
                    <Col>
                        <Coverflow width="960" height="300"
                            displayQuantityOfSide={2}
                            infiniteScroll={true}
                            enableScroll={true}
                            clickable={true}
                            enableHeading={false}
                            currentFigureScale={1.0}
                            otherFigureScale={0.75}
                        >
                            <img src='https://i.scdn.co/image/107819f5dc557d5d0a4b216781c6ec1b2f3c5ab2'/>
                            <img src='https://i.scdn.co/image/a7b076ed5aa0746a21bc71ab7d2b6ed80dd3ebfe'/>
                            <img src='https://i.scdn.co/image/ff347680d9e62ccc144926377d4769b02a1024dc'/>
                            <img src='https://i.scdn.co/image/9f5fa5dfc5e084427eb4627a87bfafb2f200e3a4'/>
                            <img src='https://i.scdn.co/image/ab67616d00001e02a0caffda54afd0a65995bbab'/>
                            <img src='https://i.scdn.co/image/f131444c8cf34ed5bb411809e11891d7466a8039'/>
                            <img src='https://i.scdn.co/image/ab67616d00001e02a4d73b32e40487605c73cffe'/>
                            <img src='https://i.scdn.co/image/ab67616d00001e02466028b14d6d0023a862e50d'/>
                            <img src='https://i.scdn.co/image/2c4ced955e63d688e2aeb2152e5469be9571d927'/>
                            <img src='https://i.scdn.co/image/ab67616d00001e023a2178ae7cf4e68cad643f7e'/>
                        </Coverflow>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Welcome;