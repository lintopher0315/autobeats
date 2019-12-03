import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import Spotify from 'spotify-web-api-js';

const spotifyWrapper = new Spotify();

class CategoryPlaylists extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        if (parameters.access_token) {
            spotifyWrapper.setAccessToken(parameters.access_token);
        }

        this.state = {
            type: this.props.location.state.type,
            typeName: this.props.location.state.name,
            params: parameters.access_token,
            playlists: [],
            images: [],
            names: [],
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
        this.getCategoryPlaylists();
    }

    getCategoryPlaylists() {
        fetch(`https://api.spotify.com/v1/browse/categories/${this.state.type}/playlists`, {
            method: "GET",
            headers: {
                "authorization": `Bearer ${this.state.params}`,
                "Content-Type": "application/json",
            },
        })
        .then(res => res.json())
        .then(json => {
            for (let i = 0; i < json.playlists.items.length; i++) {
                if (this._isMounted) {
                    this.setState({playlists: [...this.state.playlists, json.playlists.items[i].id], images: [...this.state.images, json.playlists.items[i].images[0].url], names: [...this.state.names, json.playlists.items[i].name]});
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
                    <Link to={{pathname: '/player', state: {id: playlist, type: 'playlist', userID: this.props.userID}, hash: this.props.location.hash}}>
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
                    {`${this.state.typeName} Playlists`}
                </div>
                <Slider {...settings}>
                    {list}
                </Slider>
            </div>
        )
    }
}

export default CategoryPlaylists;