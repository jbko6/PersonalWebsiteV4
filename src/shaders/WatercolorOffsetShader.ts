const WatercolorOffsetShader = {
    name: "WatercolorOffsetShader",

    uniforms: {
        'screen': {value:null}, // the screen texture, uniform name custom set with ShaderPass
        'normalPaperTexture': {value:null},
        'wobbleGrain' : {value: 0.2},
        'wobbleIntensity' : {value: 0.1}
    },

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `

        uniform sampler2D screen;
        uniform sampler2D normalPaperTexture;
        uniform float wobbleGrain;
        uniform float wobbleIntensity;

        varying vec2 vUv;

        void main() {
            vec2 screenSize = vec2(textureSize(screen, 0));
            float screenRatio = screenSize.x / screenSize.y;

            // load watercolor normal
            float nPaperRatio = float(textureSize(normalPaperTexture, 0).y) / float(textureSize(normalPaperTexture, 0).x);
            vec3 N = normalize(texture2D(normalPaperTexture, vec2(vUv.x * screenRatio, vUv.y) * wobbleGrain).xyz * 2.0 - 1.0) * wobbleIntensity;
            ivec2 pixel = ivec2((screenSize.x * vUv.x) + (N.x*255.0), (screenSize.y * vUv.y) + (N.y*255.0));
            
            vec4 screenColor = texture2D(screen, vec2(float(pixel.x) / screenSize.x, float(pixel.y) / screenSize.y));

            gl_FragColor = screenColor;
        }
    `
};

export { WatercolorOffsetShader };