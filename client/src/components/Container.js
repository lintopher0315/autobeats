import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Welcome from './Welcome'

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-class">
                <Welcome name={this.props.name} />
            </div>
        );
    }
}

export default Container;