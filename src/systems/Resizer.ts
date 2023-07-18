import { type WebGLRenderer, type PerspectiveCamera, Mesh } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { PostProcesser } from "./PostProcesser";

const setSize = (container : HTMLElement, camera : PerspectiveCamera, renderer : WebGLRenderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    camera.position.set(0, 0, window.innerWidth / 150);

    renderer.setSize(container.clientWidth, container.clientHeight);
};

class Resizer {
    updatables : any[];
    postProcesser : PostProcesser;
    texturePlane : Mesh;

    constructor(container : HTMLElement, camera : PerspectiveCamera, renderer : WebGLRenderer, postProcesser? : PostProcesser, texturePlane ? : Mesh) {
        this.updatables = [];
        this.postProcesser = postProcesser!;

        setSize(container, camera, renderer);

        window.addEventListener("resize", () => {
            setSize(container, camera, renderer);

            if (this.postProcesser) {
                this.postProcesser.resetComposers();
                if (this.texturePlane) {
                    this.texturePlane.material['map'] = this.postProcesser.mainComposer.renderTarget1.texture;
                }
            }
        });
    }
}

export { Resizer };