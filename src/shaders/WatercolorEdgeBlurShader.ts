import { Vector2 } from 'three';

const WatercolorEdgeBlurShader = {

	uniforms: {

		'screen': { value: null },
		'resolution': { value: new Vector2(512, 512) }

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

		void main() {

			vec4 screenColor = texture2D(screen, vUv);

			vec2 direction = vec2(0, 1);

			vec4 color = vec4(0.0);
			vec2 off1 = vec2(1.411764705882353) * direction;
			vec2 off2 = vec2(3.2941176470588234) * direction;
			vec2 off3 = vec2(5.176470588235294) * direction;
			color += texture2D(screen, vUv) * 0.1964825501511404;
			color += texture2D(screen, vUv + (off1 / resolution)) * 0.2969069646728344;
			color += texture2D(screen, vUv - (off1 / resolution)) * 0.2969069646728344;
			color += texture2D(screen, vUv + (off2 / resolution)) * 0.09447039785044732;
			color += texture2D(screen, vUv - (off2 / resolution)) * 0.09447039785044732;
			color += texture2D(screen, vUv + (off3 / resolution)) * 0.010381362401148057;
			color += texture2D(screen, vUv - (off3 / resolution)) * 0.010381362401148057;

			direction = vec2(1, 0);

			off1 = vec2(1.411764705882353) * direction;
			off2 = vec2(3.2941176470588234) * direction;
			off3 = vec2(5.176470588235294) * direction;
			color += texture2D(screen, vUv) * 0.1964825501511404;
			color += texture2D(screen, vUv + (off1 / resolution)) * 0.2969069646728344;
			color += texture2D(screen, vUv - (off1 / resolution)) * 0.2969069646728344;
			color += texture2D(screen, vUv + (off2 / resolution)) * 0.09447039785044732;
			color += texture2D(screen, vUv - (off2 / resolution)) * 0.09447039785044732;
			color += texture2D(screen, vUv + (off3 / resolution)) * 0.010381362401148057;
			color += texture2D(screen, vUv - (off3 / resolution)) * 0.010381362401148057;

			gl_FragColor = vec4(color.rgb, color.r);

		}`

};

export { WatercolorEdgeBlurShader };
