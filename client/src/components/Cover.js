import React, { Component } from 'react';
import './styles.css';
import * as THREE from 'three';
import Button from 'react-bootstrap/Button';

class Cover extends Component {
    
    componentDidMount() {
        let camera, scene, renderer;
    
        const mouse = new THREE.Vector2();
        const target = new THREE.Vector2();
        const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );
    
        let init = () => {
    
            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 500 );
            camera.position.z = 50;
        
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x2e062b)
        
            const geometry = new THREE.BoxBufferGeometry();
            const material = new THREE.MeshNormalMaterial();
            
            for ( let i = 0; i < 1000; i ++ ) {
            
                const object = new THREE.Mesh( geometry, material );
                object.position.x = Math.random() * 80 - 40;
                object.position.y = Math.random() * 80 - 40;
                object.position.z = Math.random() * 80 - 40;
                object.rotation.x = Math.random() * 2 * Math.PI;
                object.rotation.y = Math.random() * 2 * Math.PI;
                object.rotation.z = Math.random() * 2 * Math.PI;
                scene.add( object );
                    
            }
        
            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );
            
            document.addEventListener( 'mousemove', onMouseMove, false );
            window.addEventListener( 'resize', onResize, false );
    
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
    
            target.x = ( 1 - mouse.x ) * 0.002;
            if (target.x > 0.2) {
                target.x = 0.2;
            }
            if (target.x < -0.2) {
                target.x = -0.2
            }
            target.y = ( 1 - mouse.y ) * 0.002;
            if (target.y > 0.55) {
                target.y = 0.55;
            }
            if (target.y < 0.15) {
                target.y = 0.15
            }
            
            camera.rotation.x += 0.01 * ( target.y - camera.rotation.x );
            camera.rotation.y += 0.01 * ( target.x - camera.rotation.y );
        
            requestAnimationFrame( animate );
            renderer.render( scene, camera );
    
        }
    
        init();
        animate();
    }
    
    render() {
        return (
            <div>
                <div id="title">autobeats</div>
                <div id="d">
                    <Button id="bt" variant="light" href="http://localhost:8888/login">CONNECT</Button>
                </div>
                
                <a href="https://github.com/lintopher0315/autobeats" target="_blank">
                    <img id='cover-icon-left' src={require("../res/github-small.png")}/>
                </a>
    
                <a href="https://www.linkedin.com/in/christopher-lin-98146913b/" target="_blank">
                    <img id='cover-icon-right' src={require("../res/linkedin-small.png")}/>
                </a>
            </div>
        );
    }
}

export default Cover;