import { Clock, type Scene, type PerspectiveCamera, type WebGLRenderer } from 'three';
import { type EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import Stats from 'stats.js';
import { UpdatingObject } from '../util/types';

const clock = new Clock();

const stats = new Stats()
stats.showPanel(0);
document.body.appendChild(stats.dom);

class Loop {
    camera : PerspectiveCamera;
    scene : Scene;
    renderer : WebGLRenderer;
    effectComposer : EffectComposer & UpdatingObject;
    updatables : any[];

    constructor(camera : PerspectiveCamera, scene : Scene, renderer : WebGLRenderer, effectComposer? : EffectComposer & UpdatingObject) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.effectComposer = effectComposer!;
        // objects in this array MUST have a tick() method
        this.updatables = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            stats.begin();
            const delta = clock.getDelta();

            this.tick(delta);

            if (this.effectComposer) {
                if(this.effectComposer.tick) {
                    this.effectComposer.tick(delta);
                }
                this.effectComposer.render(delta);
            } else {
                this.renderer.render(this.scene, this.camera);
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