import { AmbientLight, DirectionalLight, Light } from 'three';

function createLights() : Light[] {
    const lights : Light[] = [];

    const ambientLight = new AmbientLight('white', 0.5);

    lights.push(ambientLight);

    const dirLight = new DirectionalLight('white', 1);

    dirLight.position.set(10,10,10);

    lights.push(dirLight);

    return lights;
}

export { createLights };