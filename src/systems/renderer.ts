import { WebGLRenderer } from 'three';

function createRenderer() : WebGLRenderer {
    const renderer = new WebGLRenderer({antialias:true});
    
    return renderer;
}

export { createRenderer };