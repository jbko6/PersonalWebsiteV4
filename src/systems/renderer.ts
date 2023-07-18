import { Color, WebGLRenderer } from 'three';

function createRenderer() : WebGLRenderer {
    const renderer = new WebGLRenderer({antialias:true, alpha:true});

    renderer.setClearColor('white', 0.0);

    return renderer;
}

export { createRenderer };