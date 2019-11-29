import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Spotify from 'spotify-web-api-js';
import Coverflow from 'react-coverflow';

const spotifyWrapper = new Spotify();

class Welcome extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        if (parameters.access_token) {
            spotifyWrapper.setAccessToken(parameters.access_token);
        }

        this.state = {
            images: [],
        }
    }

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }
    
    componentDidMount() {
        this._isMounted = true;
        this.getNewReleases();
    }

    getNewReleases() {
        spotifyWrapper.getNewReleases({'limit': 10}, (err, res) => {
            let temp = [];
            for (let i = 0; i < res.albums.items.length; i++) {
                temp.push(res.albums.items[i].images[1].url);
            }
            if (this._isMounted) {
                this.setState({images: temp});
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
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
                            <img id='image' src={this.state.images[0]}/>
                            <img id='image' src={this.state.images[1]}/>
                            <img id='image' src={this.state.images[2]}/>
                            <img id='image' src={this.state.images[3]}/>
                            <img id='image' src={this.state.images[4]}/>
                            <img id='image' src={this.state.images[5]}/>
                            <img id='image' src={this.state.images[6]}/>
                            <img id='image' src={this.state.images[7]}/>
                            <img id='image' src={this.state.images[8]}/>
                            <img id='image' src={this.state.images[9]}/>
                        </Coverflow>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Welcome;