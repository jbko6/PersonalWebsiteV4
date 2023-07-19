import { Vector2 } from 'three';

const WatercolorEdgeShader = {

	uniforms: {

		'screen': { value: null },
		'resolution': { value: new Vector2(1024, 1024) }

	},

	vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: `

		uniform sampler2D screen;
		uniform vec2 resolution;
		varying vec2 vUv;

        vec3 grayscale(vec3 color) {
            return vec3(0.21 * color.r + 0.71 * color.g + 0.07 * color.b);
        }

		void main() {

            vec4 screenColor = texture2D(screen, vUv);

			vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

		// kernel definition (in glsl matrices are filled in column-major order)

			const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 ); // x direction kernel
			const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 ); // y direction kernel

		// fetch the 3x3 neighbourhood of a fragment

		// first column

			float tx0y0 = grayscale(texture2D( screen, vUv + texel * vec2( -1, -1 ) ).rgb).r;
			float tx0y1 = grayscale(texture2D( screen, vUv + texel * vec2( -1,  0 ) ).rgb).r;
			float tx0y2 = grayscale(texture2D( screen, vUv + texel * vec2( -1,  1 ) ).rgb).r;

		// second column

			float tx1y0 = grayscale(texture2D( screen, vUv + texel * vec2(  0, -1 ) ).rgb).r;
			float tx1y1 = grayscale(texture2D( screen, vUv + texel * vec2(  0,  0 ) ).rgb).r;
			float tx1y2 = grayscale(texture2D( screen, vUv + texel * vec2(  0,  1 ) ).rgb).r;

		// third column

			float tx2y0 = grayscale(texture2D( screen, vUv + texel * vec2(  1, -1 ) ).rgb).r;
			float tx2y1 = grayscale(texture2D( screen, vUv + texel * vec2(  1,  0 ) ).rgb).r;
			float tx2y2 = grayscale(texture2D( screen, vUv + texel * vec2(  1,  1 ) ).rgb).r;

		// gradient value in x direction

			float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
				Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
				Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

		// gradient value in y direction

			float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
				Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
				Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

		// magnitute of the total gradient

			float G = sqrt( ( valueGx * valueGx ) + ( valueGy * valueGy ) );

			gl_FragColor = vec4(vec3(min(G, 0.2)), 1.0);

		}`

};

export { WatercolorEdgeShader };
