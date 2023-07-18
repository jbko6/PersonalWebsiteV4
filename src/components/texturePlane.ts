import { Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { degToRad } from "three/src/math/MathUtils";
import { UpdatingObject } from "../util/types";

function createTexturePlane(effectComposer : EffectComposer) : Mesh & UpdatingObject {
    const geometry = new PlaneGeometry(5, 5);

    const material = new MeshBasicMaterial({map: effectComposer.renderTarget1.texture});

    const mesh : Mesh & UpdatingObject = new Mesh(geometry, material);

    mesh.position.z = 497;

    return mesh;
}

export { createTexturePlane };