'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
// @ts-ignore
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// @ts-ignore
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// @ts-ignore
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// WebGL capability check function
const checkWebGLCapability = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!context) return false;

    // Type assertion for WebGL context
    const gl = context as WebGLRenderingContext & {
      getExtension(name: string): any;
      getParameter(parameter: number): any;
    };

    // Check for required extensions and capabilities
    const extensions = [
      'OES_texture_float',
      'OES_standard_derivatives'
    ];
    
    const hasRequiredExtensions = extensions.every(ext => gl.getExtension(ext));
    
    // Check memory (if available)
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
      // Filter out known problematic GPUs or low-end mobile GPUs
      if (renderer.includes('intel') || renderer.includes('swiftshader')) {
        return false;
      }
    }

    // Check maximum texture size
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTextureSize < 4096) return false;

    return hasRequiredExtensions;
  } catch (e) {
    return false;
  }
};

const vertexShader = `
  uniform float uSize;
  uniform float uTime;
  uniform sampler2D uEarthTexture;
  varying vec3 vPosition;
  varying float vVisibility;
  varying float vDistance;

  void main() {
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDistance = -mvPosition.z;

    // Sample the earth texture for height
    vec2 uv = vec2(
      0.5 + atan(position.x, position.z) / (2.0 * 3.14159),
      0.5 - asin(position.y / length(position)) / 3.14159
    );
    vec4 earthData = texture2D(uEarthTexture, uv);
    float visibility = earthData.r;
    
    // More aggressive thresholding to eliminate border artifacts
    vVisibility = smoothstep(0.45, 0.7, visibility); // Increased lower threshold to remove border

    // Subtle movement
    float movement = sin(uTime + position.x * 0.2) * 0.15;
    vec3 pos = position;
    pos.y += movement;

    mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec3 vPosition;
  varying float vVisibility;
  varying float vDistance;

  void main() {
    if (vVisibility < 0.3) discard; // Increased discard threshold to remove faint points

    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 2.0);

    float pulse = sin(uTime * 1.5 + vPosition.x * 0.3) * 0.5 + 0.5;
    strength *= 0.98 + pulse * 0.15;

    vec3 color = uColor;
    float alpha = strength * vVisibility * (1.0 - abs(vPosition.z) / 180.0);
    
    float distanceFade = smoothstep(0.0, 180.0, vDistance);
    alpha *= distanceFade;
    alpha *= 1.2;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function DottedGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const [isWebGLCapable, setIsWebGLCapable] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsWebGLCapable(checkWebGLCapability());
  }, []);

  useEffect(() => {
    if (!isWebGLCapable || !canvasRef.current) return;

    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(30, 30, 200);  // Adjusted camera height
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(1002, 1002, false);
      rendererRef.current = renderer;

      // Load Earth texture with better filtering
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('/earth-topology.png', (earthTexture) => {
        earthTexture.minFilter = THREE.LinearFilter;
        earthTexture.magFilter = THREE.LinearFilter;
        earthTexture.generateMipmaps = false; // Disable mipmaps for sharper texture

        // Create higher resolution sphere
        const radius = 60;
        const geometry = new THREE.IcosahedronGeometry(radius, 64); // Increased detail level
        
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uSize: { value: 1.8 }, // Slightly reduced point size
            uColor: { value: new THREE.Color(0xffc62d) },
            uTime: { value: 0 },
            uEarthTexture: { value: earthTexture }
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const pointsMesh = new THREE.Points(geometry, material);
        // Set initial rotation to show North America right-side up
        pointsMesh.rotation.y = Math.PI * 3.6; // Adjusted rotation to flip orientation
        pointsMesh.rotation.x = Math.PI * 0.1; // Positive tilt to show right-side up
        pointsMesh.rotation.z = Math.PI; // Flip upright
        scene.add(pointsMesh);
        pointsRef.current = pointsMesh;

        const ambientLight = new THREE.AmbientLight(0xffc62d, 0.3); // Reduced ambient light intensity
        scene.add(ambientLight);

        const composer = new EffectComposer(renderer);
        composerRef.current = composer;

        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio),
          0.25,   // Reduced bloom strength by 50%
          0.2,    // Reduced radius further
          0.4     // Increased threshold to reduce bloom spread
        );
        composer.addPass(bloomPass);

        const animate = () => {
          if (!composer || !pointsMesh) return;
          
          pointsMesh.rotation.y += 0.0002;
          pointsMesh.rotation.x = Math.PI * 0.2 + Math.sin(Date.now() * 0.0001) * 0.1; // Keep upright tilt while wobbling
          
          const material = pointsMesh.material as THREE.ShaderMaterial;
          material.uniforms.uTime.value = performance.now() * 0.0003;
          material.uniforms.uSize.value = 1.8 * (1 + Math.sin(Date.now() * 0.0003) * 0.15);
          
          composer.render();
          requestAnimationFrame(animate);
        };

        animate();
      });

      const handleResize = () => {
        if (!renderer || !camera || !composerRef.current) return;
        
        const width = 1002;
        const height = 1002;
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(pixelRatio);
        composerRef.current.setSize(width * pixelRatio, height * pixelRatio);
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      const handleContextLost = (event: Event) => {
        console.error('WebGL context lost:', event);
        setHasError(true);
      };

      const handleGlobalError = (event: Event) => {
        console.error('Global error:', event);
        setHasError(true);
      };

      canvasRef.current.addEventListener('webglcontextlost', handleContextLost);
      window.addEventListener('error', handleGlobalError);

      return () => {
        window.removeEventListener('resize', handleResize);
        canvasRef.current?.removeEventListener('webglcontextlost', handleContextLost);
        window.removeEventListener('error', handleGlobalError);
        pointsRef.current?.geometry.dispose();
        (pointsRef.current?.material as THREE.Material)?.dispose();
        composerRef.current?.dispose();
        rendererRef.current?.dispose();
      };
    } catch (error) {
      console.error('WebGL initialization error:', error);
      setHasError(true);
    }
  }, [isWebGLCapable]);

  if (!isWebGLCapable || hasError) {
    return (
      <div className="relative w-[501px] h-[301px] flex items-center justify-center">
        <div className="relative w-32 h-32 animate-pulse">
          <Image
            src="/images/logo.png"
            alt="Ascendant Logo"
            fill
            className="rounded-full"
            sizes="(max-width: 128px) 100vw, 128px"
          />
          <div 
            className="absolute inset-0 rounded-full border-2 border-[#ffc62d] animate-[spin_3s_linear_infinite]"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,198,45,0.1) 0%, transparent 70%)'
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-[501px] h-[301px] overflow-hidden">
      <div 
        className="w-full h-full"
        style={{
          maskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 75%)',
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ 
            background: 'transparent',
            width: '501px',
            height: '501px'
          }}
        />
      </div>
    </div>
  );
} 