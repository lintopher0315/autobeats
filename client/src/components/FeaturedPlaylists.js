import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import Spotify from 'spotify-web-api-js';

const spotifyWrapper = new Spotify();

class FeaturedPlaylists extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        if (parameters.access_token) {
            spotifyWrapper.setAccessToken(parameters.access_token);
        }

        this.state = {
            playlists: [],
            images: [],
            names: [],
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
        this.getFeaturedPlaylists();
    }

    getFeaturedPlaylists() {
        spotifyWrapper.getFeaturedPlaylists()
            .then((res) => {
                for (let i = 0; i < res.playlists.items.length; i++) {
                    if (this._isMounted) {
                        this.setState({playlists: [...this.state.playlists, res.playlists.items[i].id], images: [...this.state.images, res.playlists.items[i].images[0].url], names: [...this.state.names, res.playlists.items[i].name]});
                    }
                }
            })
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
            rows: 2,
            slidesPerRow: 1
        }

        let list = this.state.playlists.map((playlist, i) => {
            return (
                <div id='slider-container-small' key={i}>
                    <Link to={{pathname: '/player', state: {id: playlist, type: 'playlist'}, hash: this.props.location.hash}}>
                        <img id='slider-image-small' src={this.state.images[i]}/>
                        <div id='playlist-name-small'>
                            {this.state.names[i]}
                        </div>
                    </Link>
                </div>
            )
        })

        return (
            <div id="top-fill-container">
                <div id="header-text">
                    Featured Playlists
                </div>
                <Slider {...settings}>
                    {list}
                </Slider>
            </div>
        );
    }
}

export default FeaturedPlaylists;