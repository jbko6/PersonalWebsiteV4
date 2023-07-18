import {PerspectiveCamera} from 'three';
import { UpdatingObject } from '../util/types';
import { degToRad } from 'three/src/math/MathUtils';

const SENSITIVITY = 0.005;

function createSceneCamera(container : HTMLElement) : UpdatingObject & PerspectiveCamera {
    const camera : UpdatingObject & PerspectiveCamera = new PerspectiveCamera(
        70, // fov
        1, // aspect ratio (dummy value)
        0.1, // near clipping plane
        2000 // far clipping plane
    );

    camera.onResize = () => {
        camera.position.set(0, 0, window.innerWidth / 150);
        camera.updateProjectionMatrix();
    }

    camera.onResize();

    return camera;
}

export { createSceneCamera }