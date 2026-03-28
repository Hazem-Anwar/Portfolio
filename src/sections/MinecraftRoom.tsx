"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";

export default function MinecraftRoom() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [patienceLeft, setPatienceLeft] = useState(4);

  const triggerAction = (action: string) => {
    window.dispatchEvent(new CustomEvent('ahmedAction', { detail: action }));
  };

  useEffect(() => {
    const handleGameEnd = () => setIsGameEnded(true);
    window.addEventListener('ahmedGameEnded', handleGameEnd);
    return () => window.removeEventListener('ahmedGameEnded', handleGameEnd);
  }, []);

  // Removed AudioContext wrapper since user requested to stop typing sound
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const bubbleRef   = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const cleanupRef  = useRef<(() => void) | null>(null);
  const [userAlert, setUserAlert] = useState("");
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showUserAlert = (msg: string) => {
    setUserAlert(msg);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => setUserAlert(""), 4000);
  };

  useEffect(() => {
    const handleAlert = (e: any) => showUserAlert(e.detail);
    window.addEventListener('ahmedProximityAlert', handleAlert);
    return () => window.removeEventListener('ahmedProximityAlert', handleAlert);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      // Tell Ahmed to give the warning message right when starting
      setTimeout(() => window.dispatchEvent(new CustomEvent("ahmedGameStartAlert")), 500);
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    // Trigger window resize to ensure Three.js canvas perfectly reassesses the viewport
    setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const bubEl  = bubbleRef.current;
    if (!canvas || !bubEl) return;

    let disposed = false;

    const boot = async () => {
      const THREE = await import("three");
      if (disposed) return;

      /* ── Renderer ── */
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false, // Turn off antialiasing for authentic pixel look
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#87CEEB"); // Minecraft Sky

      /* ── Camera ── */
      const cam = new THREE.PerspectiveCamera(
        72,
        canvas.clientWidth / canvas.clientHeight,
        0.05,
        100
      );
      cam.position.set(0, 1.7, 3.5);
      cam.lookAt(0, 1.5, 0);

      /* ── Camera state ── */
      const camState = {
        yaw: 0, pitch: -0.08,
        targetYaw: 0, targetPitch: -0.08,
        posX: 0, posY: 1.7, posZ: 4.5,
        targetX: 0, targetZ: 4.5,
        isDragging: false,
        lastX: 0, lastY: 0,
        sensitivity: 0.003,
      };

      let grabbingAhmed = false, dragAhmed = false;
      let dTimer = 0, aState = "idle", dI = 0;
      const tPos = new THREE.Vector3(1.5, 0, 0.5);
      let AT = 0;

      let ahmed: THREE.Group;
      let lLG: THREE.Group, rLG: THREE.Group, lAG: THREE.Group, rAG: THREE.Group, headG2: THREE.Group, bodyG2: THREE.Group;
      let lEye: THREE.Mesh, rEye: THREE.Mesh, lBrow: THREE.Mesh, rBrow: THREE.Mesh;
      let faceMat: THREE.Material;
      let dropCount = 0;
      let isHyper = false;

      const onMouseDown = (e: MouseEvent) => {
        if (aState === "crying" || aState === "frozen") return;
        const r = canvas.getBoundingClientRect();
        const m2d = new THREE.Vector2(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -((e.clientY - r.top) / r.height) * 2 + 1
        );
        const ray = new THREE.Raycaster();
        ray.setFromCamera(m2d, cam);
        const ap = new THREE.Vector3();
        if (ahmed) {
            ahmed.getWorldPosition(ap); ap.y = 1.0;
            const d2 = ray.ray.direction, o = ray.ray.origin;
            const t2 = ap.clone().sub(o).dot(d2);
            const cl = o.clone().add(d2.clone().multiplyScalar(t2));
            if (cl.distanceTo(ap) < 0.7 && t2 > 0) {
            dragAhmed = true; grabbingAhmed = true;
            canvas.style.cursor = "grabbing";
            showBubble("😱 Hey, put me down!!", 3000);
            
            // Panicked face (eyebrows up)
            lBrow.rotation.z = 0.15; lBrow.position.y = 0.22;
            rBrow.rotation.z = -0.15; rBrow.position.y = 0.22;
            lEye.position.x = -0.06; rEye.position.x = 0.06;
            
            return;
            }
        }
        camState.isDragging = true;
        camState.lastX = e.clientX;
        camState.lastY = e.clientY;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (dragAhmed && ahmed) {
          const r = canvas.getBoundingClientRect();
          const m2d = new THREE.Vector2(
            ((e.clientX - r.left) / r.width) * 2 - 1,
            -((e.clientY - r.top) / r.height) * 2 + 1
          );
          const ray = new THREE.Raycaster();
          ray.setFromCamera(m2d, cam);
          const hp = new THREE.Vector3();
          const floorP = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          if (ray.ray.intersectPlane(floorP, hp)) {
            hp.x = Math.max(-5.5, Math.min(5.5, hp.x));
            hp.z = Math.max(-4.5, Math.min(4.5, hp.z));
            ahmed.position.set(hp.x, 0, hp.z);
            tPos.copy(ahmed.position);
          }
          return;
        }
        if (!camState.isDragging || grabbingAhmed) return;
        const dx = e.clientX - camState.lastX;
        const dy = e.clientY - camState.lastY;
        camState.lastX = e.clientX;
        camState.lastY = e.clientY;
        camState.targetYaw   -= dx * camState.sensitivity;
        camState.targetPitch -= dy * camState.sensitivity;
        camState.targetPitch  = Math.max(-0.5, Math.min(0.4, camState.targetPitch));
        camState.targetYaw    = Math.max(-1.2, Math.min(1.2, camState.targetYaw));
      };

      const onMouseUp = () => {
        if (dragAhmed) {
          dragAhmed = false; grabbingAhmed = false;
          canvas.style.cursor = "";
          dropCount++;
          setPatienceLeft(Math.max(0, 4 - dropCount));

          let msgs = [
            "😤 Fine... I'll just stay here.",
            "One more time and I'll lose it!",
            "I am actually getting mad now! 😡",
            "That's it. I've had ENOUGH."
          ];
          
          if (dropCount >= 3) {
             msgs = [
              "Seriously?! Again?! 😡",
              "Do I look like a toy to you?",
              "I'm warning you! 😠",
              "This is NOT okay!"
            ];
          }

          const randomMsg = msgs[Math.min(dropCount - 1, msgs.length - 1)];
          showBubble(randomMsg, 6000);
          dTimer = -420; aState = "idle";
          
          // Face the user (camera)
          if (ahmed) ahmed.rotation.y = 0;
          
          // Angry expression
          lBrow.rotation.z = -0.25; lBrow.position.y = 0.18;
          rBrow.rotation.z = 0.25;  rBrow.position.y = 0.18;

          // Turn face red if repeatedly dropped
          if (dropCount > 1 && faceMat && (faceMat as any).color) {
            const intensity = Math.min(1.0, (dropCount - 1) / 3);
            (faceMat as any).color.lerpColors(new THREE.Color("#f0f0eb"), new THREE.Color("#ef4444"), intensity);
          }

          if (dropCount >= 4) {
            aState = "crying";
            showBubble("😭😭 Waaaaah!! You're MEAN!", 6000);
            if (bodyG2) {
              bodyG2.rotation.x = -Math.PI / 2; // Lie on back
              bodyG2.position.y = 0.2; // Floor level
            }
            // Sad eyebrows
            lBrow.rotation.z = 0.3; lBrow.position.y = 0.16;
            rBrow.rotation.z = -0.3; rBrow.position.y = 0.16;
            
            setTimeout(() => {
               window.dispatchEvent(new CustomEvent('ahmedGameEnded'));
            }, 4000);
          }
        }
        camState.isDragging = false;
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * 0.004;
        camState.targetZ += delta * Math.cos(camState.targetYaw);
        camState.targetX += delta * Math.sin(camState.targetYaw);
        camState.targetX = Math.max(-4.5, Math.min(4.5, camState.targetX));
        camState.targetZ = Math.max(-3.5, Math.min(4.5, camState.targetZ));
      };

      const onResize = () => {
        cam.aspect = canvas.clientWidth / canvas.clientHeight;
        cam.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      };

      const onGameStartAlert = () => {
        if (aState === "crying" || aState === "frozen" || grabbingAhmed) return;
        aState = "idle";
        dTimer = -400; // Stand still for ~8.5 seconds
        tPos.set(0, 0, 2.0); // Substantially closer to camera 
        if (ahmed) {
           ahmed.position.copy(tPos);
           ahmed.rotation.y = 0;
        }
        lBrow.rotation.z = -0.25; lBrow.position.y = 0.18; // Severe eyebrows
        rBrow.rotation.z = 0.25; rBrow.position.y = 0.18;
        if (faceMat && (faceMat as any).color) (faceMat as any).color.set("#ffcccc"); // Mildly flushed
        showBubble("Listen carefully: You only have 4 chances to mess with me! 😠", 5500);
      };

      const onAction = (e: any) => {
        const action = e.detail;
        if (aState === "crying" || aState === "frozen" || grabbingAhmed) return;
        
        tPos.copy(ahmed.position); // anchor for animations
        tPos.y = 0;

        if (action === "kinder") {
           aState = "happy";
           isHyper = false;
           dTimer = 0;
           // Kinder makes him happy but does NOT reset patience/drop count
           if (faceMat && (faceMat as any).color) (faceMat as any).color.set("#f0f0eb");
           lBrow.rotation.z = 0; lBrow.position.y = 0.20;
           rBrow.rotation.z = 0; rBrow.position.y = 0.20;
           showBubble("YAY! Chocolate!! 😍", 2500);
        } else if (action === "center_ahmed") {
           tPos.set(0, 0, 1.5);
           aState = "walking";
           dTimer = 0;
           // He will naturally center and face forward when arriving at tPos
        } else if (action === "talk1") {
           aState = "idle";
           tPos.set(0, 0, 1.5);
           if (ahmed) { ahmed.position.copy(tPos); ahmed.rotation.y = 0; }
           showBubble("Um... there are TONS of bugs but I'm not scared!! 😤", 5000);
           dTimer = -9999; // Will unfreeze via bExpiry check
        } else if (action === "talk2") {
           aState = "idle";
           tPos.set(0, 0, 1.5);
           if (ahmed) { ahmed.position.copy(tPos); ahmed.rotation.y = 0; }
           showBubble("I'm NOT tired! ...okay maybe just a teeny tiny nap 😴", 5000);
           dTimer = -9999;
        } else if (action === "talk3") {
           aState = "idle";
           tPos.set(0, 0, 1.5);
           if (ahmed) { ahmed.position.copy(tPos); ahmed.rotation.y = 0; }
           // Dynamically compute age since 27 Sep 2022
           const born = new Date(2022, 8, 27); // month is 0-indexed
           const now = new Date();
           const totalMonths = (now.getFullYear() - born.getFullYear()) * 12 + (now.getMonth() - born.getMonth()) -
             (now.getDate() < born.getDate() ? 1 : 0);
           const years = Math.floor(totalMonths / 12);
           const months = totalMonths % 12;
           const ageStr = years > 0 ? `${years} year${years>1?'s':''} and ${months} month${months!==1?'s':''}` : `${months} month${months!==1?'s':''}`;
           showBubble(`I am ${ageStr} old!! My mama taught me that! 🎂`, 5000);
           dTimer = -9999;
        } else if (action === "coffee") {
           isHyper = true;
           aState = "idle"; dTimer = -30;
           if (ahmed) ahmed.rotation.y = 0;
           showBubble("I CAN SEE SOUNDS! Let's work fast! ⚡", 2500);
        }
      };

      const onGameEnd = () => {
        aState = "frozen";
        // Stop flailing and rest on the floor
        if (bodyG2) {
          lLG.rotation.x = 0; rLG.rotation.x = 0;
          lAG.rotation.x = Math.PI - 0.2; rAG.rotation.x = Math.PI - 0.2;
          headG2.rotation.y = 0; headG2.rotation.z = 0;
        }
      };

      const onReset = () => {
        dropCount = 0;
        isHyper = false;
        setPatienceLeft(4);
        if (bodyG2 && faceMat && (aState === "crying" || aState === "frozen")) {
          bodyG2.rotation.x = 0;
          bodyG2.position.y = 0.75;
          aState = "idle";
          (faceMat as any).color.set("#f0f0eb"); // Cool down completely
        }
      };

      canvas.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup",   onMouseUp);
      canvas.addEventListener("wheel",     onWheel, { passive: false });
      window.addEventListener("resize",    onResize);
      window.addEventListener("ahmedGameReset", onReset);
      window.addEventListener("ahmedGameEnded", onGameEnd);
      window.addEventListener("ahmedAction", onAction);
      window.addEventListener("ahmedGameStartAlert", onGameStartAlert);

      /* ── Voxel Aesthetic Helpers ── */
      function ctex(w: number, h: number, fn: (c: CanvasRenderingContext2D, w: number, h: number) => void) {
        const cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        const ctx = cv.getContext("2d")!;
        ctx.imageSmoothingEnabled = false; // Nearest neighbor
        fn(ctx, w, h);
        const t = new THREE.CanvasTexture(cv);
        t.colorSpace = THREE.SRGBColorSpace;
        t.magFilter = THREE.NearestFilter;
        t.minFilter = THREE.NearestFilter;
        return t;
      }

      function pixelArt(w: number, h: number, data: string[], palette: Record<string, string>) {
        return ctex(w, h, (c) => {
          const ph = h/data.length, pw = w/data[0].length;
          for(let y=0; y<data.length; y++) {
            for(let x=0; x<data[y].length; x++) {
              const char = data[y][x];
              if (palette[char]) {
                c.fillStyle = palette[char];
                c.fillRect(x*pw, y*ph, pw, ph);
              }
            }
          }
        });
      }

      function noiseSquare(c: CanvasRenderingContext2D, baseColor: string, variance: number, w: number, h: number, size: number) {
        c.fillStyle = baseColor; c.fillRect(0,0,w,h);
        for(let y=0; y<h; y+=size) {
          for(let x=0; x<w; x+=size) {
            const v = Math.random() * variance - variance/2;
            c.fillStyle = `rgba(0,0,0,${Math.max(0,v)})`; c.fillRect(x,y,size,size);
            c.fillStyle = `rgba(255,255,255,${Math.max(0,-v)})`; c.fillRect(x,y,size,size);
          }
        }
      }

      function std(p: any) {
        const o: any = {
          color: new THREE.Color(p.c || "#fff"),
          roughness: p.r !== undefined ? p.r : 1.0, // Voxels usually rough
          metalness: p.m !== undefined ? p.m : 0,
        };
        if (p.map) o.map = p.map;
        if (p.em) { o.emissive = new THREE.Color(p.em); o.emissiveIntensity = p.ei || 1; }
        if (p.t) { o.transparent = true; o.opacity = p.o || 1; }
        return new THREE.MeshStandardMaterial(o);
      }

      function sh<T extends THREE.Object3D>(m: T): T {
        m.castShadow = true; m.receiveShadow = true; return m;
      }

      function BOX(w: number, h: number, d: number, mat: THREE.Material | THREE.Material[], x=0, y=0, z=0) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
        m.position.set(x,y,z); return sh(m);
      }

      /* ── Textures ── */
      const oakPlanks = ctex(32, 32, (c, w, h) => {
        c.fillStyle = "#4a4a4a"; c.fillRect(0,0,w,h);
        c.fillStyle = "#2d2d2d"; c.fillRect(0,0,w,1); c.fillRect(0,0,1,h);
      });
      oakPlanks.wrapS = oakPlanks.wrapT = THREE.RepeatWrapping; oakPlanks.repeat.set(12, 10);

      const wallTex = ctex(32, 32, (c, w, h) => { 
        c.fillStyle = "#3a3a3a"; c.fillRect(0,0,w,h);
        noiseSquare(c, "#3a3a3a", 0.04, w, h, 2); 
      });
      wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping; wallTex.repeat.set(12, 4);

      const bookshelfTex = pixelArt(16, 16, [
        "WWWWWWWWWWWWWWWW",
        "WBRGYYBRRGBGBYYW",
        "WBRGYYBRRGBGBYYW",
        "WBRGYYBRRGBGBYYW",
        "WWWWWWWWWWWWWWWW",
        "WRRBGGYRBYYRBGGW",
        "WRRBGGYRBYYRBGGW",
        "WRRBGGYRBYYRBGGW",
        "WWWWWWWWWWWWWWWW",
        "WYYRBBGGRGBRYYRW",
        "WYYRBBGGRGBRYYRW",
        "WYYRBBGGRGBRYYRW",
        "WWWWWWWWWWWWWWWW",
        "WBGGRYYBRRGGBBYW",
        "WBGGRYYBRRGGBBYW",
        "WWWWWWWWWWWWWWWW",
      ], { "W":"#111115", "R":"#3b82f6", "B":"#2563eb", "G":"#6b7280", "Y":"#f0f0eb" });

      const woodBlockTex = ctex(16, 16, (c, w, h) => {
        c.fillStyle = "#111115"; c.fillRect(0,0,w,h);
        c.fillStyle = "#0b0b12"; c.strokeRect(0,0,w,h);
      });

      const bookMat = [
        std({map: woodBlockTex}), std({map: woodBlockTex}),
        std({map: woodBlockTex}), std({map: woodBlockTex}),
        std({map: bookshelfTex}), std({map: bookshelfTex}) // Front and back
      ];

      const rugBlueTex = ctex(16, 16, (c, w, h) => { noiseSquare(c, "#252528", 0.1, w, h, 1); });
      rugBlueTex.wrapS = rugBlueTex.wrapT = THREE.RepeatWrapping; rugBlueTex.repeat.set(4, 3);

      const rugRedTex = pixelArt(16, 16, [
        "RRRRRRRRRRRRRRRR",
        "RGGGGGGGGGGGGGGR",
        "RGRRRRRRRRRRRRGR",
        "RGRYYRRYYRYYRRGR",
        "RGRYBRRBYRBYBRGR",
        "RGRYYRRYYRYYRRGR",
        "RGRRRRRRRRRRRRGR",
        "RGRYYRRYBYRYYRGR",
        "RGRYBRRBYRBYBRGR",
        "RGRYYRRYBYRYYRGR",
        "RGRRRRRRRRRRRRGR",
        "RGRYYRRYYRYYRRGR",
        "RGRYBRRBYRBYBRGR",
        "RGRYYRRYYRYYRRGR",
        "RGGGGGGGGGGGGGGR",
        "RRRRRRRRRRRRRRRR",
      ], { "R":"#802020", "G":"#402020", "Y":"#c0a060", "B":"#1e3a8a" });
      rugRedTex.wrapS = rugRedTex.wrapT = THREE.RepeatWrapping; rugRedTex.repeat.set(3, 2);

      const speakerTex = pixelArt(16,16, [
        "DDDDDDDDDDDDDDDD",
        "DGGGGGGGGGGGGGGD",
        "DGGGGGGGGGGGGGGD",
        "DGGGGDDDDGGGGGGD",
        "DGGGDDDDDDGGGGGD",
        "DGGGDDDDDDGGGGGD",
        "DGGGGDDDDGGGGGGD",
        "DGGGGGGGGGGGGGGD",
        "DGGGGGGGGGGGGGGD",
        "DGGGDGGGGGGGDGGD",
        "DGGDDGGDGGGDGDDD",
        "DGGGDGGGGGGGDGGD",
        "DGGGGGGGGGGGGGGD",
        "DGGGGGGGGGGGGGGD",
        "DDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDD",
      ], {"D":"#05050a", "G":"#111115"});

      const windowsScreen = pixelArt(32,16, [
        "00000000000000000000000000000000",
        "00000000010000000002200000000000",
        "00000000111000000022220000000000",
        "00010001111100000222222000000000",
        "00111011111110002222222200020000",
        "01111111111111022222222220222000",
        "01111111111111222222222222222200",
        "01111111111111222222222222222200",
        "01111111111111022222222220222000",
        "00111011111110002222222200020000",
        "00010001111100000222222000000000",
        "00000000111000000022220000000000",
        "00000000010000000002200000000000",
        "00000000000000000000000000000000",
        "03300000000000000000000000000000",
        "03300000000000000000000000000000",
      ], { "0":"#05050a", "1":"#2563eb", "2":"#3b82f6", "3":"#f0f0eb" });

      const paintingTex = pixelArt(16,16,[
        "0000000000000000",
        "0111111111111110",
        "0122222222222210",
        "0123333333333210",
        "0123555555553210",
        "0123544444453210",
        "0123546666453210",
        "0123546776453210",
        "0123546776453210",
        "0123546666453210",
        "0123544444453210",
        "0123555555553210",
        "0123333333333210",
        "0122222222222210",
        "0111111111111110",
        "0000000000000000",
      ], {"0":"#382414","1":"#523620","2":"#8b5c38","3":"#e8d4a2","4":"#c4a381","5":"#997352","6":"#111","7":"#222"});

      const landscapeTex = pixelArt(32,16,[
        "00000000000000000000000000000000",
        "00111111111111111111111111111100",
        "00113111311311131131113113113100",
        "00111121111122111211111122111100",
        "00121112211222212211112222112100",
        "00222122221222222211122222122200",
        "00222222222222222211222222222200",
        "00444444444444444444444444444400",
        "00544544554444454455444445445400",
        "00554554444554555444455455545400",
        "00555555555555555555555555555500",
        "00555555555555555555555555555500",
        "00555555555555555555555555555500",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
      ], {"0":"#382414","1":"#6ba4ff","2":"#666","3":"#fff","4":"#55aa44","5":"#338822"});

      /* ── Materials ── */
      const M = {
        floor:  std({ map: oakPlanks, r: 0.4, m: 0.2 }),
        wall:   std({ map: wallTex, r: 0.9 }),
        ceil:   std({ c: "#333333", r: 1.0 }),
        wood:   std({ map: woodBlockTex }),
        black:  std({ c: "#151515", r: 0.5 }),
        dkGray: std({ c: "#2c2c2c", r: 0.7 }),
        metal:  std({ c: "#e2e8f0", m: 0.8, r: 0.2 }),
        glass:  std({ c: "#888899", t: true, o: 0.4 }),
        curtain:std({ c: "#3a3a40", r: 0.8, side: THREE.DoubleSide }),
        blueRug:std({ map: rugBlueTex }),
        redRug: std({ map: rugRedTex }),
        screen: std({ map: windowsScreen, em: "#1d70b8", ei: 0.5 }),
        speaker:std({ map: speakerTex }),
        painting:std({ map: paintingTex }),
      };

      /* ── Room Dimension ── */
      const RW = 12, RH = 4, RD = 10;

      scene.add(new THREE.AmbientLight("#f0f0eb", 0.7));
      const ceilLight = new THREE.PointLight("#ffffff", 1.5, 20, 1.0);
      ceilLight.position.set(0, RH - 0.2, 0);
      ceilLight.castShadow = true;
      ceilLight.shadow.mapSize.set(2048, 2048);
      ceilLight.shadow.bias = -0.002;
      scene.add(ceilLight);

      // Warm Desk Lighting
      const deskGlow = new THREE.PointLight("#f0f0eb", 0.8, 6, 1.5);
      deskGlow.position.set(0, 1.5, -4.3);
      scene.add(deskGlow);
      const monLight = new THREE.PointLight("#ffdd99", 1.2, 4, 1.5); // desk lamps
      monLight.position.set(-1.2, 1.5, -3.8);
      scene.add(monLight);
      const monLightR = new THREE.PointLight("#ffdd99", 1.2, 4, 1.5); // desk lamps
      monLightR.position.set(1.2, 1.5, -3.8);
      scene.add(monLightR);

      // Room Box
      const floor = BOX(RW, 0.2, RD, M.floor, 0, -0.1, 0); floor.receiveShadow = true; scene.add(floor);
      const ceil = BOX(RW, 0.2, RD, M.ceil, 0, RH + 0.1, 0); scene.add(ceil);
      scene.add(BOX(RW, RH, 0.2, M.wall, 0, RH/2, -RD/2 - 0.1)); // Back

      // Air Vents
      scene.add(BOX(0.8, 0.25, 0.2, M.dkGray, -3.5, 3.6, -4.9)); // Vent L
      scene.add(BOX(0.8, 0.25, 0.2, M.dkGray, 3.5, 3.6, -4.9)); // Vent R
      scene.add(BOX(RW, RH, 0.2, M.wall, 0, RH/2, RD/2 + 0.1));  // Front
      scene.add(BOX(0.2, RH, RD, M.wall, -RW/2 - 0.1, RH/2, 0)); // Left
      scene.add(BOX(0.2, RH, RD, M.wall, RW/2 + 0.1, RH/2, 0));  // Right

      // Ceiling Lamp
      scene.add(BOX(1.5, 0.2, 1.5, std({c: "#f5e8c4", em: "#f5e8c4", ei: 0.8}), 0, RH-0.1, 0));
      scene.add(BOX(1.7, 0.1, 1.7, M.wood, 0, RH-0.05, 0));

      // Wall Lamp Back
      scene.add(BOX(0.6, 0.2, 0.3, std({c: "#fff", em: "#fff", ei: 1}), 0, 3.2, -RD/2 + 0.1));
      const wallPoint = new THREE.PointLight(0xffeedd, 1.0, 5); wallPoint.position.set(0, 3.2, -RD/2 + 0.3); scene.add(wallPoint);

      /* ── Rugs ── */
      scene.add(BOX(4.5, 0.05, 3.5, M.blueRug, -2.5, 0.025, 0));
      scene.add(BOX(4.0, 0.05, 2.8, M.redRug, 3.0, 0.025, 2.0));

      /* ── Windows ── */
      function makeWindow(wx: number, wy: number, wz: number, isLeft: boolean) {
        const ww = 2, wh = 2.5;
        const g = new THREE.Group(); g.position.set(wx, wy, wz);
        g.rotation.y = isLeft ? Math.PI/2 : -Math.PI/2; scene.add(g);
        // Window Hole (Simulated by darkening/glass)
        g.add(BOX(ww, wh, 0.05, M.glass, 0, 0, 0));
        g.add(BOX(ww, 0.1, 0.1, M.wood, 0, wh/2, 0));
        g.add(BOX(ww, 0.1, 0.1, M.wood, 0, -wh/2, 0));
        g.add(BOX(0.1, wh, 0.1, M.wood, -ww/2, 0, 0));
        g.add(BOX(0.1, wh, 0.1, M.wood, ww/2, 0, 0));
        g.add(BOX(0.05, wh, 0.1, M.wood, 0, 0, 0));
        g.add(BOX(ww, 0.05, 0.1, M.wood, 0, 0, 0));
        // Curtains
        g.add(BOX(0.4, wh+0.2, 0.1, M.curtain, -ww/2 - 0.1, 0, 0.1));
        g.add(BOX(0.4, wh+0.2, 0.1, M.curtain, ww/2 + 0.1, 0, 0.1));
        // Curtain Rod
        g.add(BOX(ww+1.0, 0.05, 0.05, M.wood, 0, wh/2+0.1, 0.15));
        // Light entering
        const dl = new THREE.DirectionalLight(0xddeeff, 0.3);
        dl.position.set(isLeft ? -5 : 5, 2, 0);
        scene.add(dl);
      }
      makeWindow(-RW/2 + 0.15, 2.0, -1.0, true);
      makeWindow(RW/2 - 0.15, 2.0, -1.0, false);

      /* ── Back Desk & Setup ── */
      scene.add(BOX(3.5, 0.1, 1.0, M.wood, 0, 1.0, -4.0)); // Top
      scene.add(BOX(0.1, 1.0, 0.8, M.wood, -1.6, 0.5, -4.0)); // Leg L
      scene.add(BOX(0.1, 1.0, 0.8, M.wood, 1.6, 0.5, -4.0)); // Leg R

      // Monitors
      [-0.8, 0, 0.8].forEach(x => {
        const rot = x === 0 ? 0 : (x < 0 ? 0.2 : -0.2);
        const mG = new THREE.Group(); mG.position.set(x, 1.3, -4.2 + Math.abs(x)*0.1);
        mG.rotation.y = rot; scene.add(mG);
        mG.add(BOX(0.7, 0.45, 0.05, M.black, 0, 0, 0)); // Monitor body
        mG.add(BOX(0.1, 0.2, 0.05, M.black, 0, -0.2, -0.05)); // Stand neck
        mG.add(BOX(0.4, 0.05, 0.2, M.black, 0, -0.25, -0.05)); // Stand base
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.41), M.screen);
        scr.position.z = 0.026; mG.add(scr);
      });

      // Speakers
      scene.add(BOX(0.2, 0.3, 0.2, M.speaker, -1.5, 1.2, -4.2));
      scene.add(BOX(0.2, 0.3, 0.2, M.speaker, 1.5, 1.2, -4.2));

      // PC Tower (Glowing voxel case)
      const pcCase = new THREE.Group(); pcCase.position.set(1.4, 0.5, -3.8); scene.add(pcCase);
      pcCase.add(BOX(0.4, 0.8, 0.8, M.dkGray, 0, 0, 0));
      pcCase.add(BOX(0.3, 0.7, 0.75, std({c:"#05050a", m:0.8, r:0.2}), -0.06, 0, 0.05)); // Glass panel
      pcCase.add(BOX(0.1, 0.6, 0.1, std({c:"#ffffff", em:"#ffffff", ei: 1}), -0.15, 0, 0.25)); // Strip 1
      pcCase.add(BOX(0.1, 0.6, 0.1, std({c:"#ffffff", em:"#ffffff", ei: 1}), -0.15, 0, -0.25)); // Strip 2

      // Keyboard & Mouse
      scene.add(BOX(0.6, 0.02, 0.2, M.black, 0, 1.06, -3.6)); // Keyboard base
      scene.add(BOX(0.56, 0.01, 0.16, std({c:"#ffffff", em:"#ffffff", ei:0.5}), 0, 1.075, -3.6)); // Glowing keys
      scene.add(BOX(0.3, 0.01, 0.3, M.black, 0.6, 1.055, -3.6)); // Mousepad
      scene.add(BOX(0.08, 0.04, 0.12, std({c:"#f0f0eb"}), 0.6, 1.07, -3.6)); // Mouse
      scene.add(BOX(0.02, 0.01, 0.02, std({c:"#ffffff", em:"#ffffff", ei:1}), 0.6, 1.09, -3.6)); // Mouse RGB

      // Coffee Mug
      scene.add(BOX(0.1, 0.15, 0.1, std({c:"#f0f0eb"}), -1.2, 1.12, -3.5));

      // Chair
      const chG = new THREE.Group(); chG.position.set(0, 0, -3.2); scene.add(chG);
      chG.add(BOX(0.5, 0.1, 0.5, M.dkGray, 0, 0.5, 0)); // Seat
      chG.add(BOX(0.4, 0.6, 0.1, M.dkGray, 0, 0.9, -0.2)); // Back
      chG.add(BOX(0.08, 0.5, 0.08, M.black, 0, 0.25, 0)); // Pole
      chG.add(BOX(0.6, 0.1, 0.1, M.black, 0, 0.05, 0)); // Legs cross
      chG.add(BOX(0.1, 0.1, 0.6, M.black, 0, 0.05, 0)); 

      /* ── Bookshelves ── */
      // Left tall
      for(let y=0; y<4; y++) scene.add(BOX(0.8, 0.8, 0.8, bookMat, -2.5, 0.4 + y*0.8, -4.5));
      // Right wide
      for(let y=0; y<3; y++) {
        for(let x=0; x<3; x++) {
          scene.add(BOX(0.8, 0.8, 0.8, bookMat, 2.5 + x*0.8, 0.4 + y*0.8, -4.5));
        }
      }

      /* ── Desk Lamps ── */
      // Left desk lamp
      scene.add(BOX(0.1, 0.4, 0.1, M.metal, -1.2, 1.25, -3.8));
      scene.add(BOX(0.2, 0.2, 0.2, std({c:"#ffdd99", em:"#ffdd99", ei:2}), -1.2, 1.5, -3.8));
      // Right desk lamp
      scene.add(BOX(0.1, 0.4, 0.1, M.metal, 1.2, 1.25, -3.8));
      scene.add(BOX(0.2, 0.2, 0.2, std({c:"#ffdd99", em:"#ffdd99", ei:2}), 1.2, 1.5, -3.8));

      /* ── Floor Lamps ── */
      scene.add(BOX(0.1, 2.0, 0.1, M.wood, 4.4, 1.0, -4.0));
      scene.add(BOX(0.5, 0.7, 0.5, std({c:"#f0f0eb", em:"#f0f0eb", ei: 1, t:true, o:0.9}), 4.4, 2.3, -4.0));
      const flR = new THREE.PointLight(0xffffff, 1.2, 6); flR.position.set(4.4, 2.3, -4.0); scene.add(flR);

      scene.add(BOX(0.1, 2.0, 0.1, M.wood, -3.6, 1.0, -4.0));
      scene.add(BOX(0.5, 0.7, 0.5, std({c:"#f0f0eb", em:"#f0f0eb", ei: 1, t:true, o:0.9}), -3.6, 2.3, -4.0));
      const flL = new THREE.PointLight(0xffffff, 1.2, 6); flL.position.set(-3.6, 2.3, -4.0); scene.add(flL);

      /* ── Back Paintings ── */
      scene.add(BOX(2.8, 1.5, 0.05, M.wood, 0, 2.8, -4.9)); // Frame for Landscape
      const lsMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.4), std({map: landscapeTex}));
      lsMesh.position.set(0, 2.8, -4.84); scene.add(lsMesh);

      /* ── Left Painting ── */
      const lPaintGroup = new THREE.Group(); lPaintGroup.position.set(-5.9, 2.6, 0.5); scene.add(lPaintGroup);
      lPaintGroup.rotation.y = Math.PI/2;
      lPaintGroup.add(BOX(1.4, 1.4, 0.05, M.wood, 0, 0, 0)); // Frame
      const ptMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), std({map: paintingTex}));
      ptMesh.position.z = 0.026; lPaintGroup.add(ptMesh);

      /* ── Left Wall Shelves & Sports ── */
      const leftS = new THREE.Group(); leftS.position.set(-5.6, 0, 2.5); scene.add(leftS);
      leftS.rotation.y = Math.PI/2;
      leftS.add(BOX(2.5, 0.1, 0.6, M.wood, 0, 0.4, 0));
      leftS.add(BOX(2.5, 0.1, 0.6, M.wood, 0, 1.1, 0));
      leftS.add(BOX(2.5, 0.1, 0.6, M.wood, 0, 1.8, 0));
      leftS.add(BOX(0.1, 1.8, 0.6, M.wood, -1.2, 0.9, 0));
      leftS.add(BOX(0.1, 1.8, 0.6, M.wood, 1.2, 0.9, 0));
      // Baseball Bat
      const bat = BOX(0.1, 1.2, 0.1, std({c:"#c8a070"}), 1.4, 0.6, 0.2); bat.rotation.z = -0.2; leftS.add(bat);
      // Football
      leftS.add(BOX(0.3, 0.2, 0.2, std({c:"#6b3617"}), -0.5, 0.55, 0));
      // Helmet bottom
      leftS.add(BOX(0.35, 0.35, 0.35, std({c:"#a01010"}), 0.5, 0.625, 0));
      // Helmet mid
      leftS.add(BOX(0.35, 0.35, 0.35, std({c:"#a01010"}), -0.6, 1.325, 0));
      // Yellow box sword
      leftS.add(BOX(0.35, 0.35, 0.35, std({c:"#e6c300"}), 0.6, 2.025, 0));
      // Steve figure
      leftS.add(BOX(0.1, 0.1, 0.1, std({c:"#f0c090"}), -0.8, 2.1, 0));
      leftS.add(BOX(0.1, 0.2, 0.05, std({c:"#00aaaa"}), -0.8, 1.95, 0));
      leftS.add(BOX(0.1, 0.2, 0.05, std({c:"#333399"}), -0.8, 1.75, 0));

      /* ── Right Wall Guitars & Amp ── */
      const rightS = new THREE.Group(); rightS.position.set(5.5, 0, 2.5); scene.add(rightS);
      rightS.rotation.y = -Math.PI/2;
      // Amp
      rightS.add(BOX(0.8, 0.6, 0.4, M.dkGray, -1.5, 0.3, -0.2));
      rightS.add(BOX(0.7, 0.5, 0.42, M.black, -1.5, 0.3, -0.2));
      // Guitars Rack
      rightS.add(BOX(2.0, 0.1, 0.1, M.wood, 0.5, 1.4, -0.3)); // Rack top
      rightS.add(BOX(0.1, 1.4, 0.1, M.wood, -0.4, 0.7, -0.3));
      rightS.add(BOX(0.1, 1.4, 0.1, M.wood, 1.4, 0.7, -0.3));

      // Simple Guitars (Voxels)
      function makeGuitar(gx: number, cBody: string, cPick: string, isBass=false) {
        const guit = new THREE.Group(); guit.position.set(gx, 0.6, -0.2); 
        guit.rotation.x = -0.2; guit.rotation.z = 0.1; rightS.add(guit);
        guit.add(BOX(0.4, 0.5, 0.1, std({c: cBody}), 0, 0, 0)); // Body bot
        guit.add(BOX(0.3, 0.3, 0.1, std({c: cBody}), 0, 0.3, 0)); // Body top
        guit.add(BOX(0.2, 0.4, 0.11, std({c: cPick}), 0, 0.1, 0)); // Pickguard
        guit.add(BOX(0.06, isBass?1.0:0.8, 0.04, std({c: "#dcb18c"}), 0, isBass?0.9:0.8, 0.04)); // Neck
        guit.add(BOX(0.12, 0.2, 0.05, std({c: "#dcb18c"}), 0, isBass?1.5:1.3, 0.04)); // Headstock
      }
      makeGuitar(-0.4, "#d48131", "#ffffff"); // Sunburst
      makeGuitar(0.5, "#dfbd91", "#111111");  // Acoustic
      makeGuitar(1.4, "#2563eb", "#ffffff", true); // Blue Bass

      /* ── Steve-like Voxel Ahmed Character ── */
      ahmed = new THREE.Group(); ahmed.position.copy(tPos); scene.add(ahmed);
      const ahmedMat = {
        skin: std({c:"#f0f0eb"}), hair: std({c:"#05050a"}),
        shirt: std({c:"#38bdf8"}), // Playful Sky Blue 
        pants: std({c:"#111115"}), shoes: std({c:"#1a1a24"})
      };
      
      faceMat = std({c:"#f0f0eb"});

      bodyG2 = new THREE.Group(); ahmed.add(bodyG2); bodyG2.position.y = 0.75;
      // Head
      headG2 = new THREE.Group(); headG2.position.y = 0.6; bodyG2.add(headG2);
      headG2.add(BOX(0.3, 0.3, 0.3, faceMat, 0, 0.15, 0)); // Face
      headG2.add(BOX(0.32, 0.1, 0.32, ahmedMat.hair, 0, 0.28, 0)); // Hair top
      headG2.add(BOX(0.32, 0.2, 0.1, ahmedMat.hair, 0, 0.2, -0.15)); // Hair back
      
      // Eyes & Eyebrows
      lEye = BOX(0.04, 0.04, 0.02, M.black, -0.06, 0.15, 0.15) as THREE.Mesh; headG2.add(lEye);
      rEye = BOX(0.04, 0.04, 0.02, M.black, 0.06, 0.15, 0.15) as THREE.Mesh; headG2.add(rEye);
      lBrow = BOX(0.06, 0.02, 0.02, ahmedMat.hair, -0.06, 0.20, 0.16) as THREE.Mesh; headG2.add(lBrow);
      rBrow = BOX(0.06, 0.02, 0.02, ahmedMat.hair, 0.06, 0.20, 0.16) as THREE.Mesh; headG2.add(rBrow);

      // Torso
      bodyG2.add(BOX(0.4, 0.6, 0.2, ahmedMat.shirt, 0, 0.3, 0));

      // Limbs
      lAG = new THREE.Group(); lAG.position.set(-0.25, 0.55, 0); bodyG2.add(lAG);
      lAG.add(BOX(0.15, 0.6, 0.15, ahmedMat.skin, 0, -0.25, 0));
      rAG = new THREE.Group(); rAG.position.set(0.25, 0.55, 0); bodyG2.add(rAG);
      rAG.add(BOX(0.15, 0.6, 0.15, ahmedMat.skin, 0, -0.25, 0));

      // Legs
      lLG = new THREE.Group(); lLG.position.set(-0.1, 0, 0); bodyG2.add(lLG);
      lLG.add(BOX(0.18, 0.6, 0.18, ahmedMat.pants, 0, -0.3, 0));
      lLG.add(BOX(0.19, 0.15, 0.19, ahmedMat.shoes, 0, -0.65, 0));

      rLG = new THREE.Group(); rLG.position.set(0.1, 0, 0); bodyG2.add(rLG);
      rLG.add(BOX(0.18, 0.6, 0.18, ahmedMat.pants, 0, -0.3, 0));
      rLG.add(BOX(0.19, 0.15, 0.19, ahmedMat.shoes, 0, -0.65, 0));


      /* ── Speech bubble ── */
      let bExpiry: number = 0;
      let bText = "";
      let bIndex = 0;
      let bInterval: ReturnType<typeof setInterval> | null = null;

      function showBubble(txt: string, dur=7000) {
        if (!bubEl) return;
        bText = txt;
        bIndex = 0;
        bubEl.textContent = "";
        bubEl.style.opacity = "1";
        bExpiry = performance.now() + dur;
        
        if (bInterval) clearInterval(bInterval);
        bInterval = setInterval(() => {
          if (!bubEl) return;
          bIndex++;
          bubEl.textContent = bText.substring(0, bIndex) + (bIndex < bText.length ? "|" : "");
          
          if (bIndex >= bText.length) {
            if (bInterval) clearInterval(bInterval);
            bubEl.textContent = bText;
          }
        }, 50);
      }

      function updateBubble() {
        if (!bubEl || !canvas) return;
        if (performance.now() > bExpiry) {
          bubEl.style.opacity = "0";
          if (bInterval) clearInterval(bInterval);
        }
        const p=new THREE.Vector3();
        if (ahmed) ahmed.getWorldPosition(p); p.y+=2.2; p.project(cam);
        const r=canvas.getBoundingClientRect();
        bubEl.style.left=((p.x*.5+.5)*r.width+r.left-14)+"px";
        bubEl.style.top =((-p.y*.5+.5)*r.height+r.top-18)+"px";
      }

      /* ── Ahmed AI ── */
      const DESTS=[
        {p:new THREE.Vector3(-2.5,0,0.5), b: "Reviewing Figma components... 🎨"},
        {p:new THREE.Vector3(0,0,-2.5), b: "💻 Time to deploy."},
        {p:new THREE.Vector3(4.0,0,1.8), b: "🎸 Next.js is so fast..."},
        {p:new THREE.Vector3(-2.0,0, 2.0), b: "I need more coffee ☕"},
      ];

      function updateAhmed() {
        if(grabbingAhmed || !ahmed || aState === "frozen") return;
        dTimer++;
        
        // Stealthy eye movement while dropped (dTimer < 0)
        if (aState === "idle" && dTimer < 10) {
          // Normal position: -0.06 & 0.06
          if (dTimer > -250 && dTimer < -150) {
            // Shift eyes left
            lEye.position.x = -0.08; rEye.position.x = 0.04;
          } else if (dTimer > -100 && dTimer < -20) {
            // Shift eyes right
            lEye.position.x = -0.04; rEye.position.x = 0.08;
          } else {
            // Center
            lEye.position.x = -0.06; rEye.position.x = 0.06;
          }
        }

        // When bubble finishes and timer was stuck at -9999 (talk freeze), snap forward so he walks soon
        if (aState === "idle" && dTimer < -200 && performance.now() > bExpiry) {
          dTimer = 90; // give a brief pause then walk
        }

        if(aState==="idle"&&dTimer>120){
          // Only start walking if bubble is completely gone
          if (performance.now() < bExpiry) return;
          
          const d=DESTS[dI%DESTS.length]; tPos.copy(d.p);
          aState="walking"; dTimer=0; // Speech only occurs when dropped
          
          // Reset facial expression and heat
          lBrow.rotation.z = 0; lBrow.position.y = 0.20;
          rBrow.rotation.z = 0; rBrow.position.y = 0.20;
          lEye.position.x = -0.06; rEye.position.x = 0.06;
          if (faceMat && (faceMat as any).color) {
            (faceMat as any).color.set("#f0f0eb");
          }
        }
        if(aState==="walking"){
          const dx=tPos.x-ahmed.position.x, dz=tPos.z-ahmed.position.z;
          const dist=Math.sqrt(dx*dx+dz*dz);
          const spd = isHyper ? 0.12 : 0.035;
          if(dist>.1){ ahmed.position.x+=dx/dist*spd; ahmed.position.z+=dz/dist*spd;
            ahmed.rotation.y=Math.atan2(dx,dz)*0.25+ahmed.rotation.y*0.75; }
          else{ ahmed.position.copy(tPos); aState="idle"; dTimer=0; dI=(dI+1)%DESTS.length; }
        }
        const wk=aState==="walking";
        const cr=aState==="crying"; 
        const hp=aState==="happy";
        
        if (cr) {
          // Kicking feet wildly
          lLG.rotation.x = Math.sin(AT*15)*0.6; 
          rLG.rotation.x = -Math.sin(AT*15)*0.6;
          lAG.rotation.x = Math.sin(AT*15)*0.4 + Math.PI; // Arms flailing up
          rAG.rotation.x = -Math.sin(AT*15)*0.4 + Math.PI;
          headG2.rotation.y = Math.sin(AT*20)*0.1; // Head shaking
          headG2.rotation.z = 0;
        } else if (hp) {
           ahmed.position.y = Math.abs(Math.sin(AT * 12)) * 0.5; // jumping
           lAG.rotation.x = Math.PI; rAG.rotation.x = Math.PI; // arms up
           lLG.rotation.x = -0.2; rLG.rotation.x = 0.2;
           headG2.rotation.y = 0; headG2.rotation.z = 0;
           if (dTimer > 90) { aState = "idle"; ahmed.position.copy(tPos); dTimer=0; }
        } else {
          const ws=wk?(isHyper?22:8):0, wa=wk?(isHyper?0.6:0.4):0;
          lLG.rotation.x = Math.sin(AT*ws)*wa; rLG.rotation.x = -Math.sin(AT*ws)*wa;
          lAG.rotation.x = -Math.sin(AT*ws)*wa; rAG.rotation.x = Math.sin(AT*ws)*wa;
          
          if(!wk){
            // Subtler head movement when idle and 'angry'
            const mt = dTimer < 0 ? 0.02 : 0.15; 
            headG2.rotation.y = Math.sin(AT*1.2)*mt; 
            headG2.rotation.z = Math.sin(AT*0.8)*(mt/3);
          } else {
            headG2.rotation.y *= 0.8; headG2.rotation.z *= 0.8;
          }
        }
      }

      /* ── Camera update ── */
      function updateCamera() {
        camState.yaw  +=(camState.targetYaw  -camState.yaw  )*.1;
        camState.pitch+=(camState.targetPitch-camState.pitch)*.1;
        camState.posX +=(camState.targetX    -camState.posX )*.1;
        camState.posZ +=(camState.targetZ    -camState.posZ )*.1;
        cam.position.set(camState.posX,camState.posY,camState.posZ);
        cam.rotation.order="YXZ";
        cam.rotation.y=camState.yaw;
        cam.rotation.x=camState.pitch;
      }

      /* ── Proximity Warnings ── */
      let lastWarningTime = 0;
      const PC_POS   = new THREE.Vector3(1.4, 0, -3.8);
      const WIN_L    = new THREE.Vector3(-5.8, 0, -1.0);
      const WIN_R    = new THREE.Vector3( 5.8, 0, -1.0);
      const WARN_DIST = 1.8;
      const WARN_COOLDOWN = 9000;

      const PC_MSGS  = ["⚠️ Ahmed is near the PC! Move him away!", "🛑 Keep him away from the monitors!", "🖥️ Ahmed is too close to the setup!"];
      const WIN_MSGS = ["⚠️ Ahmed is near the window! Grab him!", "🚨 Keep him away from the window!", "🪟 Ahmed might fall — step in!"];

      function checkProximityWarnings() {
        if (!ahmed || aState === "frozen" || aState === "crying" || grabbingAhmed) return;
        const now = performance.now();
        if (now - lastWarningTime < WARN_COOLDOWN) return;
        
        const ap = new THREE.Vector3();
        ahmed.getWorldPosition(ap); ap.y = 0;

        const nearPC   = ap.distanceTo(PC_POS) < WARN_DIST;
        const nearWinL = ap.distanceTo(WIN_L)  < WARN_DIST;
        const nearWinR = ap.distanceTo(WIN_R)  < WARN_DIST;

        if (nearPC) {
          lastWarningTime = now;
          window.dispatchEvent(new CustomEvent('ahmedProximityAlert', { detail: PC_MSGS[Math.floor(Math.random() * PC_MSGS.length)] }));
          lBrow.rotation.z = 0.2; lBrow.position.y = 0.22;
          rBrow.rotation.z = -0.2; rBrow.position.y = 0.22;
        } else if (nearWinL || nearWinR) {
          lastWarningTime = now;
          window.dispatchEvent(new CustomEvent('ahmedProximityAlert', { detail: WIN_MSGS[Math.floor(Math.random() * WIN_MSGS.length)] }));
          lBrow.rotation.z = 0.2; lBrow.position.y = 0.22;
          rBrow.rotation.z = -0.2; rBrow.position.y = 0.22;
        }
      }

      /* ── Main loop ── */
      const clk=new THREE.Clock();
      let animId: number;
      function animate() {
        animId=requestAnimationFrame(animate);
        const t=clk.getElapsedTime(); AT=t;
        updateCamera(); updateAhmed(); updateBubble();
        checkProximityWarnings();
        
        // Detailed neon flickering
        deskGlow.intensity = 1.5 + Math.sin(t*5)*0.1;
        monLight.intensity = 1.2 + Math.cos(t*3)*0.05;

        renderer.render(scene,cam);
      }
      animate();
      showBubble("Welcome to the workspace 🚀", 3000);

      const handleResize = () => onResize();

      return () => {
        cancelAnimationFrame(animId);
        if (canvas) {
          canvas.removeEventListener("mousedown", onMouseDown);
          canvas.removeEventListener("wheel", onWheel as EventListener);
        }
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("ahmedGameReset", onReset);
        window.removeEventListener("ahmedGameEnded", onGameEnd);
        window.removeEventListener("ahmedAction", onAction);
        window.removeEventListener("ahmedGameStartAlert", onGameStartAlert);
        
        // Clean up geometries/materials
        scene.traverse((o: any) => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
                if(Array.isArray(o.material)) o.material.forEach((m:any) => m.dispose());
                else o.material.dispose();
            }
        });
        renderer.dispose();
      };
    };

    boot().then(cleanup => {
      if (cleanup) cleanupRef.current = cleanup;
    });

    return () => {
      disposed = true;
      if (cleanupRef.current) cleanupRef.current();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <section
        ref={sectionRef}
        id="minecraft-room"
        style={{
          position: isPlaying ? "fixed" : "relative",
          top: 0, left: 0, right: 0, bottom: 0,
          width: "100%", height: "100vh",
          background: "#05050a", overflow: "hidden",
          zIndex: isPlaying ? 99999 : 1,
        }}
      >
      <canvas
        ref={canvasRef}
        style={{ width:"100%", height:"100%", display:"block", imageRendering: "pixelated", opacity: isPlaying ? 1 : 0.4, filter: isPlaying ? "none" : "blur(6px)", transition: "all 0.5s ease", pointerEvents: isPlaying ? "auto" : "none" }}
      />

      {!isPlaying && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 30,
          background: "rgba(5, 5, 10, 0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          color: "#f0f0eb", fontFamily: "var(--font-space-grotesk), sans-serif",
          transition: "opacity 0.5s",
        }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem", fontWeight: "bold", letterSpacing: "0.02em" }}>Glad you made it!</h2>
          <p style={{ fontSize: "1.1rem", marginBottom: "2.5rem", textAlign: "center", maxWidth: "480px", color: "rgba(240,240,235,0.7)", lineHeight: 1.6 }}>
            Take care of Ahmed while I grab us a great cup of coffee. He tends to wander off...
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button 
              onClick={() => setIsPlaying(true)}
              className="btn-primary"
              style={{ cursor: "pointer" }}
            >
              Take Care of Ahmed
            </button>
            <button 
              className="btn-ghost"
              style={{ cursor: "pointer" }}
            >
              Nevermind
            </button>
          </div>
        </div>
      )}

      {isPlaying && !isGameEnded && (
        <button
          onClick={() => setIsPlaying(false)}
          className="btn-ghost"
          style={{
            position: "absolute", top: "32px", right: "32px", zIndex: 50,
            padding: "10px 20px", fontSize: "0.8rem", cursor: "pointer",
            background: "rgba(5,5,10,0.8)", border: "1px solid rgba(240,240,235,0.2)"
          }}
        >
          Exit Game
        </button>
      )}

      {isPlaying && !isGameEnded && (
        <div style={{
          position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "12px", zIndex: 50, flexWrap: "wrap", justifyContent: "center",
          width: "100%", padding: "0 10px"
        }}>
          <button onClick={() => triggerAction('kinder')} className="btn-ghost" style={{ background:"rgba(5,5,10,0.8)", border: "1px solid rgba(240,240,235,0.2)", cursor: "pointer", fontSize: "0.9rem", padding: "10px 20px" }}>Give Kinder 🥚</button>
          
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {showQuestions && (
              <select 
                onChange={(e) => {
                  if (e.target.value === "close") {
                    setShowQuestions(false);
                  } else if (e.target.value !== "") {
                    triggerAction(e.target.value);
                  }
                  e.target.value = ""; // Reset select visual so placeholder remains active
                }}
                defaultValue=""
                style={{ 
                  position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-50%)",
                  background: "rgba(5,5,10,0.9)", border: "1px solid rgba(240,240,235,0.4)", color: "#f0f0eb",
                  cursor: "pointer", fontSize: "0.85rem", padding: "8px", outline: "none", width: "190px",
                  borderRadius: "4px", fontFamily: "var(--font-space-grotesk), sans-serif", zIndex: 60,
                  marginBottom: "8px"
                }}
              >
                <option value="" disabled>Ask a question...</option>
                <option value="talk1">How are the codes? 💻</option>
                <option value="talk2">Take a break? 😴</option>
                <option value="talk3">How old are you? 🎂</option>
                <option value="close">✖ Close Talk</option>
              </select>
            )}
            <button 
              onClick={() => { setShowQuestions(true); triggerAction('center_ahmed'); }} 
              className="btn-ghost" 
              style={{ background: showQuestions ? "rgba(37, 99, 235, 0.8)" : "rgba(5,5,10,0.8)", border: "1px solid rgba(240,240,235,0.2)", cursor: "pointer", fontSize: "0.9rem", padding: "10px 20px" }}
            >
              Talk to Him 💬
            </button>
          </div>

          <button onClick={() => triggerAction('coffee')} className="btn-ghost" style={{ background:"rgba(5,5,10,0.8)", border: "1px solid rgba(240,240,235,0.2)", cursor: "pointer", fontSize: "0.9rem", padding: "10px 20px" }}>Give Espresso ☕</button>
        </div>
      )}

      {/* User Alert Toast - proximity warning directed at user */}
      {isPlaying && !isGameEnded && userAlert && (
        <div style={{
          position: "absolute", top: "28px", left: "50%", transform: "translateX(-50%)",
          background: "rgba(239, 68, 68, 0.93)",
          backdropFilter: "blur(8px)",
          color: "#fff", fontWeight: "bold",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "0.9rem", padding: "10px 28px",
          borderRadius: "30px", border: "1px solid rgba(255,180,180,0.5)",
          boxShadow: "0 4px 20px rgba(239,68,68,0.5)",
          zIndex: 60, pointerEvents: "none",
          animation: "fadeIn 0.3s ease",
          whiteSpace: "nowrap",
        }}>
          {userAlert}
        </div>
      )}

      {isPlaying && !isGameEnded && (
        <div style={{
          position: "absolute", bottom: "100px", right: "24px",
          display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", 
          background: "rgba(5,5,10,0.85)", padding: "10px 16px", 
          borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          zIndex: 50, boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          transition: "all 0.3s"
        }}>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.6, color: "#e2e8f0" }}>Ahmed&apos;s Patience</span>
          <div style={{ display: "flex", gap: "6px" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} style={{ 
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                fontSize: "1rem",
                opacity: i < patienceLeft ? 1 : 0.2, 
                transform: i < patienceLeft ? "scale(1)" : "scale(0.6)",
                filter: i < patienceLeft ? "none" : "grayscale(100%)" 
              }}>
                ❤️
              </span>
            ))}
          </div>
        </div>
      )}

      {isGameEnded && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 100,
          background: "rgba(5, 5, 10, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          color: "#f0f0eb", fontFamily: "var(--font-space-grotesk), sans-serif",
          animation: "fadeIn 1s ease forwards",
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "40px",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
            maxWidth: "500px",
          }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem", fontWeight: "bold", color: "#60a5fa" }}>I'm back! ☕</h2>
            <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "rgba(240,240,235,0.8)", lineHeight: 1.6 }}>
              Whoa, it looks like he was giving you a hard time. I am so sorry if Ahmed annoyed you! Thanks for keeping an eye on him.
            </p>
            <button 
              onClick={() => {
                setIsGameEnded(false);
                setIsPlaying(false);
                window.dispatchEvent(new CustomEvent('ahmedGameReset'));
              }}
              className="btn-primary"
              style={{ cursor: "pointer", padding: "12px 32px" }}
            >
              Back to Portfolio
            </button>
          </div>
        </div>
      )}

      <div style={{
        position:"absolute", top:0, left:0, right:0,
        display:"flex", flexDirection:"column", alignItems:"center",
        paddingTop:"22px", pointerEvents:"none", zIndex:10,
        opacity: isPlaying ? 1 : 0, transition: "opacity 0.3s"
      }}>
        <div style={{
          fontFamily:"'VT323', monospace",
          fontSize:"clamp(18px, 2.5vw, 24px)",
          color:"rgba(255,255,255,0.92)",
          textAlign:"center", direction:"ltr", lineHeight:1.8,
          textShadow:"2px 2px 0px rgba(0,0,0,0.8)",
          padding:"10px 20px", maxWidth:"520px",
          background:"rgba(5,5,10,0.8)",
          border: "2px solid #444",
          borderRadius:"2px",
        }}>
          Keep an eye on him 🌌
          <br />
          <span style={{ color:"#e2e8f0", fontWeight:"bold" }}>Don't let him break anything.</span>
        </div>
        <div style={{
          marginTop:"8px", fontSize:"12px",
          color:"rgba(255,255,255,0.6)",
          letterSpacing:"0.1em", textTransform:"uppercase",
          fontFamily:"'VT323', monospace",
          textShadow:"1px 1px 0px #000",
        }}>
          drag to look around · scroll to move · click ahmed to grab
        </div>
      </div>
      <div
        ref={bubbleRef}
        style={{
          position:"absolute", left:0, top:0,
          background:"#111", border: "2px solid #555",
          color:"#f0f0eb",
          borderRadius:"2px",
          padding:"8px 14px", fontSize:"15px",
          boxShadow:"4px 4px 0px rgba(0,0,0,0.8)",
          pointerEvents:"none", zIndex:20,
          opacity:0, transition:"opacity 0.2s",
          whiteSpace:"nowrap", fontFamily:"'VT323', monospace", fontWeight: "bold",
          direction:"ltr",
        }}
      />
      </section>
    </div>
  );
}
