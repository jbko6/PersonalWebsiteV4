import { type PerspectiveCamera, type Scene, type WebGLRenderer } from 'three';
import { createCamera } from '../components/camera.js';
import { createCube } from '../components/cube.js';
import { createLights } from '../components/lights.js';
import { createScene } from '../components/scene.js';

import { createRenderer } from '../systems/renderer.js';
import { Resizer } from '../systems/Resizer.js';

let camera : PerspectiveCamera;
let scene : Scene;
let renderer : WebGLRenderer;

class World {

    constructor(container : HTMLElement) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        container.append(renderer.domElement);

        const cube = createCube();
        const light = createLights();

        scene.add(light);
        
        scene.add(cube);

        const resizer = new Resizer(container, camera, renderer);
        resizer.onResize = () => {
            this.render();
        }
    }

    render() {
        renderer.render(scene, camera);
    }
}

export { World };