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
            userID: parameters.userID,
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
                            <div id="side-label">LIBRARY</div>
                            <Link to={{pathname: "/home/userplaylists", hash: this.props.location.hash}}>
                                <Button id="side" variant="dark" style={{'marginTop': '15px'}}><img id='side-icon' src={require("../res/invert_headphones.png")}/>Your Playlists</Button>
                            </Link>
                            <Link to={{pathname: "/home/toptracks", hash: this.props.location.hash}}>
                                <Button id="side" variant="dark"><img id='side-icon' src={require("../res/invert_trophy.png")}/>Your Top Tracks</Button>
                            </Link>

                            <div id="side-label" style={{'paddingTop': '45px'}}>EXPLORE</div>
                            <Link to={{pathname: "/home/categories", hash: this.props.location.hash}}>
                                <Button id="side" variant="dark" style={{'marginTop': '40px'}}><img id='side-icon' src={require("../res/invert_stack.png")}/>Categories</Button>
                            </Link>
                            <Link to={{pathname: "/home/featuredplaylists", hash: this.props.location.hash}}>
                                <Button id="side" variant="dark"><img id='side-icon' src={require("../res/invert_fire.png")}/>Featured</Button>
                            </Link>
                            <Link to={{pathname: "/home/newreleases", hash: this.props.location.hash}}>
                                <Button id="side" variant="dark"><img id='side-icon' src={require("../res/invert_rocket.png")}/>New Releases</Button>
                            </Link>
                            <Link to={{pathname: "/home/recommendations", hash: this.props.location.hash}}>
                                <Button id="side" variant="dark"><img id='side-icon' src={require("../res/invert_star.png")}/>Recommendations</Button>
                            </Link>
                        </div>
                    }
                    docked={true}
                    styles={{sidebar: {
                        background: 'rgb(99, 0, 58)',
                        fontFamily: 'Exo',
                        width: '200px',
                        textAlign: 'center',
                        opacity: 0.85
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
                                        <img src={require("../res/invert_home.png")}/>
                                    </Link>
                                </Nav.Link>
                                
                                <Nav.Link className="header-bt"><img src={require("../res/invert_profile.png")}/></Nav.Link>
                                <Nav.Link className="header-bt"><img src={require("../res/invert_settings.png")}/></Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>

                    <Container userID={this.state.userID} name={this.state.displayName} playlists={this.state.playlistNames} location={this.props.location} />
                </div>
            </div>
        );
    }
}

export default Home;