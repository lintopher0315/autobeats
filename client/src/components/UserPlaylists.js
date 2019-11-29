import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

class UserPlaylists extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        this.state = {
            images: [],
            params: parameters.access_token,
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
        this.getPlaylistImages();
    }

    getPlaylistImages() {
        for (let i = 0; i < this.props.playlists.length; i++) {
            fetch(`https://api.spotify.com/v1/playlists/${this.props.playlists[i].id}/images`, {
                method: "GET",
                headers: {
                    "authorization": `Bearer ${this.state.params}`,
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(json => {
                if (this._isMounted) {
                    this.setState({images: [...this.state.images, json[0].url]});
                }
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        let settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            adaptiveHeight: true,
        };

        let list = this.state.images.map((image, i) => {
            return (
                <div id='slider-container' key={i}>
                    <Link to={{pathname: '/player', state: {id: this.props.playlists[i].id}, hash: this.props.location.hash}}>
                        <img id='slider-image' src={image}/>
                        <div id='playlist-name'>
                            {this.props.playlists[i].name}
                        </div>
                    </Link>
                </div>
            )
        })

        return (
            <div id="top-fill-container">
                <div id="header-text">
                    Your Playlists
                </div>
                <Slider {...settings}>
                    {list}
                </Slider>
            </div>
        );
    }
}

export default UserPlaylists;