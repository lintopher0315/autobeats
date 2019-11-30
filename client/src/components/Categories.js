import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import Spotify from 'spotify-web-api-js';

const spotifyWrapper = new Spotify();

class Categories extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        if (parameters.access_token) {
            spotifyWrapper.setAccessToken(parameters.access_token);
        }

        this.state = {
            categories: [],
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
        this.getCategoryList();
    }

    getCategoryList() {
        spotifyWrapper.getCategories()
            .then((res) => {
                if (this._isMounted) {
                    for (let i = 0; i < res.categories.items.length; i++) {
                        this.setState({categories: [...this.state.categories, res.categories.items[i].id], images: [...this.state.images, res.categories.items[i].icons[0].url], names: [...this.state.names, res.categories.items[i].name]});
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

        let list = this.state.categories.map((category, i) => {
            return (
                <div id='slider-container-tiny' key={i}>
                    <Link to={{pathname: '/home/categoryplaylists', state: {type: category, name : this.state.names[i]}, hash: this.props.location.hash}}>
                        <img id='slider-image-tiny' src={this.state.images[i]}/>
                        <div id='playlist-name-tiny'>
                            {this.state.names[i]}
                        </div>
                    </Link>
                </div>
            )
        })

        return (
            <div id="top-fill-container">
                <div id="header-text">
                    Categories
                </div>
                <Slider {...settings}>
                    {list}
                </Slider>
            </div>
        )
    }
}

export default Categories;