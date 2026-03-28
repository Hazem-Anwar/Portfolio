"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Particle System
    const particleCount = window.innerWidth < 768 ? 1500 : 4000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 5;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
      sizes[i] = Math.random() * 3 + 1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uAccentColor: { value: new THREE.Color("#2563eb") },
        uBaseColor: { value: new THREE.Color("#f0f0eb") },
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        uniform vec2 uMouse;
        varying float vDistance;
        
        void main() {
          vec3 pos = position;
          
          // Floating animation
          pos.y += sin(uTime * 0.5 + position.x * 2.0) * 0.05;
          pos.x += cos(uTime * 0.3 + position.z * 1.5) * 0.03;
          
          // Mouse repulsion
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float dist = length(uMouse - pos.xy);
          vDistance = dist;
          
          float repulsion = smoothstep(2.0, 0.0, dist) * 0.8;
          vec2 direction = normalize(pos.xy - uMouse);
          mvPosition.xy += direction * repulsion;
          
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uAccentColor;
        uniform vec3 uBaseColor;
        varying float vDistance;
        
        void main() {
          // Circular particles
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - (dist * 2.0);
          alpha = pow(alpha, 2.0);
          
          // Mix colors based on distance from mouse
          vec3 color = mix(uAccentColor, uBaseColor, smoothstep(0.0, 2.0, vDistance));
          color = mix(color, uBaseColor, 0.6);
          
          gl_FragColor = vec4(color, alpha * 0.5);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse tracking
    const mouse = new THREE.Vector2(0, 0);
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.multiplyScalar(3);
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation loop
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      material.uniforms.uTime.value = elapsed;
      material.uniforms.uMouse.value.lerp(mouse, 0.05);

      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = elapsed * 0.01;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
