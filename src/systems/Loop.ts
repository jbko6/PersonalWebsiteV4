import { Clock, type Scene, type PerspectiveCamera, type WebGLRenderer } from 'three';
import { type EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import Stats from 'stats.js';
import { UpdatingObject } from '../util/types';
import { PostProcesser } from './PostProcesser';

const clock = new Clock();

const stats = new Stats()
stats.showPanel(0);
document.body.appendChild(stats.dom);

class Loop {
    sceneCamera : PerspectiveCamera;
    renderCamera : PerspectiveCamera;
    scene : Scene;
    renderer : WebGLRenderer;
    postProcesser : PostProcesser;
    updatables : any[];

    constructor(sceneCamera : PerspectiveCamera, renderCamera : PerspectiveCamera, scene : Scene, renderer : WebGLRenderer, postProcesser? : PostProcesser) {
        this.sceneCamera = sceneCamera;
        this.renderCamera = renderCamera;
        this.scene = scene;
        this.renderer = renderer;
        this.postProcesser = postProcesser!;
        // objects in this array MUST have a tick() method
        this.updatables = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            stats.begin();
            const delta = clock.getDelta();

            this.tick(delta);

            if (this.postProcesser) {
                this.postProcesser.renderScene(delta);
                this.renderer.render(this.scene, this.renderCamera);
            } else {
                this.renderer.render(this.scene, this.sceneCamera);
                this.renderer.render(this.scene, this.renderCamera);
            }

            stats.end();
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick(delta : number) {
        for (const object of this.updatables) {
            object.tick(delta);
        }
    }
}

export { Loop };