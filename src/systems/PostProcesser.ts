import { TextureLoader, type Camera, type Scene, type WebGLRenderer, RepeatWrapping, Vector2, PerspectiveCamera, Color } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { BrightnessContrastShader } from "three/examples/jsm/shaders/BrightnessContrastShader";

import { WatercolorTextureShader } from "../shaders/WatercolorTextureShader";
import { WatercolorOffsetShader } from "../shaders/WatercolorOffsetShader";
import { WatercolorNoiseShader } from "../shaders/WatercolorNoiseShader";
import { UpdatingObject } from "../util/types";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { WatercolorEdgeShader } from "../shaders/WatercolorEdgeShader";
import { WatercolorEdgeBlurShader } from "../shaders/WatercolorEdgeBlurShader";
import { BlendShader } from "../shaders/BlendShader";

class PostProcesser {

    renderComposer : EffectComposer;
    edgeComposer : EffectComposer;
    mainComposer : EffectComposer;

    constructor(renderer : WebGLRenderer, scene : Scene, camera : PerspectiveCamera) {
        const textureLoader = new TextureLoader();

        // RENDER COMPOSER - renders scene for main composers

        this.renderComposer = new EffectComposer(renderer);
        this.renderComposer.renderToScreen = false;

        const renderPass = new RenderPass(scene, camera);
        renderPass.clear = true;
        this.renderComposer.addPass(renderPass);

        // EDGE COMPOSER - picks out edges from the scene

        this.edgeComposer = new EffectComposer(renderer);
        this.edgeComposer.renderToScreen = false;

        this.edgeComposer.addPass(renderPass);
        
        const edgePass = new ShaderPass(WatercolorEdgeShader, "screen");
        this.edgeComposer.addPass(edgePass);

        const edgeBlurPass = new ShaderPass(WatercolorEdgeBlurShader, "screen");
        this.edgeComposer.addPass(edgeBlurPass);

        const edgeCopyShader = new ShaderPass(CopyShader);
        this.edgeComposer.addPass(edgeCopyShader);

        // MAIN COMPOSER - takes render and edges, blends them together, then renders the rest of the effects

        this.mainComposer = new EffectComposer(renderer);

        const blendPass = new ShaderPass(BlendShader);
        blendPass.uniforms.render.value = this.renderComposer.readBuffer.texture;
        blendPass.uniforms.edge.value = this.edgeComposer.readBuffer.texture;
        blendPass.uniforms.mixRatio.value = 0.5;
        this.mainComposer.addPass(blendPass);

        const contrastPass = new ShaderPass(BrightnessContrastShader);
        contrastPass.uniforms.contrast.value = -0.25;
        this.mainComposer.addPass(contrastPass);

        const watercolorOffsetPass = new ShaderPass(WatercolorOffsetShader, "screen");
        const paperNormal = textureLoader.load("./assets/textures/watercolorpaper_normal.jpg");
        paperNormal.wrapS = RepeatWrapping;
        paperNormal.wrapT = RepeatWrapping;
        watercolorOffsetPass.uniforms.normalPaperTexture.value = paperNormal;
        this.mainComposer.addPass(watercolorOffsetPass);

        const waterColorNoisePass = new ShaderPass(WatercolorNoiseShader, "screen");
        this.mainComposer.addPass(waterColorNoisePass);

        const watercolorTexturePass = new ShaderPass(WatercolorTextureShader, "screen");
        const paper = textureLoader.load('./assets/textures/watercolorpaper.jpg');
        paper.wrapS = RepeatWrapping;
        paper.wrapT = RepeatWrapping;
        watercolorTexturePass.uniforms.paperTexture.value = paper;
        this.mainComposer.addPass(watercolorTexturePass);

        const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
        this.mainComposer.addPass(smaaPass);

        const copyShader = new ShaderPass(CopyShader);
        copyShader.renderToScreen = false;
        this.mainComposer.addPass(copyShader);
    }

    renderScene(delta : number) {
        this.renderComposer.render(delta);
        this.edgeComposer.render(delta);
        this.mainComposer.render(delta);
    }

    resetComposers() {
        this.renderComposer.reset();
        this.edgeComposer.reset();
        this.mainComposer.reset();
    }
}

export { PostProcesser };