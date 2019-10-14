import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class UserPlaylists extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        let list = this.props.playlists.map((playlist, i) => {
            return <div key={i} id="list-text">
                <Link to={{pathname: '/player', state: {id: playlist.id, params: this.props.params}}}>
                    <Button id="play-button">
                        <img id="play-icon" src={require("../res/icons8-play-26.png")}/>
                    </Button>
                </Link>
                {playlist.name}
            </div>
        });

        return (
            <div id="top-fill-container">
                <div id="header-text">
                    Your Playlists
                    {list}
                </div>
            </div>
        );
    }
}

export default UserPlaylists;