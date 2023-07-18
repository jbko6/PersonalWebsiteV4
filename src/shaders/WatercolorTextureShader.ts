const WatercolorTextureShader = {
    name: "WatercolorShader",

    uniforms: {
        'screen': {value:null}, // the screen texture, uniform name custom set with ShaderPass
        'paperTexture' : {value:null},
        'paperGrain' : {value:1.0},
        'backgroundOpacity' : {value: 1.0}
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
        uniform sampler2D paperTexture;
        uniform float paperGrain;
        uniform float backgroundOpacity;

        varying vec2 vUv;

        vec3 grayscale(vec3 color) {
            return vec3(0.21 * color.r + 0.71 * color.g + 0.07 * color.b);
        }

        void main() {
            vec2 screenSize = vec2(textureSize(screen, 0));
            float screenRatio = screenSize.x / screenSize.y;

            vec4 screenColor = texture2D(screen, vUv);

            // load paper texture
            vec3 paperTexel = texture2D(paperTexture, vec2(vUv.x * screenRatio, vUv.y) * paperGrain).rgb;

            vec4 paperScreenColor = screenColor * vec4(grayscale(paperTexel), screenColor.a);

            vec4 color = screenColor.a < 0.05 ? vec4(paperTexel, backgroundOpacity) : paperScreenColor;

            gl_FragColor = color;
        }
    `
};

export { WatercolorTextureShader };