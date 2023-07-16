import { type Light, type PerspectiveCamera, type Scene, type WebGLRenderer } from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import { type EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

import { createCamera } from '../components/camera.js';
import { createCube } from '../components/cube.js';
import { createLights } from '../components/lights.js';
import { createScene } from '../components/scene.js';

import { createRenderer } from '../systems/renderer.js';
import { createEffectComposer } from '../systems/postprocessing.js';
import { Resizer } from '../systems/Resizer.js';
import { Loop } from '../systems/Loop.js';
import { createSphere } from '../components/sphere.js';


let camera : PerspectiveCamera;
let scene : Scene;
let renderer : WebGLRenderer;
let effectComposer : EffectComposer
let loop : Loop;

class World {

    constructor(container : HTMLElement) {
        camera = createCamera(container);
        scene = createScene();
        renderer = createRenderer();

        const resizer = new Resizer(container, camera, renderer);
        resizer.updatables.push(camera);

        effectComposer = createEffectComposer(renderer, scene, camera);
        resizer.effectComposer = effectComposer;

        loop = new Loop(camera, scene, renderer, effectComposer);
        container.append(renderer.domElement);

        const cube = createCube();
        const sphere = createSphere().translateX(5);
        const lights : Light[] = createLights();

        loop.updatables.push(cube);
        loop.updatables.push(sphere);

        for (const light of lights) {
            scene.add(light);
        }
        
        scene.add(cube);
        scene.add(cube.clone().translateX(2).rotateY(degToRad(45)))
        scene.add(sphere);
        scene.add(sphere.clone().translateX(-10).translateY(2));
        scene.add(sphere.clone().translateX(-3).translateY(-5));
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