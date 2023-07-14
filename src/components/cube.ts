import { BoxGeometry, type Material, Mesh, TextureLoader, MeshToonMaterial } from 'three';
import { UpdatingObject } from '../util/types';

function createMaterial() : Material {
    const textureLoader = new TextureLoader();
    
    const texture = textureLoader.load('/assets/textures/uv-test-bw.jpg');

    const material = new MeshToonMaterial({
        map: texture
    });

    return material;
}

function createCube() : UpdatingObject & Mesh {
    const geometry = new BoxGeometry(2, 2, 2);

    const material = createMaterial();

    const cube : UpdatingObject & Mesh = new Mesh(geometry, material);

    cube.rotation.set(-0.5, -0.1, 0.8);

    cube.tick = (delta : number) => {
        cube.rotateX(delta);
        cube.rotateY(delta);
    };

    return cube;
}

export { createCube };