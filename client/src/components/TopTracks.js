import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import Spotify from 'spotify-web-api-js';

const spotifyWrapper = new Spotify();

class TopTracks extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        if (parameters.access_token) {
            spotifyWrapper.setAccessToken(parameters.access_token);
        }

        this.state = {
            albums: [],
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
        this.getTopTracks();
    }

    getTopTracks() {
        spotifyWrapper.getMyTopTracks()
            .then((res) => {
                for (let i = 0; i < res.items.length; i++) {
                    if (this._isMounted) {
                        this.setState({albums: [...this.state.albums, res.items[i].album.id], images: [...this.state.images, res.items[i].album.images[1].url], names: [...this.state.names, res.items[i].album.name]});
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

        let list = this.state.albums.map((album, i) => {
            return (
                <div id='slider-container-small' key={i}>
                    <Link to={{pathname: '/player', state: {id: album, type: 'album', userID: this.props.userID}, hash: this.props.location.hash}}>
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
                    Your Top Tracks
                </div>
                <Slider {...settings}>
                    {list}
                </Slider>
            </div>
        )
    }
}

export default TopTracks;