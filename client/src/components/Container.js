import React, { Component } from 'react';
import { Switch, withRouter, Route } from 'react-router-dom';

import Welcome from './Welcome';
import UserPlaylists from './UserPlaylists';
import FeaturedPlaylists from './FeaturedPlaylists';
import NewReleases from './NewReleases';
import TopTracks from './TopTracks';
import Recommendations from './Recommendations';
import Categories from './Categories';
import CategoryPlaylists from './CategoryPlaylists';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-class">
                <Switch>
                    <Route exact path='/home' component={() => <Welcome name={this.props.name} location={this.props.location} />} />
                    <Route path='/home/userplaylists' component={() => <UserPlaylists playlists={this.props.playlists} location={this.props.location} />} />
                    <Route path='/home/featuredplaylists' component={() => <FeaturedPlaylists location={this.props.location} />} />
                    <Route path='/home/newreleases' component={() => <NewReleases location={this.props.location} />} />
                    <Route path='/home/toptracks' component={() => <TopTracks location={this.props.location} />} />
                    <Route path='/home/recommendations' component={() => <Recommendations location={this.props.location} />} />
                    <Route path='/home/categories' component={() => <Categories location={this.props.location} />} />
                    <Route path='/home/categoryplaylists' component={() => <CategoryPlaylists location={this.props.location} />} />
                </Switch>
            </div>
        );
    }
}

export default withRouter(Container);