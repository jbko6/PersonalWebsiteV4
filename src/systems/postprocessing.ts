import { type Camera, type Scene, type WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import { WatercolorShader } from "../shaders/WatercolorShader";

function createEffectComposer(renderer : WebGLRenderer, scene : Scene, camera : Camera) {
    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const watercolorPass = new ShaderPass(WatercolorShader, "screen"); // set the screen texture uniform to screen
    composer.addPass(watercolorPass);

    return composer;
}

export { createEffectComposer };