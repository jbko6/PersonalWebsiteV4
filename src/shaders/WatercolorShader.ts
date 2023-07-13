const WatercolorShader = {
    name: "WatercolorShader",

    uniforms: {
        'screen': {value:null} // the screen texture, uniform name custom set with ShaderPass
    },

    vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        uniform sampler2D screen;

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

        void main() {
            mat3 I;
            float cnv[9];
            vec3 pixelSample;

            vec2 screenSize = vec2(textureSize(screen, 0));

            vec4 screenColor = texture2D(screen, vec2(gl_FragCoord.x / screenSize.x, gl_FragCoord.y / screenSize.y));
            
            /* fetch the 3x3 neighbourhood and use the RGB vector's length as intensity value */
            for (int i=0; i<3; i++)
            for (int j=0; j<3; j++) {
                vec2 pixelPosition = vec2(gl_FragCoord.xy) + vec2(i-1,j-1);
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
            
            float edgeAmount = sqrt(M/S);

            gl_FragColor = screenColor + vec4(edgeAmount, edgeAmount, edgeAmount, 1.0);
        }
    `
};

export { WatercolorShader };