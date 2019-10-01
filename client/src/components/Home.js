import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import { Navbar, Nav } from 'react-bootstrap';
import Sidebar from './Sidebar.js';
import "./Sidebar.css";

const spotifyWrapper = new Spotify();

class Home extends Component {

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        const content= [
            {
                icon: 'icon-class-name',
                label: 'Label of Item',
            },
            {
                icon: 'icon-class-name',
                label: 'Second Item'
            }
        ];

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
                <Sidebar pageWrapId={"page-wrap"} outerContainerId={"Home"} />
                <div id="page-wrap">
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand ></Navbar.Brand>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ml-auto">
                                <Nav.Link>Home</Nav.Link>
                                <Nav.Link>Playlists</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    {this.state.verified ? (
                        <p>{this.state.playlistNames}</p>
                    ) : (
                        <p>Not verified</p>
                    )}
                </div>
            </div>
        );
    }
}

export default Home;