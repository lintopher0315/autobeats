import React, { Component } from 'react';
import { Switch, withRouter, Route } from 'react-router-dom';

import Welcome from './Welcome';
import UserPlaylists from './UserPlaylists';

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
                </Switch>
            </div>
        );
    }
}

export default withRouter(Container);