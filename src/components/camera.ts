import {PerspectiveCamera} from 'three';
import { UpdatingObject } from '../util/types';

function createCamera() : UpdatingObject & PerspectiveCamera {
    const camera : UpdatingObject & PerspectiveCamera = new PerspectiveCamera(
        70, // fov
        1, // aspect ratio (dummy value)
        0.1, // near clipping plane
        2000 // far clipping plane
    );

    camera.onResize = () => {
        camera.position.set(0, 0, window.innerWidth / 150);
    }

    camera.onResize();

    return camera;
}

export { createCamera }