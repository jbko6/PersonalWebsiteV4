import { Color, Scene } from 'three';

function createScene() : Scene {
    const scene = new Scene();

    //scene.background = new Color('white');

    return scene;
}

export { createScene };