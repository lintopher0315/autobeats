import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Spotify from 'spotify-web-api-js';
import Coverflow from 'react-coverflow';
import { Card, Icon, Image, Statistic } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

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
            userID: this.props.userID,
            images: [],
            artistInfo: [],
            numPlays: 0,
            timePlayed: 0,
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
        this.getRandomArtists();
        //this.getStats();
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

    getRandomArtists() {
        spotifyWrapper.search('year:0000-9999', ['artist'], {'limit': 12, 'offset': Math.floor(Math.random() * 1000)}, (err, res) => {
            for (let i = 0; i < res.artists.items.length; i++) {
                if (this._isMounted) {
                    this.setState({artistInfo: [...this.state.artistInfo, res.artists.items[i]]});
                }
            }
        })
    }

    getStats() {
        fetch('http://autobeats.herokuapp.com/users/count', {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.userID,
                numPlays: 0,
                timePlayed: 0.0
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(json => {
            if (this._isMounted) {
                this.setState({numPlays: json.user.numPlays, timePlayed: json.user.timePlayed}, () => {
                    console.log(this.state.numPlays + " " + this.state.timePlayed);
                });
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        let list = this.state.artistInfo.map((info, i) => {
            if (info.images == null || info.images[2] == null) {
                return (
                    <Card id='artist-info' key={i} color='purple'>
                        <Card.Content>
                            <Card.Header id='artist-font'>{info.name}</Card.Header>
                            <Card.Meta>
                                <span className='date'>{info.genres.slice(0, 3).join(", ")}</span>
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <a>
                                <Icon name='user' />
                                {info.followers.total}
                            </a>
                            <a id='artist-pop'>
                                <Icon name='user outline'/>
                                {info.popularity}
                            </a>
                        </Card.Content>
                    </Card>
                )
            }
            else {
                return (
                    <Card id='artist-info' key={i} color='purple'>
                        <Card.Content>
                            <Image id='image' src={info.images[2].url} size='mini' floated='right' circular={true} wrapped ui={true} centered/>
                            <Card.Header id='artist-font'>{info.name}</Card.Header>
                            <Card.Meta>
                                <span className='date'>{info.genres.slice(0, 3).join(", ")}</span>
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <a>
                                <Icon name='user' />
                                {info.followers.total}
                            </a>
                            <a id='artist-pop'>
                                <Icon name='user outline'/>
                                {info.popularity}
                            </a>
                        </Card.Content>
                    </Card>
                )
            }
        })

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

                <Row>
                    <Col id='artist-col' lg={9}>
                        <Card.Group itemsPerRow={4}>
                            {list}
                        </Card.Group>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Welcome;