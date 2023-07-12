import { Clock, type Scene, type PerspectiveCamera, type WebGLRenderer } from 'three';
import Stats from 'stats.js';

const clock = new Clock();

const stats = new Stats()
stats.showPanel(0);
document.body.appendChild(stats.dom);

class Loop {
    camera : PerspectiveCamera;
    scene : Scene;
    renderer : WebGLRenderer;
    updatables : any[];

    constructor(camera : PerspectiveCamera, scene : Scene, renderer : WebGLRenderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        // objects in this array MUST have a tick() method
        this.updatables = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            stats.begin();

            this.tick();

            this.renderer.render(this.scene, this.camera);

            stats.end();
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {
        const delta = clock.getDelta();

        for (const object of this.updatables) {
            object.tick(delta);
        }
    }
}

export { Loop };