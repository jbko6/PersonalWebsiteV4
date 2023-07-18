import { type Light, type PerspectiveCamera, type Scene, type WebGLRenderer } from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import { type EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

import { createSceneCamera } from '../components/sceneCamera.js';
import { createTexturePlane } from '../components/texturePlane.js';
import { createCube } from '../components/cube.js';
import { createLights } from '../components/lights.js';
import { createScene } from '../components/scene.js';

import { createRenderer } from '../systems/renderer.js';
import { PostProcesser } from '../systems/PostProcesser.js';
import { Resizer } from '../systems/Resizer.js';
import { Loop } from '../systems/Loop.js';
import { createSphere } from '../components/sphere.js';
import { createRenderCamera } from '../components/renderCamera.js';


let sceneCamera : PerspectiveCamera;
let renderCamera : PerspectiveCamera;
let scene : Scene;
let renderer : WebGLRenderer;
let postProcesser : PostProcesser;
let resizer : Resizer;
let loop : Loop;

class World {

    constructor(container : HTMLElement) {
        sceneCamera = createSceneCamera(container);
        renderCamera = createRenderCamera(container);
        scene = createScene();
        renderer = createRenderer();

        resizer = new Resizer(container, sceneCamera, renderer);
        resizer.updatables.push(sceneCamera);
        resizer.updatables.push(renderCamera);

        postProcesser = new PostProcesser(renderer, scene, sceneCamera);
        resizer.postProcesser = postProcesser;

        loop = new Loop(sceneCamera, renderCamera, scene, renderer, postProcesser);
        container.append(renderer.domElement);

        const texturePlane = createTexturePlane(postProcesser.mainComposer);
        resizer.texturePlane = texturePlane;

        const cube = createCube();
        const sphere = createSphere().translateX(5);
        const lights : Light[] = createLights();

        loop.updatables.push(cube);
        loop.updatables.push(sphere);

        for (const light of lights) {
            scene.add(light);
        }
        
        scene.add(texturePlane);

        scene.add(cube);
        scene.add(cube.clone().translateX(2).rotateY(degToRad(45)))
        scene.add(sphere);
        scene.add(sphere.clone().translateX(-10).translateY(2));
        scene.add(sphere.clone().translateX(-3).translateY(-5));
    }

    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }
}

export { World };