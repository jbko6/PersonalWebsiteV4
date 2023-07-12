import {PerspectiveCamera} from 'three';

function createCamera() : PerspectiveCamera {
    const camera = new PerspectiveCamera(
        70, // fov
        1, // aspect ratio (dummy value)
        0.1, // near clipping plane
        2000 // far clipping plane
    );

    camera.position.set(0,0,10);

    return camera;
}

export { createCamera }