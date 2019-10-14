import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import SpotifyPlayer from 'react-spotify-web-playback';

const spotifyWrapper = new Spotify();

class Player extends Component {

    constructor(props) {
        super(props);

        if (this.props.location.state.params) {
            spotifyWrapper.setAccessToken(this.props.location.state.params);
        }

        this.state = {
            id: this.props.location.state.id,
            params: this.props.location.state.params,
            tracks: []
        }
    }

    getTracks() {
        spotifyWrapper.getPlaylistTracks(this.state.id)
            .then((res) => {
                console.log(res);
                for (let i = 0; i < res.items.length; i++) {
                    this.setState({tracks: [...this.state.tracks, res.items[i].track.uri]});
                }
            })
    }

    componentDidMount() {
        this.getTracks();
    }

    render() {
        return (
            <div>
                <SpotifyPlayer
                    token={this.state.params}
                    uris={this.state.tracks}
                />
            </div>
        );
    }
}

export default Player;