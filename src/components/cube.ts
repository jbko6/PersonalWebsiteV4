import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { UpdatingObject } from '../util/util';

function createCube() : UpdatingObject & Mesh {
    const geometry = new BoxGeometry(2, 2, 2);

    const material = new MeshStandardMaterial({color:'purple'});

    const cube : UpdatingObject & Mesh = new Mesh(geometry, material);

    cube.rotation.set(-0.5, -0.1, 0.8);

    cube.tick = (delta : number) => {
        cube.rotateX(delta);
        cube.rotateY(delta);
    };

    return cube;
}

export { createCube };