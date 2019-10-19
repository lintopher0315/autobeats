import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import { Button, Container, Row, Col } from 'react-bootstrap';

const spotifyWrapper = new Spotify();

class Player extends Component {

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        if (parameters.access_token) {
            spotifyWrapper.setAccessToken(parameters.access_token);
        }

        this.state = {
            id: this.props.location.state.id,
            params: parameters.access_token,
            tracks: [],

            deviceId: "",
            trackName: "",
            artistName: "",
            albumName: "",
            isPlaying: false,
            position: 0,
            duration: 0,
            isCorrectPlaylist: false,
        }

        this.playerCheckInterval = null;
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
        this.getTracks();
        this.handlePlayer();
    }

    handlePlayer() {
        this.playerCheckInterval = setInterval(() => this.checkPlayer(), 1000);
    }

    checkPlayer() {
        if (window.Spotify !== null) {
            clearInterval(this.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: "Spotify Player",
                getOAuthToken: callback => { callback(this.state.params); },
            });
            this.onStateChange();
            this.player.connect();
        }
    }

    onStateChange() {
        this.player.on('initialization_error', e => { console.error(e) });
        this.player.on('authentication_error', e => { console.error(e) });
        this.player.on('account_error', e => { console.error(e) });
        this.player.on('playback_error', e => { console.error(e) });

        this.player.on('player_state_changed', state => this.updateInfo(state));

        this.player.on('ready', async data => {
            let { device_id } = data;
            console.log("ready");
            await this.setState({ deviceId: device_id });
            this.initiatePlayback();
        })
    }

    updateInfo(state) {
        if (state !== null) {
            const {
                current_track: currentTrack,
                position,
                duration,
            } = state.track_window;
            const trackName = currentTrack.name;
            const albumName = currentTrack.album.name;
            const artistName = currentTrack. artists
                .map(artist => artist.name)
                .join(", ");
            const isPlaying = !state.paused;
            this.setState({position, duration, trackName, albumName, artistName, isPlaying});
        }
    }

    initiatePlayback() {
        fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
                authorization: `Bearer ${this.state.params}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "device_ids": [ this.state.deviceId ],
                "play": false,
            })
        })
    }

    setPlaylist() {
        spotifyWrapper.play({"uris": this.state.tracks})
            .then((res) => {
                console.log(res);
                this.setState({isCorrectPlaylist: true});
            })
    }

    getTracks() {
        spotifyWrapper.getPlaylistTracks(this.state.id)
            .then((res) => {
                for (let i = 0; i < res.items.length; i++) {
                    this.setState({tracks: [...this.state.tracks, res.items[i].track.uri]});
                }
            })
    }

    togglePlay() {
        if (!this.state.isCorrectPlaylist) {
            this.setPlaylist();
        }
        this.player.togglePlay().then(() => {
            console.log("toggled");
        });
    }

    prevTrack() {
        this.player.previousTrack().then(() => {
            console.log("prev track");
        });
    }

    nextTrack() {
        this.player.nextTrack().then(() => {
            console.log("next track");
        });
    }

    render() {
        return (
            <Container id="control" fluid={true}>
                <Row>
                    <Col>
                        <div id="info">
                            {this.state.isCorrectPlaylist ? (
                                <div>
                                    <div id="track-title">
                                        {this.state.trackName}
                                    </div>
                                    <div id="artist-title">
                                        {this.state.artistName}
                                    </div>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </Col>

                    <Col>
                        <Button id="control-button" onClick={() => this.prevTrack()}>
                            <img src={require("../res/previous_button.png")}/>
                        </Button>
                        <Button id="control-button" onClick={() => this.togglePlay()}>
                            <img src={require("../res/play_button.png")}/>
                        </Button>
                        <Button id="control-button" onClick={() => this.nextTrack()}>
                            <img src={require("../res/next_button.png")}/>
                        </Button>
                    </Col>

                    <Col>

                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Player;