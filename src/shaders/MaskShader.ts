const MaskShader = {
    uniforms: {
        'screen': {value:null},
        'mask': {value:null}
    },

    vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

    fragmentShader: `
        uniform sampler2D screen;
        uniform sampler2D mask;

        varying vec2 vUv;

        void main() {
            gl_FragColor = vec4(texture2D(screen, vUv).rgb, texture2D(mask, vUv).a);
        }
    `
}

export { MaskShader };