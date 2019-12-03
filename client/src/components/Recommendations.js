import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import Spotify from 'spotify-web-api-js';

const spotifyWrapper = new Spotify();

class Recommendations extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();
    
        if (parameters.access_token) {
            spotifyWrapper.setAccessToken(parameters.access_token);
        }

        this.state = {
            genres: [],
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
        this.getAvailableGenres();
    }

    getRecommendations() {
        let genreString = "";
        genreString += this.state.genres[Math.floor(Math.random() * this.state.genres.length)];
        for (let i = 0; i < 2; i++) {
            genreString += ", " + this.state.genres[Math.floor(Math.random() * this.state.genres.length)];
        }
        spotifyWrapper.getRecommendations({"seed_artists": "", "seed_genres": genreString, "seed_tracks": ""})
            .then((res) => {
                if (this._isMounted) {
                    for (let i = 0; i < res.tracks.length; i++) {
                        this.setState({albums: [...this.state.albums, res.tracks[i].album.id], images: [...this.state.images, res.tracks[i].album.images[1].url], names: [...this.state.names, res.tracks[i].album.name]});
                    }
                }
            })
    }

    getAvailableGenres() {
        spotifyWrapper.getAvailableGenreSeeds()
            .then((res) => {
                if (this._isMounted) {
                    this.setState({genres: res.genres}, () => {
                        this.getRecommendations();
                    });
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
                    Recommendations
                </div>
                <Slider {...settings}>
                    {list}
                </Slider>
            </div>
        )
    }
}

export default Recommendations;