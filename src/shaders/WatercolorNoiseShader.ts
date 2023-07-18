const WatercolorNoiseShader = {
    name: "WatercolorShader",

    uniforms: {
        'screen': {value:null}, // the screen texture, uniform name custom set with ShaderPass
        'noiseGrain' : {value: 1.5}
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
        uniform float noiseGrain;

        varying vec2 vUv;

        float rand(vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}

        vec2 hash( vec2 p ) {
            p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
            return -1.0 + 2.0*fract(sin(p)*43758.5453123);
        }

        float m_noise( in vec2 p ) {
            const float K1 = 0.366025404; // (sqrt(3)-1)/2;
            const float K2 = 0.211324865; // (3-sqrt(3))/6;

            vec2  i = floor( p + (p.x+p.y)*K1 );
            vec2  a = p - i + (i.x+i.y)*K2;
            float m = step(a.y,a.x); 
            vec2  o = vec2(m,1.0-m);
            vec2  b = a - o + K2;
            vec2  c = a - 1.0 + 2.0*K2;
            vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
            vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
            return dot( n, vec3(70.0) );
        }

        float smoothNoise(in vec2 p) {
            p *= 5.0;
            mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
            float f  = 0.5000*m_noise( p ); p = m*p;
            f += 0.2500*m_noise( p ); p = m*p;
            f += 0.1250*m_noise( p ); p = m*p;
            f += 0.0625*m_noise( p ); p = m*p;

            return f;
        }

        vec3 grayscale(vec3 color) {
            return vec3(0.21 * color.r + 0.71 * color.g + 0.07 * color.b);
        }

        void main() {
            vec2 screenSize = vec2(textureSize(screen, 0));
            float screenRatio = screenSize.x / screenSize.y;

            vec4 screenColor = texture2D(screen, vUv);

            float noise = min(max(rand(vec2(vUv)), 0.2), 0.5);
            float noise2 = min(max(rand(vec2(vUv)), 0.2), 0.5);
            vec4 noisyScreenColor = screenColor + vec4(vec3((((noise + noise2) / 2.0) /20.0) * 2.0 - 0.05) * screenColor.a, screenColor.a);

            float perlinNoise = min(max(smoothNoise((vUv)*noiseGrain), 0.0), 1.0);
            float filteredPerlinNoise = max(perlinNoise - abs(smoothNoise((vUv)*(noiseGrain/4.0))), 0.0) / 5.0;
            vec4 perlinNoisyScreenColor = noisyScreenColor + vec4(vec3(filteredPerlinNoise) * screenColor.a, screenColor.a);

            gl_FragColor = perlinNoisyScreenColor;
        }
    `
};

export { WatercolorNoiseShader };