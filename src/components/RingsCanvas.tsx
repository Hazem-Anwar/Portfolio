"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── Color palette — cool electric indigo/periwinkle/blue ──────────────
const PALETTE = [
  new THREE.Color("#4f7aff"), // bright electric blue
  new THREE.Color("#6b8cff"), // periwinkle
  new THREE.Color("#8b9cf4"), // soft lavender-blue
  new THREE.Color("#3d5afe"), // vivid indigo
  new THREE.Color("#c7d2fe"), // very light periwinkle
  new THREE.Color("#2563eb"), // accent blue
  new THREE.Color("#818cf8"), // indigo-400
];

function r(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function ri(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Ring {
  meshes: THREE.Mesh[];        // [core, inner-glow, outer-halo]
  basePos: THREE.Vector3;
  curPos: THREE.Vector3;
  vel: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  breathPhase: number;
  breathFreq: number;
  driftAmp: THREE.Vector3;
  driftFreq: THREE.Vector3;
  driftPhase: THREE.Vector3;
  baseCoreOpacity: number;
  radius: number;
}

export default function RingsCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const isMobile = W < 768;
    const RING_COUNT = isMobile ? 28 : 62;
    const STAR_COUNT = isMobile ? 500 : 1100;

    // ── Renderer ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene ─────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(62, W / H, 0.05, 120);
    camera.position.set(0, 0, 7);
    const camVel = new THREE.Vector3();
    const camTarget = new THREE.Vector3(0, 0, 7);

    // ── Helper: make one ring with glow layers ────────────────────────────
    function makeRing(
      radius: number,
      color: THREE.Color,
      basePos: THREE.Vector3
    ): Ring {
      // Three concentric tubes sharing the same radius but different tube widths:
      //  - inner core: very thin, bright (higher opacity)
      //  - mid glow:   medium tube, low opacity
      //  - outer halo: wide tube, very low opacity (gives bloom feel)
      const tubeCore = r(0.0045, 0.012);
      const tubeMid = tubeCore * r(2.5, 4.5);
      const tubeHalo = tubeCore * r(6, 11);

      const segs = isMobile ? 56 : 88;

      const meshes: THREE.Mesh[] = [];

      const makeLayer = (tube: number, opacity: number, colorScale = 1) => {
        const geo = new THREE.TorusGeometry(radius, tube, 6, segs);
        const c = color.clone().multiplyScalar(colorScale);
        const mat = new THREE.MeshBasicMaterial({
          color: c,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(basePos);
        mesh.rotation.set(r(0, Math.PI * 2), r(0, Math.PI * 2), r(0, Math.PI * 2));
        scene.add(mesh);
        return mesh;
      };

      const coreOp = r(0.45, 0.9);
      const midOp  = r(0.09, 0.20);
      const haloOp = r(0.025, 0.065);

      meshes.push(makeLayer(tubeCore, coreOp, 1.0));          // core
      meshes.push(makeLayer(tubeMid,  midOp,  0.85));         // inner glow
      meshes.push(makeLayer(tubeHalo, haloOp, 0.65));         // soft halo

      const rotX = r(-0.006, 0.006);
      const rotY = r(-0.008, 0.008);
      const rotZ = r(-0.004, 0.004);

      return {
        meshes,
        basePos: basePos.clone(),
        curPos: basePos.clone(),
        vel: new THREE.Vector3(),
        rotSpeed: new THREE.Vector3(rotX, rotY, rotZ),
        breathPhase: r(0, Math.PI * 2),
        breathFreq: r(0.25, 0.65),
        driftAmp: new THREE.Vector3(r(0.2, 0.55), r(0.12, 0.4), r(0.06, 0.18)),
        driftFreq: new THREE.Vector3(r(0.08, 0.28), r(0.06, 0.22), r(0.04, 0.14)),
        driftPhase: new THREE.Vector3(r(0, Math.PI * 2), r(0, Math.PI * 2), r(0, Math.PI * 2)),
        baseCoreOpacity: coreOp,
        radius,
      };
    }

    // ── Place rings in volume ─────────────────────────────────────────────
    const rings: Ring[] = [];
    for (let i = 0; i < RING_COUNT; i++) {
      const radius = r(0.35, 2.4);
      // Cluster more rings near center Z for parallax depth feel
      const z = r(-8, 0.5);
      const pos = new THREE.Vector3(
        r(-10, 10),
        r(-6, 6),
        z
      );
      const color = PALETTE[ri(0, PALETTE.length - 1)];
      rings.push(makeRing(radius, color, pos));
    }

    // ── Star field ────────────────────────────────────────────────────────
    {
      const positions = new Float32Array(STAR_COUNT * 3);
      for (let i = 0; i < STAR_COUNT; i++) {
        positions[i * 3]     = r(-18, 18);
        positions[i * 3 + 1] = r(-12, 12);
        positions[i * 3 + 2] = r(-22, -1);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: new THREE.Color("#c7d2fe"),
        size: isMobile ? 0.022 : 0.016,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      scene.add(new THREE.Points(geo, mat));
    }

    // ── Mouse / scroll state ──────────────────────────────────────────────
    const mouse = new THREE.Vector2(0, 0);
    let scrollProg = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      // Smooth normalized coords [-1 .. 1]
      mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onScroll = () => {
      if (!mount) return;
      const section = mount.closest("section");
      if (section) {
        const rect = section.getBoundingClientRect();
        scrollProg = Math.max(0, Math.min(1, -rect.top / window.innerHeight));
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Animation ─────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf: number;

    // Repel radius in world units (rings scatter away from this sphere around cursor)
    const REPEL_RADIUS = 3.2;
    const REPEL_STRENGTH = 1.6;
    const SPRING_K = 0.038;
    const DAMPING = 0.87;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Mouse in world space at z=curPos.z plane isn't trivial to project,
      // so we approximate by projecting to a z=0 plane:
      const mw = new THREE.Vector3(
        mouse.x * 8.5,
        mouse.y * 5.0,
        0
      );

      rings.forEach((ring) => {
        // ── Drift target ──
        const dx = Math.sin(t * ring.driftFreq.x + ring.driftPhase.x) * ring.driftAmp.x;
        const dy = Math.cos(t * ring.driftFreq.y + ring.driftPhase.y) * ring.driftAmp.y;
        const dz = Math.sin(t * ring.driftFreq.z + ring.driftPhase.z) * ring.driftAmp.z;

        const target = new THREE.Vector3(
          ring.basePos.x + dx,
          ring.basePos.y + dy,
          ring.basePos.z + dz - scrollProg * 2.0
        );

        // ── Mouse repulsion (XY plane projection) ──
        if (!isMobile) {
          const diff = new THREE.Vector3(
            ring.curPos.x - mw.x,
            ring.curPos.y - mw.y,
            0
          );
          const dist = diff.length();
          if (dist < REPEL_RADIUS && dist > 0.001) {
            const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS);
            const fStrength = force * force * REPEL_STRENGTH;
            ring.vel.x += (diff.x / dist) * fStrength * 0.12;
            ring.vel.y += (diff.y / dist) * fStrength * 0.12;
          }
        }

        // ── Spring + dampen ──
        ring.vel.x += (target.x - ring.curPos.x) * SPRING_K;
        ring.vel.y += (target.y - ring.curPos.y) * SPRING_K;
        ring.vel.z += (target.z - ring.curPos.z) * SPRING_K;
        ring.vel.multiplyScalar(DAMPING);
        ring.curPos.add(ring.vel);

        // ── Apply position to all layers, share rotation ──
        const rx = ring.rotSpeed.x;
        const ry = ring.rotSpeed.y;
        const rz = ring.rotSpeed.z;

        ring.meshes.forEach((mesh, li) => {
          mesh.position.copy(ring.curPos);
          mesh.rotation.x += rx;
          mesh.rotation.y += ry;
          mesh.rotation.z += rz;
        });

        // ── Opacity breathe (only core layer drives it; halo layers are fixed) ──
        const breathe = Math.sin(t * ring.breathFreq + ring.breathPhase);
        const coreMat = ring.meshes[0].material as THREE.MeshBasicMaterial;
        coreMat.opacity = Math.max(
          0.08,
          ring.baseCoreOpacity + breathe * 0.15
        );
      });

      // ── Camera parallax + FOV breathe ──
      if (!isMobile) {
        camTarget.x = mouse.x * 0.55;
        camTarget.y = mouse.y * 0.32;
      }
      camTarget.z = 7 - scrollProg * 1.8;

      // Spring camera
      camVel.x += (camTarget.x - camera.position.x) * 0.025;
      camVel.y += (camTarget.y - camera.position.y) * 0.025;
      camVel.z += (camTarget.z - camera.position.z) * 0.025;
      camVel.multiplyScalar(0.82);
      camera.position.add(camVel);
      camera.lookAt(0, 0, 0);

      // Subtle FOV breathing
      camera.fov = 62 + Math.sin(t * 0.17) * 0.8;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      rings.forEach((ring) => {
        ring.meshes.forEach((mesh) => {
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
          scene.remove(mesh);
        });
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
