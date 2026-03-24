import { memo, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh, ShaderMaterial, Vector2, Vector3 } from 'three';

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_cursor_offset;
  uniform vec3 u_accent;
  uniform vec3 u_background;
  varying vec2 vUv;

  #define MAX_STEPS 80
  #define MAX_DIST 20.0
  #define SURF_DIST 0.001

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }

  float getDist(vec3 p, float t) {
    vec3 blob1 = vec3(
      2.1 + sin(t * 0.5) * 1.6,
      cos(t * 0.4) * 1.2,
      sin(t * 0.3 + 1.0) * 0.9 + 5.0
    );

    vec3 blob2 = vec3(
      2.1 + cos(t * 0.6 + 2.0) * 1.35,
      sin(t * 0.35 + 1.5) * 1.35,
      cos(t * 0.45) * 1.0 + 5.3
    );

    vec3 blob3 = vec3(
      2.1 + sin(t * 0.45 + 4.0) * 1.2,
      cos(t * 0.55 + 3.0) * 1.05,
      sin(t * 0.5 + 2.5) * 0.6 + 4.35
    );

    blob1.xy += u_cursor_offset * vec2(1.0, 0.9);
    blob2.xy += u_cursor_offset * vec2(0.82, 1.05);
    blob3.xy += u_cursor_offset * vec2(1.08, 0.95);

    float d1 = sdSphere(p - blob1, 0.95 + sin(t * 1.1) * 0.15);
    float d2 = sdSphere(p - blob2, 0.85 + cos(t * 0.9) * 0.12);
    float d3 = sdSphere(p - blob3, 1.15 + sin(t * 1.3 + 1.0) * 0.18);

    float d = smin(d1, d2, 0.8);
    d = smin(d, d3, 0.8);

    return d;
  }

  float rayMarch(vec3 ro, vec3 rd, float t) {
    float dO = 0.0;

    for(int i = 0; i < MAX_STEPS; i++) {
      vec3 p = ro + rd * dO;
      float dS = getDist(p, t);
      dO += dS;
      if(dO > MAX_DIST || abs(dS) < SURF_DIST) break;
    }

    return dO;
  }

  vec3 getNormal(vec3 p, float t) {
    float d = getDist(p, t);
    vec2 e = vec2(0.001, 0.0);

    vec3 n = d - vec3(
      getDist(p - e.xyy, t),
      getDist(p - e.yxy, t),
      getDist(p - e.yyx, t)
    );

    return normalize(n);
  }

  void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= u_resolution.x / u_resolution.y;
    float t = u_time * 0.6;

    vec3 ro = vec3(0.0, 0.0, 0.0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1.5));

    float d = rayMarch(ro, rd, t);

    vec3 bgColor = u_background;
    vec3 color = bgColor;

    if(d < MAX_DIST) {
      vec3 p = ro + rd * d;
      vec3 n = getNormal(p, t);

      vec3 lightPos = vec3(3.0, 4.0, 1.0);
      vec3 lightDir = normalize(lightPos - p);

      float diff = max(dot(n, lightDir), 0.0);
      float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
      float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 2.0);
      float spec = pow(max(dot(n, normalize(lightDir - rd)), 0.0), 32.0);

      vec3 goldBase = vec3(0.95, 0.8, 0.36);
      vec3 goldHighlight = vec3(1.0, 0.92, 0.55);
      vec3 rimColor = goldHighlight * 1.2;

      color = goldBase * diff;
      color += goldHighlight * fresnel * 0.4;
      color += goldHighlight * spec * 0.5;
      color += rimColor * rim * 0.6;
      color += u_accent * 0.12;

      float fog = smoothstep(4.0, MAX_DIST, d);
      color = mix(color, bgColor, fog);

      color = floor(color * 8.0) / 8.0;
    } else {
      float grad = length(uv) * 0.3;
      color = mix(bgColor, u_accent * 0.05, grad);
    }

    color = mix(bgColor, color, 0.6);

    float vignette = 1.0 - length(vUv - 0.5) * 0.8;
    vignette = smoothstep(0.3, 1.0, vignette);
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface PointerInteraction {
  targetOffset: Vector2;
}

const NeonGooMesh = memo(({ interactionRef }: { interactionRef: React.RefObject<PointerInteraction> }) => {
  const meshRef = useRef<Mesh>(null);
  const { size } = useThree();

  const uniformsRef = useRef({
    u_time: { value: 0 },
    u_resolution: { value: new Vector2(size.width, size.height) },
    u_cursor_offset: { value: new Vector2(0, 0) },
    u_accent: { value: new Vector3(0.95, 0.8, 0.36) },
    u_background: { value: new Vector3(0.0196, 0.0196, 0.0196) },
  });
  const uniforms = uniformsRef.current;

  useEffect(() => {
    uniforms.u_resolution.value.set(size.width, size.height);
  }, [size.height, size.width, uniforms]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const material = meshRef.current.material as ShaderMaterial;
      const interaction = interactionRef.current;
      const offsetEase = 1 - Math.exp(-delta * 3);

      material.uniforms.u_time.value = state.clock.getElapsedTime();
      if (interaction) {
        material.uniforms.u_cursor_offset.value.lerp(interaction.targetOffset, offsetEase);
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});

export default function HeroShader() {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<PointerInteraction>({
    targetOffset: new Vector2(0, 0),
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const updatePointer = (event: PointerEvent) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) {
        return;
      }

      const normalizedX = (event.clientX - rect.left) / rect.width;
      const normalizedY = (event.clientY - rect.top) / rect.height;
      const pointerUvX = (normalizedX * 2 - 1) * (rect.width / rect.height);
      const pointerUvY = (0.5 - normalizedY) * 2;

      interactionRef.current.targetOffset.set(pointerUvX * 0.18, pointerUvY * 0.14);
    };

    window.addEventListener('pointermove', updatePointer);
    window.addEventListener('pointerdown', updatePointer);

    return () => {
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerdown', updatePointer);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.08),transparent_45%),radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.04),transparent_40%)]" />
      <Canvas
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1], left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <NeonGooMesh interactionRef={interactionRef} />
      </Canvas>
    </div>
  );
}
