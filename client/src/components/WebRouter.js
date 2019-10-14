import React, { Component } from 'react';
import { Switch, withRouter, Route } from 'react-router-dom';

import Cover from './Cover';
import Home from './Home';
import Player from './Player';

class WebRouter extends Component {

    render() {
        return (
            <Switch>
                <Route exact path='/' component={() => <Cover />}  />
                <Route path='/home' component={() => <Home location={this.props.location} />} />
                <Route path='/player' component={() => <Player location={this.props.location} />} />
            </Switch>
        );
    }
}

export default withRouter(WebRouter);