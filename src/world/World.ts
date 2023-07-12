import { type PerspectiveCamera, type Scene, type WebGLRenderer } from 'three';
import { createCamera } from '../components/camera.js';
import { createCube } from '../components/cube.js';
import { createLights } from '../components/lights.js';
import { createScene } from '../components/scene.js';

import { createRenderer } from '../systems/renderer.js';
import { Resizer } from '../systems/Resizer.js';
import { Loop } from '../systems/Loop.js';

let camera : PerspectiveCamera;
let scene : Scene;
let renderer : WebGLRenderer;
let loop : Loop;

class World {

    constructor(container : HTMLElement) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);

        const cube = createCube();
        const light = createLights();

        loop.updatables.push(cube);

        scene.add(light);
        
        scene.add(cube);

        const resizer = new Resizer(container, camera, renderer);
        resizer.updatables.push(camera);
    }

    render() {
        renderer.render(scene, camera);
    }

    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }
}

export { World };