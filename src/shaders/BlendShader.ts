const BlendShader = {

	uniforms: {

		'render': { value: null },
		'edge': { value: null },
		'mixRatio': { value: 0.5 }

	},

	vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: `

		uniform float mixRatio;

		uniform sampler2D render;
		uniform sampler2D edge;

		varying vec2 vUv;

		void main() {

			vec4 renderTexel = texture2D( render, vUv );
			vec4 edgeTexel = texture2D( edge, vUv );
			gl_FragColor = vec4((renderTexel + edgeTexel).rgb, renderTexel.a);

		}`

};

export { BlendShader };
