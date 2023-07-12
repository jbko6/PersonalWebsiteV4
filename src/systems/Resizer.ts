import { type WebGLRenderer, type PerspectiveCamera } from "three";

const setSize = (container : HTMLElement, camera : PerspectiveCamera, renderer : WebGLRenderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
    constructor(container : HTMLElement, camera : PerspectiveCamera, renderer : WebGLRenderer) {
        setSize(container, camera, renderer);

        window.addEventListener("resize", () => {
            setSize(container, camera, renderer);
            this.onResize();
        })
    }

    onResize() {}
}

export { Resizer };