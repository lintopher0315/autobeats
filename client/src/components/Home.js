import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import { Navbar, Nav, Button, Image } from 'react-bootstrap';
import Sidebar from 'react-sidebar';

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
            <div id="Home">
                <Sidebar
                    sidebar={
                        <div>
                            <p id="name">autobeats</p>
                            <Button id="side" variant="dark">Your Playlists</Button>
                            <Button id="side" variant="dark">Public Playlists</Button>
                            <Button id="side" variant="dark">Recently Played</Button>
                        </div>
                    }
                    docked={true}
                    styles={{sidebar: {
                        background: 'linear-gradient(to right, #374254, #465773)',
                        fontFamily: 'Exo',
                        width: '200px',
                        textAlign: 'center',
                        opacity: 0.75
                        }
                    }}
                >
                    
                </Sidebar>
                <div id="page-wrap">
                    <Navbar id="header" variant="dark" expand="lg">
                        <Navbar.Brand ></Navbar.Brand>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ml-auto">
                                <Nav.Link><img src={require("../res/rsz_icons8-home-50.png")}/></Nav.Link>
                                <Nav.Link><img src={require("../res/rsz_icons8-cat-profile-50.png")}/></Nav.Link>
                                <Nav.Link><img src={require("../res/rsz_icons8-settings-50.png")}/></Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    {this.state.verified ? (
                        <p>{this.state.playlistNames}</p>
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
        );
    }
}

export default Home;