import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

const spotifyWrapper = new Spotify();

class Home extends Component {

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        if (parameters.access_token) {
            spotifyWrapper.setAccessToken(parameters.access_token);
        }

        this.state = {
            verified: parameters.access_token ? true : false,
            playlistNames: [],
        }
    }

    getPlaylists() {
        spotifyWrapper.getUserPlaylists()
            .then((res) => {
                let playlistInfo = res;
                this.setState({playlistNames: []});
                for (let i = 0; i < playlistInfo.items.length; i++) {
                    this.setState({playlistNames: [...this.state.playlistNames, playlistInfo.items[i].name]});
                }
            })
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

    render() {
        this.getPlaylists();
        return (
            <div>
                {this.state.verified ? (
                    <p>{this.state.playlistNames}</p>
                ) : (
                    <p>Not verified</p>
                )}
            </div>
        );
    }
}

export default Home;