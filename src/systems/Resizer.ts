import { type WebGLRenderer, type PerspectiveCamera } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

const setSize = (container : HTMLElement, camera : PerspectiveCamera, renderer : WebGLRenderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
};

class Resizer {
    updatables : any[];
    effectComposer : EffectComposer;

    constructor(container : HTMLElement, camera : PerspectiveCamera, renderer : WebGLRenderer, effectComposer? : EffectComposer) {
        this.updatables = [];
        this.effectComposer = effectComposer!;

        setSize(container, camera, renderer);

        window.addEventListener("resize", () => {
            setSize(container, camera, renderer);
            for (const object of this.updatables) {
                object.onResize();
            }

            if (this.effectComposer) {
                this.effectComposer.reset();
            }
        });
    }
}

export { Resizer };