import { type WebGLRenderer, type PerspectiveCamera } from "three";

const setSize = (container : HTMLElement, camera : PerspectiveCamera, renderer : WebGLRenderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
};

class Resizer {
    updatables : any[];

    constructor(container : HTMLElement, camera : PerspectiveCamera, renderer : WebGLRenderer) {
        this.updatables = [];

        setSize(container, camera, renderer);

        window.addEventListener("resize", () => {
            setSize(container, camera, renderer);
            for (const object of this.updatables) {
                object.onResize();
            }
        })
    }
}

export { Resizer };