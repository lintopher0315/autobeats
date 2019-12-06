import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import { Button, Container, Row, Col, ProgressBar, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const spotifyWrapper = new Spotify();

const NEON = 
    [
        0xffff00, 0xffff33, 0xf2ea02, 0xe6fb04, 0xff0000, 0xfd1c03, 0xff3300, 0xff6600, 0x00ff00, 0x00ff33, 0x00ff66, 0x33ff00, 0x00ffff, 0x099fff, 0x0062ff, 0x0033ff,
        0xff00ff, 0xff00cc, 0xff0099, 0xcc00ff, 0x9d00ff, 0xcc00ff, 0x6e0dd0, 0x9900ff, 0x08f7fe, 0x09fbd3, 0xfe53bb, 0xf5d300, 0xffacfc, 0xf148fb, 0x7122fa, 0x560a86,
        0x75d5fd, 0xb76cfd, 0xff2281, 0x011ffd, 0xfdc7d7, 0xff9de6, 0xa5d8f3, 0xe8e500, 0x00feca, 0xfdf200, 0xff85ea, 0x7b61f8, 0xffd300, 0xde38c8, 0x652ec7, 0x33135c,
        0xffdef3, 0xff61be, 0xfdd400, 0xfdb232, 0x02b8a2, 0x01535f, 0xfec763, 0xea55b1, 0xa992fa, 0x00207f, 0x79fffe, 0xfea0fe, 0xff8b8b, 0xf85125, 0xce96fb, 0xff8fcf,
        0x00c2ba, 0x037a90, 0x01ffc3, 0x01ffff, 0xffb3fd, 0x9d72ff, 0xa0edff, 0xebf875, 0x28cf75, 0xfe6b35, 0xffff66, 0xfc6e22, 0xff1493, 0xc24cf6, 0x00a9fe, 0xffe3f1,
        0x7fff00, 0x0310ea, 0x440bd4, 0xb8fb3c, 0x5ce5d5, 0x8af7e4, 0x48adf1, 0xe1ef7e, 0xffaa01
    ]

class Player extends Component {

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        if (parameters.access_token) {
            spotifyWrapper.setAccessToken(parameters.access_token);
        }

        this.state = {
            id: this.props.location.state.id,
            type: this.props.location.state.type,
            params: parameters.access_token,
            tracks: [],
            tracks_id: [],
            images: [],

            deviceId: "",
            trackName: "",
            artistName: "",
            albumName: "",
            isPlaying: false,
            position: 0,
            duration: 0,
            isCorrectPlaylist: false,
            isReady: false,
            currentId: "",
            currentAnalysis: [],
            isChangedCurrentId: false,
            currTime: 0.0,
            resetTime: false,
            isTimerRunning: false,
            trackProgress: 0,
            trackIndex: 0,
            numPlays: 0,
            totTime: 0,
            showImage: false,
        }

        this.playerCheckInterval = null;
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

    round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    componentDidMount() {
        this.getTracks(this.state.type);
        this.handlePlayer();

        let camera, scene, renderer;

        const mouse = new THREE.Vector2();
        const target = new THREE.Vector2();
        const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

        let composer;

        let timer = new THREE.Clock();

        let init = () => {
            
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
            camera.position.z = 50;

            scene = new THREE.Scene();

            const geometry = new THREE.PlaneBufferGeometry(4, 4, 1, 1);

            for (let j = 10; j > 0; j--) {
                for (let i = 0; i < 16; i++) {

                    let material = new THREE.MeshLambertMaterial({
                        color: 0x000000,
                        emissive: 0x000000,
                        side: THREE.DoubleSide,
                        polygonOffset: true,
                        polygonOffsetFactor: 1,
                        polygonOffsetUnits: 1,
                    });

                    let object = new THREE.Mesh( geometry, material );
                    if (i / 4 < 1) {
                        object.position.x = i * 4;
                        object.position.y = 0;
                        object.position.z = j * 4;
                        
                        object.rotation.x = Math.PI / 2;
                    }
                    else if (i / 4 < 2) {
                        object.position.x = 14;
                        object.position.y = (i-4) * 4 + 2;
                        object.position.z = j * 4;

                        object.rotation.y = Math.PI / 2;
                    }
                    else if (i / 4 < 3) {
                        object.position.x = (i-8) * 4;
                        object.position.y = 16;
                        object.position.z = j * 4;

                        object.rotation.x = Math.PI / 2;
                    }
                    else if (i / 4 < 4) {
                        object.position.x = -2;
                        object.position.y = (i-12) * 4 + 2;
                        object.position.z = j * 4;

                        object.rotation.y = Math.PI / 2;
                    }
                    object.position.x -= 5;
                    object.position.y -= 5;
                    
                    scene.add(object);
    
                    var geo = new THREE.EdgesGeometry(object.geometry);
                    var mat = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2});
                    var wireframe = new THREE.LineSegments(geo, mat);
                    object.add(wireframe);

                }
            }
            const panelGeometry = new THREE.PlaneBufferGeometry(50, 32, 1, 1);

            const panelMaterial = new THREE.MeshLambertMaterial({
                color: 0x000000,
                emissive: 0x000000,
                side: THREE.DoubleSide,
                polygonOffset: true,
                polygonOffsetFactor: 1,
                polygonOffsetUnits: 1,
            });

            let panelLower = new THREE.Mesh(panelGeometry, panelMaterial);
            let panelUpper = new THREE.Mesh(panelGeometry, panelMaterial);

            var wireGeoLower = new THREE.EdgesGeometry(panelLower.geometry);
            var wireGeoUpper = new THREE.EdgesGeometry(panelUpper.geometry);
            var wireMat = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2});
            var panelWireframeLower = new THREE.LineSegments(wireGeoLower, wireMat);
            var panelWireframeUpper = new THREE.LineSegments(wireGeoUpper, wireMat);
            panelLower.add(panelWireframeLower);
            panelUpper.add(panelWireframeUpper);

            panelLower.position.x = 0;
            panelLower.position.y = 18;
            panelLower.position.z = 42.1;

            panelUpper.position.x = 0;
            panelUpper.position.y = -14;
            panelUpper.position.z = 42.1;

            scene.add(panelLower);
            scene.add(panelUpper);

            scene.visible = false;
            
            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setSize(window.innerWidth, window.innerHeight);

            this.domElement = renderer.domElement;
            //document.body.appendChild(renderer.domElement);
            this.mount.appendChild( renderer.domElement );
            
            // start of postprocessing
            composer = new EffectComposer(renderer);

            let renderPass = new RenderPass(scene, camera);
            composer.addPass(renderPass);
            renderPass.renderToScreen = true;

            let bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.65, 0.3, 0.2);
            composer.addPass(bloomPass);

            // end of postprocessing
            
            document.addEventListener('mousemove', onMouseMove, false);
            window.addEventListener('resize', onResize, false);
        }

        let onMouseMove = (event) => {
            mouse.x = ( event.clientX - windowHalf.x );
            mouse.y = ( event.clientY - windowHalf.x );
        }

        let onResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            windowHalf.set( width / 2, height / 2 );
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize( width, height );
        }

        let animate = () => {

            if (this.state.isCorrectPlaylist) {
                scene.visible = true;
            }

            //start of visual synchronization

            if (this.state.resetTime) {
                timer.stop();
                this.setState({resetTime: false, isTimerRunning: false});
            }

            if (this.state.isPlaying && this.state.isCorrectPlaylist && !timer.running) {
                timer.start();
                this.setState({isTimerRunning: true});
            }
            else if (!this.state.isPlaying && timer.running) {
                this.setState({currTime: this.state.currTime + this.round(timer.getElapsedTime(), 3), isTimerRunning: false}, () => {
                    timer.stop();
                });
            }

            if (this.state.isTimerRunning) {
                if (this.state.currentAnalysis.length !== 0) {
                    let elapsed = this.state.currTime + this.round(timer.getElapsedTime(), 3);
    
                    if (elapsed % 1 < 0.025 || elapsed % 1 > 0.975) {
                        console.log(this.state.currentAnalysis['track']['duration']);
                        console.log((elapsed / this.state.currentAnalysis['track']['duration']) * 100);
                        this.setState({trackProgress: (elapsed / this.state.currentAnalysis['track']['duration']) * 100});
                    }
    
                    if (this.state.currentAnalysis['bars'].length > 0) {
                        let bars = this.round(this.state.currentAnalysis['bars'][0].start, 3);
    
                        if (Math.abs(elapsed - bars) <= 0.025) {
                            for (let i = 0; i < scene.children.length; i++) {
                                scene.children[i].children[0].material.color.setHex(NEON[Math.floor(Math.random() * NEON.length)]);
                            }
                            let temp = this.state.currentAnalysis;
                            temp['bars'].shift();
                            this.setState({currentAnalysis: temp});
                            console.log(this.state.currentAnalysis);
                        }
                    }
    
                    if (this.state.currentAnalysis['beats'].length > 0) {
                        let beats = this.round(this.state.currentAnalysis['beats'][0].start, 3);
    
                        if (Math.abs(elapsed - beats) <= 0.025) {
                            for (let i = 0; i < 10; i++) {
                                let select = Math.floor(Math.random() * 16);
    
                                for (let j = 0; j < 16; j++) {
                                    if (select != j) {
                                        scene.children[(16 * i) + j].material.emissive.setHex(0x000000);
                                    }
                                    else {
                                        scene.children[(16 * i) + j].material.emissive.setHex(NEON[Math.floor(Math.random() * NEON.length)]);
                                    }
                                }
                            }
                            let temp = this.state.currentAnalysis;
                            temp['beats'].shift();
                            this.setState({currentAnalysis: temp});
                        }
                    }
    
                    if (this.state.currentAnalysis['tatums'].length > 0) {
                        let tatums = this.round(this.state.currentAnalysis['tatums'][0].start, 3);
    
                        if (Math.abs(elapsed - tatums) <= 0.025) {
                            for (let i = 1; i < 10; i += 2) {
                                let select = Math.floor(Math.random() * 16);
    
                                for (let j = 0; j < 16; j++) {
                                    if (select != j) {
                                        scene.children[(16 * i) + j].material.emissive.setHex(0x000000);
                                    }
                                    else {
                                        scene.children[(16 * i) + j].material.emissive.setHex(NEON[Math.floor(Math.random() * NEON.length)]);
                                    }
                                }
                            }
                            let temp = this.state.currentAnalysis;
                            temp['tatums'].shift();
                            this.setState({currentAnalysis: temp});
                        }
                    }
                }
            }

            //end of visual synchronization

            if (this.state.isPlaying) {
                camera.position.z -= 0.1;
                if (scene.children.length > 160) {
                    scene.children[160].position.y += 0.15;
                    scene.children[161].position.y -= 0.15;
                    if (camera.position.z < 30) {
                        scene.children.splice(160, 2);
                    }
                }
            }

            if (scene.children[0].position.z >= camera.position.z) {
                for (let i = 0; i < 16; i++) {
                    let temp = scene.children.shift();
                    temp.position.z -= 40;
                    scene.children.splice(159, 0, temp);
                }
            }

            target.x = ( 1 - mouse.x ) * 0.002;
            if (target.x > 0.35) {
                target.x = 0.35;
            }
            if (target.x < -0.35) {
                target.x = -0.35
            }
            target.y = ( 1 - mouse.y ) * 0.002;
            if (target.y > 0.35) {
                target.y = 0.35;
            }
            if (target.y < -0.85) {
                target.y = -0.85
            }
            
            camera.rotation.x += 0.01 * ( target.y - camera.rotation.x );
            camera.rotation.y += 0.01 * ( target.x - camera.rotation.y );
        
            this.requestId = requestAnimationFrame( animate );
            //renderer.render( scene, camera );
            composer.render();
        }

        init();
        animate();
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.requestId);
        this.mount.removeChild(this.domElement);
        this.postStats();
    }

    handlePlayer() {
        this.playerCheckInterval = setInterval(() => this.checkPlayer(), 1000);
    }

    checkPlayer() {
        if (window.Spotify !== null) {
            clearInterval(this.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: "Spotify Player",
                getOAuthToken: callback => { callback(this.state.params); },
            });
            this.onStateChange();
            this.player.connect();
        }
    }

    onStateChange() {
        this.player.on('initialization_error', e => { console.error(e) });
        this.player.on('authentication_error', e => { console.error(e) });
        this.player.on('account_error', e => { console.error(e) });
        this.player.on('playback_error', e => { console.error(e) });

        this.player.on('player_state_changed', state => this.updateInfo(state));

        this.player.on('ready', async data => {
            let { device_id } = data;
            this.setState({ deviceId: device_id }, () => {
                this.initiatePlayback();
            });
        })
    }

    updateInfo(state) {
        if (state !== null) {
            const {
                current_track: currentTrack,
                position,
            } = state.track_window;
            const duration = currentTrack.duration_ms;
            const currentId = currentTrack.id;
            const trackName = currentTrack.name;
            const albumName = currentTrack.album.name;
            const artistName = currentTrack. artists
                .map(artist => artist.name)
                .join(", ");

            if (currentId === this.state.currentId) {
                this.setState({isChangedCurrentId: false});
            }
            else {
                this.setState({isChangedCurrentId: true});
            }

            if (currentTrack.linked_from.id == null) {
                this.setState({currentId: currentTrack.id});
            }
            else {
                this.setState({currentId: currentTrack.linked_from.id});
            }

            this.setState({position, duration, trackName, albumName, artistName}, () => {
                if (this.state.isChangedCurrentId) {
                    console.log("update info");
                    this.getAudioAnalysis();
                    this.setState({trackIndex: this.state.tracks_id.indexOf(this.state.currentId)});
                    this.setState({numPlays: this.state.numPlays + 1, totTime: this.state.totTime + Math.floor(this.state.duration / 1000)});
                }
            });
        }
    }

    postStats() {
        fetch('http://autobeats.herokuapp.com/users/count', {
            method: 'POST',
            body: JSON.stringify({
                name: this.props.location.state.userID,
                numPlays: this.state.numPlays,
                timePlayed: this.state.totTime
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    initiatePlayback() {
        fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
                authorization: `Bearer ${this.state.params}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "device_ids": [ this.state.deviceId ],
                "play": false,
            })
        })
    }

    setPlaylist() {
        spotifyWrapper.play({"uris": this.state.tracks})
            .then((res) => {
                this.player.togglePlay().then(() => {
                    this.setState({isCorrectPlaylist: true});
                });
                console.log("toggled");
            })
    }

    getTracks(type) {
        if (type === 'playlist') {
            spotifyWrapper.getPlaylistTracks(this.state.id)
            .then((res) => {
                for (let i = 0; i < res.items.length; i++) {
                    this.setState({tracks: [...this.state.tracks, res.items[i].track.uri], tracks_id: [...this.state.tracks_id, res.items[i].track.id]});
                }
                this.getTrackImages();
            })
        }
        else if (type === 'album') {
            spotifyWrapper.getAlbumTracks(this.state.id)
            .then((res) => {
                for (let i = 0; i < res.items.length; i++) {
                    this.setState({tracks: [...this.state.tracks, res.items[i].uri], tracks_id: [...this.state.tracks_id, res.items[i].id]});
                }
                this.getTrackImages();
            })
        }
    }

    getAudioAnalysis() {
        spotifyWrapper.getAudioAnalysisForTrack(this.state.currentId)
            .then((res) => {
                this.setState({currentAnalysis: res}, () => {
                    console.log("ready");
                    console.log(this.state.currentAnalysis);
                    this.setState({currTime: 0.0, resetTime: true, isReady: true});
                });
            })
    }

    getTrackImages() {
        if (this.state.tracks_id.length <= 50) {
            spotifyWrapper.getTracks(this.state.tracks_id)
            .then((res) => {
                for (let i = 0; i < res.tracks.length; i++) {
                    this.setState({images: [...this.state.images, res.tracks[i].album.images[2].url]});
                }
            })
        }
        else {
            for (let i = 0; i < Math.ceil(this.state.tracks_id.length / 50.0); i++) {
                spotifyWrapper.getTracks(this.state.tracks_id.slice(i * 50, (i + 1) * 50))
                .then((res) => {
                    for (let i = 0; i < res.tracks.length; i++) {
                        this.setState({images: [...this.state.images, res.tracks[i].album.images[2].url]});
                    }
                })
            }
        }
    }

    toggle() {
        if (this.state.isReady) {
            this.setState({isPlaying: !this.state.isPlaying, showImage: true});
            if (!this.state.isCorrectPlaylist) {
                this.setPlaylist();
            }
            else {
                this.player.togglePlay().then(() => {
                    console.log("toggled");
                });
            }
        }
    }

    prevTrack() {
        if (this.state.isPlaying) {
            this.player.previousTrack().then(() => {
                console.log("prev track");
            });
        }
    }

    nextTrack() {
        if (this.state.isPlaying) {
            this.player.nextTrack().then(() => {
                console.log("next track");
            });
        }
    }

    render() {

        let primButton = 
            <button id="control-button" onClick={() => this.toggle()}>
                <img id='control-icon' src={require("../res/play_button.png")}/>
            </button>
        if (this.state.isPlaying) {
                primButton = 
                    <button id="control-button" onClick={() => this.toggle()}>
                        <img id='control-icon' src={require("../res/pause_button.png")}/>
                    </button>
        }

        let image = <Image id='image'/>
        if (this.state.showImage) {
            image = <Image id='image' src={this.state.images[this.state.trackIndex]} />
        }

        return (
            <div>
                <div ref={ref => (this.mount = ref)} />
                <Container id="control" fluid={true}>
                    <Row>
                        <Col id="player-col-left">
                            {image}
                        </Col>

                        <Col id="player-col-right">
                            <Container fluid={true}>
                                <Row>
                                    <ProgressBar id='progress-bar' variant="custom" now={this.state.trackProgress} isChild={true} />
                                </Row>
                                <Row>
                                    <Col id="player-col-right">
                                        <div id="info">
                                            {this.state.isCorrectPlaylist ? (
                                                <div>
                                                    <div id="track-title">
                                                        {this.state.trackName}
                                                    </div>
                                                    <div id="artist-title">
                                                        {this.state.artistName}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
                                    </Col>

                                    <Col id='player-nested-col'>
                                        <div id='player-nested-mid'>
                                            <button id="control-button" onClick={() => this.prevTrack()}>
                                                <img id='control-icon' src={require("../res/prev_button.png")}/>
                                            </button>
                                            {primButton}
                                            <button id="control-button" onClick={() => this.nextTrack()}>
                                                <img id='control-icon' src={require("../res/next_button.png")}/>
                                            </button>
                                        </div>
                                    </Col>

                                    <Col id='player-nested-col'>
                                        <div id='player-nested-right'>
                                            <Link to={{pathname: '/home', hash: this.props.location.hash}}>
                                                <button id='control-button'>
                                                    <img id='control-icon' src={require("../res/invert_home.png")}/>
                                                </button>
                                            </Link>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Player;