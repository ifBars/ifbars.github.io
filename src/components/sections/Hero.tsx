import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';

export default function Hero() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const { setIntroComplete } = usePortfolioStore();
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const sparkMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Enable tone mapping for better metallic reflections
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const tubularSegments = 120;
    const radialSegments = 16;
    const geometry = new THREE.TorusKnotGeometry(9, 2.5, tubularSegments, radialSegments);

    // Create environment map for reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    const envScene = new THREE.Scene();
    const envLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    envLight1.position.set(1, 1, 1);
    envScene.add(envLight1);
    const envLight2 = new THREE.DirectionalLight(0xd4af37, 0.5);
    envLight2.position.set(-1, -1, -1);
    envScene.add(envLight2);
    const envLight3 = new THREE.AmbientLight(0xffffff, 0.3);
    envScene.add(envLight3);
    
    const envMap = pmremGenerator.fromScene(envScene, 0.04);
    const envTexture = envMap.texture;

    // Create custom shader material for progressive reveal effect with reflections and clear coat
    const vertexShader = `
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vPosition = position;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform float uProgress;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform samplerCube uEnvMap;
      uniform float uMetallic;
      uniform float uRoughness;
      uniform float uClearCoat;
      uniform float uClearCoatRoughness;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      // Simple Fresnel calculation
      float fresnel(vec3 viewDir, vec3 normal) {
        return pow(1.0 - max(dot(viewDir, normal), 0.0), 2.0);
      }
      
      // Approximate environment map sampling with reflection
      vec3 getReflection(vec3 normal, vec3 viewDir, float roughness) {
        vec3 reflectDir = reflect(-viewDir, normal);
        // Add roughness-based blur approximation
        vec4 envColor = texture(uEnvMap, reflectDir);
        return envColor.rgb;
      }
      
      void main() {
        // Calculate parametric position along the torus knot path
        // For a torus knot, we use the angle around the major radius and minor radius
        
        // Major radius angle (around the torus center)
        float majorAngle = atan(vPosition.y, vPosition.x);
        
        // Distance from center in XY plane
        float distXY = length(vPosition.xy);
        
        // Minor radius angle (around the tube)
        vec3 localPos = vec3(distXY - 9.0, vPosition.z, 0.0);
        float minorAngle = atan(localPos.y, localPos.x);
        
        // Normalize angles to 0-1 range
        float normalizedMajor = (majorAngle + 3.14159) / (2.0 * 3.14159);
        float normalizedMinor = (minorAngle + 3.14159) / (2.0 * 3.14159);
        
        // Create path parameter that follows the knot's winding
        // Torus knot typically winds p times around major, q times around minor
        // For standard torus knot, we approximate with combined angles
        float pathParam = mod((normalizedMajor * 3.0 + normalizedMinor * 2.0) * 0.2, 1.0);
        
        // Alternative: simpler approach using distance along the curve
        // Use a combination that creates a smooth progressive reveal
        float altPathParam = mod((normalizedMajor + normalizedMinor * 0.5) * 1.2, 1.0);
        pathParam = altPathParam;
        
        // Create smooth reveal with fade at the leading edge
        float fadeRange = 0.05;

        // Calculate reveal: parts before progress should be fully visible
        // Parts near the current progress get a smooth fade
        float reveal;

        // When progress is complete (>= 1.0), show everything
        if (uProgress >= 1.0) {
          reveal = 1.0;
        } else if (pathParam < uProgress - fadeRange) {
          // Already drawn - keep it fully visible
          reveal = 1.0;
        } else if (pathParam <= uProgress) {
          // In the fade zone - smooth transition from 0 to 1
          reveal = smoothstep(uProgress - fadeRange, uProgress, pathParam);
        } else {
          // Not drawn yet - hide it
          reveal = 0.0;
        }
        
        // Discard fragments that aren't drawn yet
        if (reveal <= 0.0) {
          discard;
        }
        
        // Normalize vectors
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Base color (darker grey)
        vec3 baseColor = uColor;
        
        // Calculate reflections
        vec3 reflection = getReflection(normal, viewDir, uRoughness);
        
        // Mix base color with reflection based on metallicness
        // Keep some base color visible even at high metallicness
        vec3 materialColor = mix(baseColor, mix(baseColor, reflection, 0.8), uMetallic);
        
        // Add clear coat layer
        float fresnelFactor = fresnel(viewDir, normal);
        vec3 clearCoatReflection = getReflection(normal, viewDir, uClearCoatRoughness);
        // Clear coat should enhance but not completely replace the base color
        vec3 finalColor = mix(materialColor, mix(materialColor, clearCoatReflection, 0.7), uClearCoat * fresnelFactor);
        
        // Apply opacity with reveal
        gl_FragColor = vec4(finalColor, uOpacity * reveal);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0.0 },
        uColor: { value: new THREE.Color(0x7a7a7a) }, // Darker grey
        uOpacity: { value: 0.95 },
        uEnvMap: { value: envTexture },
        uMetallic: { value: 0.6 },
        uRoughness: { value: 0.2 },
        uClearCoat: { value: 0.9 },
        uClearCoatRoughness: { value: 0.1 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      wireframe: true,
      side: THREE.DoubleSide
    });

    materialRef.current = material;

    const torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.position.y = 3;
    scene.add(torusKnot);
    meshRef.current = torusKnot;

    const sparkCount = 100;
    const sparkGeo = new THREE.CircleGeometry(0.175, 3);
    sparkGeo.rotateY(-Math.PI / 2);

    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0,
      depthTest: false
    });

    sparkMaterialRef.current = sparkMat;

    const sparks = new THREE.InstancedMesh(sparkGeo, sparkMat, sparkCount);
    torusKnot.add(sparks);

    const dummy = new THREE.Object3D();
    const sparkData: Array<{ speed: number; progress: number; pathIndex: number }> = [];
    for (let i = 0; i < sparkCount; i++) {
      sparkData.push({
        speed: 0.001 + Math.random() * 0.002,
        progress: Math.random(),
        pathIndex: Math.floor(Math.random() * radialSegments)
      });
    }

    const posAttribute = geometry.attributes.position;
    const stride = radialSegments + 1;
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();

    const updateSparks = () => {
      sparkData.forEach((spark, i) => {
        spark.progress += spark.speed;
        if (spark.progress >= 1) spark.progress = 0;

        const exactInd = spark.progress * tubularSegments;
        const u = Math.floor(exactInd);
        const nextU = (u + 1) % tubularSegments;
        const v = spark.pathIndex;

        const idx1 = (u * stride + v) * 3;
        const idx2 = (nextU * stride + v) * 3;

        v1.fromArray(posAttribute.array, idx1);
        v2.fromArray(posAttribute.array, idx2);

        v1.lerp(v2, exactInd - u);

        dummy.position.copy(v1);
        dummy.lookAt(v2);
        dummy.updateMatrix();
        sparks.setMatrixAt(i, dummy.matrix);
      });
      sparks.instanceMatrix.needsUpdate = true;
    };

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xD4AF37, 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xC0C0C0, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.001;
      mouseY = (event.clientY - windowHalfY) * 0.001;
    };

    document.addEventListener('mousemove', handleMouseMove);

    let animationFrameId = 0;
    const animate = () => {
      torusKnot.rotation.y += 0.003;
      torusKnot.rotation.x += 0.001;

      targetRotationY = mouseX * 0.5;
      targetRotationX = mouseY * 0.5;

      torusKnot.rotation.y += 0.05 * (targetRotationY - torusKnot.rotation.y);
      torusKnot.rotation.x += 0.05 * (targetRotationX - torusKnot.rotation.x);

      updateSparks();
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
    };

    window.addEventListener('resize', handleResize);

    const startTime = Date.now();
    const duration = 2000;
    
    const animateMeshFill = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      // Update shader uniform for progressive reveal
      if (materialRef.current) {
        materialRef.current.uniforms.uProgress.value = easedProgress;
      }
      
      // Animate sparks opacity along with mesh drawing
      // Sparks appear as the mesh is being drawn
      if (sparkMaterialRef.current) {
        // Sparks fade in as the mesh draws, slightly trailing the drawing edge
        const sparkProgress = Math.min(progress * 0.9, 1); // Slightly slower to trail the drawing
        const sparkEasedProgress = 1 - Math.pow(1 - sparkProgress, 2);
        sparkMaterialRef.current.opacity = sparkEasedProgress * 0.85; // Target opacity is 0.85
      }
      
      if (progress < 1) {
        requestAnimationFrame(animateMeshFill);
      } else {
        // Mesh animation complete, fade in content
        setContentVisible(true);
        setIntroComplete();
      }
    };
    
    // Start the mesh fill animation
    animateMeshFill();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="h-[calc(100vh-70px)] md:h-[calc(100vh-75px)] relative flex flex-col justify-center items-center px-6 pb-6 pointer-events-none">
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-100"
        style={{ pointerEvents: 'none' }}
      />
      {/* Only show gradient overlay after animation completes */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.08),transparent_35%),radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.05),transparent_30%)] mix-blend-screen transition-opacity duration-700 ${contentVisible ? 'opacity-100' : 'opacity-0'}`} />

      <div className={`hero-content relative flex flex-col items-center text-center gap-4 z-10 max-w-4xl transition-opacity duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center leading-[0.9]">
          <h1 className="font-serif-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white fade-up delay-100 drop-shadow-[0_18px_48px_rgba(0,0,0,0.65)]">
            Software
          </h1>
          <div className="h-2 md:h-4" />
          <h1 className="font-serif-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white italic fade-up delay-200 drop-shadow-[0_18px_48px_rgba(0,0,0,0.65)]">
            Developer
          </h1>
        </div>
        <p className="font-serif-body text-xs md:text-sm text-neutral-400 max-w-2xl fade-up delay-200">
          I started programming in 2013 as a kid who had a huge passion for computers and wanted to learn how to make them do things. 12 years later, younger me would be proud of what I've accomplished.
        </p>
      </div>

      <div className={`hero-social flex flex-wrap justify-center gap-4 mt-6 z-10 pointer-events-auto transition-opacity duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <a
          href="https://github.com/ifBars"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500 hover:text-[#D4AF37] transition-all duration-300 hover:scale-110"
          aria-label="GitHub"
        >
          <i className="fab fa-github text-3xl"></i>
        </a>
        <a
          href="https://open.spotify.com/user/31vogks3tg4am4wa3t2yya6nrpmm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500 hover:text-green-500 transition-all duration-300 hover:scale-110"
          aria-label="Spotify"
        >
          <i className="fab fa-spotify text-3xl"></i>
        </a>
        <a
          href="https://steamcommunity.com/id/ifbars/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500 hover:text-blue-500 transition-all duration-300 hover:scale-110"
          aria-label="Steam"
        >
          <i className="fab fa-steam text-3xl"></i>
        </a>
        <a
          href="https://next.nexusmods.com/profile/IfBars/mods"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500 hover:text-[#D4AF37] transition-all duration-300 hover:scale-110"
          aria-label="Nexus Mods"
        >
          <img
            src="/nexuslogo.webp"
            alt="Nexus Mods"
            className="w-8 h-8 object-contain filter grayscale brightness-150 opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:brightness-100"
          />
        </a>
        <a
          href="https://ko-fi.com/ifbars"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500 hover:text-[#FF5E5B] transition-all duration-300 hover:scale-110"
          aria-label="Ko-fi"
        >
          <i className="fas fa-mug-hot text-3xl"></i>
        </a>
      </div>

      <div className={`hero-explore mt-6 md:mt-8 pointer-events-auto z-10 transition-opacity duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={scrollToProjects}
          className="group relative inline-flex items-center gap-3 px-6 py-3 border border-neutral-800 hover:border-[#D4AF37]/60 rounded-full bg-black/40 backdrop-blur-md transition-all duration-500 overflow-hidden cursor-pointer shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        >
          <span className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          <span className="font-serif-body text-xs text-neutral-300 group-hover:text-white relative z-10 tracking-wide">
            Explore My Projects
          </span>
          <i className="fas fa-arrow-down text-xs text-neutral-400 group-hover:text-[#D4AF37] relative z-10 transition-colors" />
        </button>
      </div>
    </section>
  );
}
