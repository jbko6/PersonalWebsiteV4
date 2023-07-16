import { Mesh, MeshToonMaterial, Sphere, SphereGeometry } from "three";

import { UpdatingObject } from "../util/types";

function createSphere() : UpdatingObject & Mesh {
    const geometry = new SphereGeometry(2);

    const material = new MeshToonMaterial({color:'green'});

    const mesh : UpdatingObject & Mesh = new Mesh(geometry, material);

    let timeElapsed = 0.0;

    mesh.tick = (delta : number) => {
        timeElapsed += delta;
        mesh.position.y = Math.sin(timeElapsed);
    };

    return mesh;
}

export { createSphere };