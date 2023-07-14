import { TextureLoader, type Camera, type Scene, type WebGLRenderer, RepeatWrapping } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import { WatercolorShader } from "../shaders/WatercolorShader";

function createEffectComposer(renderer : WebGLRenderer, scene : Scene, camera : Camera) {
    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const watercolorPass = new ShaderPass(WatercolorShader, "screen"); // set the screen texture uniform to screen
    const textureLoader = new TextureLoader();
    const paperNormal = textureLoader.load("./assets/textures/watercolorpaper_normal.jpg");
    paperNormal.wrapS = RepeatWrapping;
    paperNormal.wrapT = RepeatWrapping;
    const paper = textureLoader.load('./assets/textures/watercolorpaper.jpg');
    paper.wrapS = RepeatWrapping;
    paper.wrapT = RepeatWrapping;
    watercolorPass.uniforms.normalPaperTexture.value = paperNormal;
    watercolorPass.uniforms.paperTexture.value = paper;
    composer.addPass(watercolorPass);

    return composer;
}

export { createEffectComposer };