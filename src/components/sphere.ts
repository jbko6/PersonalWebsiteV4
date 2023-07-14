import { Mesh, MeshToonMaterial, SphereGeometry } from "three";

import { UpdatingObject } from "../util/types";

function createSphere() : UpdatingObject & Mesh {
    const geometry = new SphereGeometry(2);

    const material = new MeshToonMaterial({color:'green'});

    const mesh : UpdatingObject & Mesh = new Mesh(geometry, material);

    return mesh;
}

export { createSphere };