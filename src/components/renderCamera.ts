import {PerspectiveCamera} from 'three';
import { UpdatingObject } from '../util/types';
import { degToRad } from 'three/src/math/MathUtils';

const SENSITIVITY = 0.005;

function createRenderCamera(container : HTMLElement) : UpdatingObject & PerspectiveCamera {
    const camera : UpdatingObject & PerspectiveCamera = new PerspectiveCamera(
        70, // fov
        1, // aspect ratio (dummy value)
        0.1, // near clipping plane
        2000 // far clipping plane
    );

    container.addEventListener("mousemove", (event) => {
        const mouseX = -(event.clientX - (container.clientWidth/2));
        const mouseY = -(event.clientY - (container.clientHeight/2));

        camera.rotation.set(degToRad(mouseY*SENSITIVITY), degToRad(mouseX*SENSITIVITY), 0, "YXZ");
    });

    camera.onResize = () => {
        camera.updateProjectionMatrix();
    }

    camera.onResize();

    camera.position.set(0, 0, 500);

    return camera;
}

export { createRenderCamera }