import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import { Button, Container, Row, Col } from 'react-bootstrap';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const spotifyWrapper = new Spotify();

class Player extends Component {

    constructor(props) {
        super(props);

        const parameters = this.getHashParams();

        if (parameters.access_token) {
            spotifyWrapper.setAccessToken(parameters.access_token);
        }

        this.state = {
            id: this.props.location.state.id,
            params: parameters.access_token,
            tracks: [],

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

    componentDidMount() {
        this.getTracks();
        this.handlePlayer();

        let camera, scene, renderer;

        const mouse = new THREE.Vector2();
        const target = new THREE.Vector2();
        const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

        let composer;

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
            
            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            
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

            if (this.state.isPlaying) {
                camera.position.z -= 0.1;
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
        
            requestAnimationFrame( animate );
            //renderer.render( scene, camera );
            composer.render();
        }

        init();
        animate();
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
                duration,
            } = state.track_window;
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

            this.setState({position, duration, trackName, albumName, artistName, currentId}, () => {
                if (this.state.isChangedCurrentId) {
                    this.getAudioAnalysis();
                }
            });
        }
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
        .then(() => {
            this.setState({ isReady: true });
            console.log("ready");
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

    getTracks() {
        spotifyWrapper.getPlaylistTracks(this.state.id)
            .then((res) => {
                for (let i = 0; i < res.items.length; i++) {
                    this.setState({tracks: [...this.state.tracks, res.items[i].track.uri]});
                }
            })
    }

    getAudioAnalysis() {
        spotifyWrapper.getAudioAnalysisForTrack(this.state.currentId)
            .then((res) => {
                this.setState({currentAnalysis: res}, () => {
                    console.log(this.state.currentAnalysis);
                });
            })
    }

    togglePlay() {
        if (this.state.isReady) {
            this.setState({isPlaying: !this.state.isPlaying});
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
        this.player.previousTrack().then(() => {
            console.log("prev track");
        });
    }

    nextTrack() {
        this.player.nextTrack().then(() => {
            console.log("next track");
        });
    }

    render() {
        return (
            <Container id="control" fluid={true}>
                <Row>
                    <Col>
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

                    <Col>
                        <Button id="control-button" onClick={() => this.prevTrack()}>
                            <img src={require("../res/previous_button.png")}/>
                        </Button>
                        <Button id="control-button" onClick={() => this.togglePlay()}>
                            <img src={require("../res/play_button.png")}/>
                        </Button>
                        <Button id="control-button" onClick={() => this.nextTrack()}>
                            <img src={require("../res/next_button.png")}/>
                        </Button>
                    </Col>

                    <Col>

                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Player;