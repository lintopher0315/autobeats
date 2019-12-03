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
                    <Route exact path='/home' component={() => <Welcome userID={this.props.userID} name={this.props.name} location={this.props.location} />} />
                    <Route path='/home/userplaylists' component={() => <UserPlaylists userID={this.props.userID} playlists={this.props.playlists} location={this.props.location} />} />
                    <Route path='/home/featuredplaylists' component={() => <FeaturedPlaylists userID={this.props.userID} location={this.props.location} />} />
                    <Route path='/home/newreleases' component={() => <NewReleases userID={this.props.userID} location={this.props.location} />} />
                    <Route path='/home/toptracks' component={() => <TopTracks userID={this.props.userID} location={this.props.location} />} />
                    <Route path='/home/recommendations' component={() => <Recommendations userID={this.props.userID} location={this.props.location} />} />
                    <Route path='/home/categories' component={() => <Categories location={this.props.location} />} />
                    <Route path='/home/categoryplaylists' component={() => <CategoryPlaylists userID={this.props.userID} location={this.props.location} />} />
                </Switch>
            </div>
        );
    }
}

export default withRouter(Container);