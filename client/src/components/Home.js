import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from 'react-sidebar';

import Container from './Container';

const spotifyWrapper = new Spotify();

class Home extends Component {

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        if (parameters.access_token) {
            spotifyWrapper.setAccessToken(parameters.access_token);
        }

        this.state = {
            params: parameters.access_token,
            refresh: parameters.refresh_token,
            verified: parameters.access_token ? true : false,
            playlistNames: [],
            displayName: "",
        }
    }

    getPlaylists() {
        spotifyWrapper.getUserPlaylists()
            .then((res) => {
                let playlistInfo = res;
                this.setState({playlistNames: []});
                for (let i = 0; i < playlistInfo.items.length; i++) {
                    this.setState({playlistNames: [...this.state.playlistNames, {"name": playlistInfo.items[i].name, "id": playlistInfo.items[i].id}]});
                }
            })
    }

    getDisplayName() {
        spotifyWrapper.getMe()
            .then((res) => {
                this.setState({displayName: res.display_name});
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

    componentDidMount() {
        this.getPlaylists();
        this.getDisplayName();
    }

    render() {
        return (
            <div id="Home">
                <Sidebar
                    sidebar={
                        <div>
                            <p id="name">autobeats</p>
                            <Link to={{pathname: "/home/userplaylists", hash: this.props.location.hash}}>
                                <Button id="side" variant="dark">Your Playlists</Button>
                            </Link>
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
                                
                                <Nav.Link className="header-bt">
                                    <Link to={{pathname: '/home', hash: this.props.location.hash}}>
                                        <img src={require("../res/rsz_icons8-home-50.png")}/>
                                    </Link>
                                </Nav.Link>
                                
                                <Nav.Link className="header-bt"><img src={require("../res/rsz_icons8-cat-profile-50.png")}/></Nav.Link>
                                <Nav.Link className="header-bt"><img src={require("../res/rsz_icons8-settings-50.png")}/></Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>

                    <Container name={this.state.displayName} playlists={this.state.playlistNames} location={this.props.location} />
                </div>
            </div>
        );
    }
}

export default Home;