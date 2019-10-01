import React from "react";
import { slide as Menu } from 'react-burger-menu';

export default props => {
    return (
        <Menu {...props}>
            <a className="menu-item">
                Your Playlists
            </a>

            <a className="menu-item">
                Public Playlists
            </a>

            <a className="menu-item">
                Recently Played
            </a>
        </Menu>
    );
};