import { TextureLoader, type Camera, type Scene, type WebGLRenderer, RepeatWrapping, Vector2, PerspectiveCamera } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";

import { WatercolorShader } from "../shaders/WatercolorShader";
import { UpdatingObject } from "../util/types";

function createEffectComposer(renderer : WebGLRenderer, scene : Scene, camera : PerspectiveCamera) {
    const composer : EffectComposer & UpdatingObject = new EffectComposer(renderer);

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

    const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
    composer.addPass(smaaPass);

    composer.tick = (delta) => {
        watercolorPass.uniforms.paperOffset.value = new Vector2(window.innerWidth * camera.rotation.y / camera.fov, window.innerHeight * camera.rotation.x / camera.fov).multiply(new Vector2(-0.03, -0.07));
    }

    return composer;
}

export { createEffectComposer };