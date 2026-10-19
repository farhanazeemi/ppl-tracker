'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { RotateCw, Eye, Sparkles } from 'lucide-react';

interface ThreeGymVisualizerProps {
  splitType: 'push' | 'pull' | 'legs';
  focusText: string;
  themeColorHex: string;
}

export const ThreeGymVisualizer: React.FC<ThreeGymVisualizerProps> = ({
  splitType,
  focusText,
  themeColorHex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const glowLightsRef = useRef<THREE.PointLight[]>([]);
  const glowRingsRef = useRef<THREE.Mesh[]>([]);
  const [isHologram, setIsHologram] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 260;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 3.6);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.6);
    dirLight2.position.set(-5, -4, -2);
    scene.add(dirLight2);

    // Dynamic Colored Point Lights for the Active Split Glow
    const pointLight1 = new THREE.PointLight(new THREE.Color(themeColorHex), 3, 6);
    pointLight1.position.set(0, 0, 1.2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(new THREE.Color(themeColorHex), 2.5, 6);
    pointLight2.position.set(0, 0, -1.2);
    scene.add(pointLight2);

    glowLightsRef.current = [pointLight1, pointLight2];

    // ROOT OBJECT GROUP
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    groupRef.current = mainGroup;

    // --- PROCEDURAL OLYMPIC BARBELL / DUMBBELL ASSEMBLY ---
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x222429,
      metalness: 0.88,
      roughness: 0.22,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.95,
      roughness: 0.12,
    });

    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.5,
      roughness: 0.35,
    });

    const glowMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(themeColorHex),
      emissive: new THREE.Color(themeColorHex),
      emissiveIntensity: 1.8,
      roughness: 0.1,
      metalness: 0.1,
    });

    // Handle
    const barGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.8, 32);
    barGeo.rotateZ(Math.PI / 2);
    const barMesh = new THREE.Mesh(barGeo, chromeMat);
    mainGroup.add(barMesh);

    // Center knurled grip ring
    const gripGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 32);
    gripGeo.rotateZ(Math.PI / 2);
    const gripMesh = new THREE.Mesh(gripGeo, metalMat);
    mainGroup.add(gripMesh);

    // Collars / Collars stops
    [-0.45, 0.45].forEach((pos) => {
      const collarGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 32);
      collarGeo.rotateZ(Math.PI / 2);
      const collar = new THREE.Mesh(collarGeo, chromeMat);
      collar.position.x = pos;
      mainGroup.add(collar);
    });

    // Plates on Left and Right sides
    const glowRings: THREE.Mesh[] = [];
    [-1, 1].forEach((dir) => {
      // Big outer 20kg plate
      const bigPlateGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.09, 48);
      bigPlateGeo.rotateZ(Math.PI / 2);
      const bigPlate = new THREE.Mesh(bigPlateGeo, plateMat);
      bigPlate.position.x = dir * 0.58;
      mainGroup.add(bigPlate);

      // Plate glowing ring accent
      const ringGeo = new THREE.TorusGeometry(0.38, 0.018, 16, 64);
      ringGeo.rotateY(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, glowMat);
      ringMesh.position.x = dir * 0.63;
      mainGroup.add(ringMesh);
      glowRings.push(ringMesh);

      // Secondary medium 10kg plate
      const medPlateGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.07, 48);
      medPlateGeo.rotateZ(Math.PI / 2);
      const medPlate = new THREE.Mesh(medPlateGeo, metalMat);
      medPlate.position.x = dir * 0.69;
      mainGroup.add(medPlate);

      // Small 5kg outer bumper
      const smallPlateGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 32);
      smallPlateGeo.rotateZ(Math.PI / 2);
      const smallPlate = new THREE.Mesh(smallPlateGeo, plateMat);
      smallPlate.position.x = dir * 0.78;
      mainGroup.add(smallPlate);

      // End Nut / Sleeve Cap
      const capGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 32);
      capGeo.rotateZ(Math.PI / 2);
      const cap = new THREE.Mesh(capGeo, chromeMat);
      cap.position.x = dir * 0.85;
      mainGroup.add(cap);
    });
    glowRingsRef.current = glowRings;

    // Floating Kinetic Particles
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4;
      positions[i + 1] = (Math.random() - 0.5) * 2.5;
      positions[i + 2] = (Math.random() - 0.5) * 3;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(themeColorHex),
      size: 0.04,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Initial tilted athletic angle
    mainGroup.rotation.x = 0.22;
    mainGroup.rotation.y = 0.45;
    mainGroup.rotation.z = -0.15;

    // MOUSE INTERACTION & DRAG
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !mainGroup) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      mainGroup.rotation.y += deltaX * 0.008;
      mainGroup.rotation.x += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // TOUCH SUPPORT
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !mainGroup || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      mainGroup.rotation.y += deltaX * 0.009;
      mainGroup.rotation.x += deltaY * 0.009;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // ANIMATION LOOP
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging && mainGroup) {
        mainGroup.rotation.y += 0.006;
        mainGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.04;
      }

      particles.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update color theme dynamically when split changes
  useEffect(() => {
    const targetColor = new THREE.Color(themeColorHex);

    // Animate lights
    glowLightsRef.current.forEach((light) => {
      gsap.to(light.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.6,
      });
    });

    // Animate glow rings
    glowRingsRef.current.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(mesh.material.color, {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration: 0.6,
        });
        gsap.to(mesh.material.emissive, {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration: 0.6,
        });
      }
    });

    // Pop animation on split change
    if (groupRef.current) {
      gsap.fromTo(
        groupRef.current.scale,
        { x: 0.9, y: 0.9, z: 0.9 },
        { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [themeColorHex, splitType]);

  const resetView = () => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.rotation, {
      x: 0.22,
      y: 0.45,
      z: -0.15,
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  const toggleHologramMode = () => {
    if (!sceneRef.current) return;
    const nextHolo = !isHologram;
    setIsHologram(nextHolo);

    sceneRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = nextHolo));
        } else {
          child.material.wireframe = nextHolo;
        }
      }
    });
  };

  return (
    <div className="relative w-full h-[260px] sm:h-[300px] bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl group">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
      />

      {/* Top HUD Overlay */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: themeColorHex }}
          />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
            3D Hypertrophy Rig
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border"
            style={{
              borderColor: `${themeColorHex}40`,
              backgroundColor: `${themeColorHex}15`,
              color: themeColorHex,
            }}
          >
            {splitType.toUpperCase()}
          </span>
        </div>

        {/* 3D Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={resetView}
            title="Reset 3D Angle"
            className="p-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 rounded-lg transition active:scale-95"
            aria-label="Reset 3D camera angle"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleHologramMode}
            title={isHologram ? 'Solid Shading' : 'Hologram Wireframe'}
            className={`p-1.5 border rounded-lg transition active:scale-95 ${
              isHologram
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700/60'
            }`}
            aria-label="Toggle wireframe mode"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Focus Spec Overlay */}
      <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pointer-events-none bg-zinc-950/75 border border-zinc-800/80 backdrop-blur-md px-3.5 py-2 rounded-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-xs text-zinc-300 font-medium truncate">
            Target Focus: <strong className="text-white">{focusText}</strong>
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 self-end sm:self-auto">
          Drag to rotate • Realtime WebGL
        </span>
      </div>
    </div>
  );
};
