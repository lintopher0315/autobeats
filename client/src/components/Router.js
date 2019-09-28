import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Cover from './Cover';
import Home from './Home';

class Router extends Component {

    render() {
        return (
            <Switch>
                <Route exact path='/' component={() => <Cover />}  />
                <Route path='/home' component={() => <Home />} />
            </Switch>
        );
    }
}

export default Router;