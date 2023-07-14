const WatercolorShader = {
    name: "WatercolorShader",

    uniforms: {
        'screen': {value:null}, // the screen texture, uniform name custom set with ShaderPass
        'paperTexture' : {value:null},
        'normalPaperTexture': {value:null},
        'wobbleGrain' : {value: 0.2},
        'wobbleIntensity' : {value: 0.1},
        'paperGrain' : {value:1.0},
        'noiseGrain' : {value: 1.5},
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
            #define PI 3.1415926538

        uniform sampler2D screen;
        uniform sampler2D paperTexture;
        uniform sampler2D normalPaperTexture;
        uniform float wobbleGrain;
        uniform float paperGrain;
        uniform float noiseGrain;
        uniform float wobbleIntensity;
        uniform float backgroundOpacity;

        varying vec2 vUv;

        mat3 G[9] = mat3[](
            1.0/(2.0*sqrt(2.0)) * mat3( 1.0, sqrt(2.0), 1.0, 0.0, 0.0, 0.0, -1.0, -sqrt(2.0), -1.0 ),
            1.0/(2.0*sqrt(2.0)) * mat3( 1.0, 0.0, -1.0, sqrt(2.0), 0.0, -sqrt(2.0), 1.0, 0.0, -1.0 ),
            1.0/(2.0*sqrt(2.0)) * mat3( 0.0, -1.0, sqrt(2.0), 1.0, 0.0, -1.0, -sqrt(2.0), 1.0, 0.0 ),
            1.0/(2.0*sqrt(2.0)) * mat3( sqrt(2.0), -1.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, -sqrt(2.0) ),
            1.0/2.0 * mat3( 0.0, 1.0, 0.0, -1.0, 0.0, -1.0, 0.0, 1.0, 0.0 ),
            1.0/2.0 * mat3( -1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, -1.0 ),
            1.0/6.0 * mat3( 1.0, -2.0, 1.0, -2.0, 4.0, -2.0, 1.0, -2.0, 1.0 ),
            1.0/6.0 * mat3( -2.0, 1.0, -2.0, 1.0, 4.0, 1.0, -2.0, 1.0, -2.0 ),
            1.0/3.0 * mat3( 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0 )
        );

        float getEdgeValue(vec2 position, vec2 screenSize) {
            mat3 I;
            float cnv[9];
            vec3 pixelSample;

            /* fetch the 3x3 neighbourhood and use the RGB vector's length as intensity value */
            for (int i=0; i<3; i++)
            for (int j=0; j<3; j++) {
                vec2 pixelPosition = position + vec2(i-1,j-1);
                pixelSample = texture2D( screen, vec2(pixelPosition.x / screenSize.x, pixelPosition.y / screenSize.y) ).rgb;
                I[i][j] = length(pixelSample); 
            }
            
            /* calculate the convolution values for all the masks */
            for (int i=0; i<9; i++) {
                float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
                cnv[i] = dp3 * dp3; 
            }

            float M = (cnv[0] + cnv[1]) + (cnv[2] + cnv[3]);
            float S = (cnv[4] + cnv[5]) + (cnv[6] + cnv[7]) + (cnv[8] + M); 
            
            return sqrt(M/S);
        }

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

            // load watercolor normal
            float nPaperRatio = float(textureSize(normalPaperTexture, 0).y) / float(textureSize(normalPaperTexture, 0).x);
            vec3 N = normalize(texture2D(normalPaperTexture, vec2(vUv.x * screenRatio, vUv.y) * wobbleGrain).xyz * 2.0 - 1.0) * wobbleIntensity;
            ivec2 pixel = ivec2(gl_FragCoord.x + (N.x*255.0), gl_FragCoord.y + (N.y*255.0));

            float edgeValue = getEdgeValue(vec2(pixel), screenSize);
            float invertedEdgeValue = 1.0 - edgeValue;
            float finalDarkenedEdge = invertedEdgeValue;
            
            vec4 screenColor = texture2D(screen, vec2(float(pixel.x) / screenSize.x, float(pixel.y) / screenSize.y));

            float noise = min(max(rand(vec2(vUv)), 0.2), 0.5);
            float noise2 = min(max(rand(vec2(vUv)), 0.2), 0.5);
            vec4 noisyScreenColor = screenColor + vec4(vec3((((noise + noise2) / 2.0) /20.0) * 2.0 - 0.05), screenColor.a);

            float perlinNoise = min(max(smoothNoise(vUv*noiseGrain), 0.0), 1.0);
            float filteredPerlinNoise = max(perlinNoise - abs(smoothNoise(vUv*(noiseGrain/4.0))), 0.0) / 5.0;
            vec4 perlinNoisyScreenColor = noisyScreenColor + vec4(vec3(filteredPerlinNoise), screenColor.a);

            // load paper texture
            vec3 paperTexel = texture2D(paperTexture, vec2(vUv.x * screenRatio, vUv.y) * paperGrain).rgb;
            vec4 paperScreenColor = perlinNoisyScreenColor * vec4(grayscale(paperTexel), screenColor.a);

            vec4 finalScreenColor = screenColor.a >= 0.5 ? paperScreenColor : screenColor;

            vec4 color = screenColor.a < 0.5 ? vec4(paperTexel, backgroundOpacity) : finalScreenColor;

            gl_FragColor = color;
        }
    `
};

export { WatercolorShader };