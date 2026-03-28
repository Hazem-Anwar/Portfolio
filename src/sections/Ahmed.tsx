// src/sections/AhmedRoom.tsx
"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";

export default function AhmedRoom() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const bubbleRef   = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const cleanupRef  = useRef<(() => void) | null>(null);

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
        antialias: true,
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

      /* ── Camera ── */
      const cam = new THREE.PerspectiveCamera(
        72,
        canvas.clientWidth / canvas.clientHeight,
        0.05,
        50
      );
      cam.position.set(0, 1.7, 3.5);
      cam.lookAt(0, 1.5, 0);

      /* ── Camera state ── */
      const camState = {
        yaw: 0, pitch: -0.08,
        targetYaw: 0, targetPitch: -0.08,
        posX: 0, posY: 1.7, posZ: 3.5,
        targetX: 0, targetZ: 3.5,
        isDragging: false,
        lastX: 0, lastY: 0,
        sensitivity: 0.003,
      };

      const onMouseDown = (e: MouseEvent) => {
        const r = canvas.getBoundingClientRect();
        const m2d = new THREE.Vector2(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -((e.clientY - r.top) / r.height) * 2 + 1
        );
        const ray = new THREE.Raycaster();
        ray.setFromCamera(m2d, cam);
        const ap = new THREE.Vector3();
        ahmed.getWorldPosition(ap); ap.y = 1.0;
        const d2 = ray.ray.direction, o = ray.ray.origin;
        const t2 = ap.clone().sub(o).dot(d2);
        const cl = o.clone().add(d2.clone().multiplyScalar(t2));
        if (cl.distanceTo(ap) < 0.7 && t2 > 0) {
          dragAhmed = true; grabbingAhmed = true;
          canvas.style.cursor = "grabbing";
          showBubble("😱 ماماا!!", 3000);
        } else {
          camState.isDragging = true;
          camState.lastX = e.clientX;
          camState.lastY = e.clientY;
        }
      };

      const onMouseMove = (e: MouseEvent) => {
        if (dragAhmed) {
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
            hp.x = Math.max(-4.2, Math.min(4.2, hp.x));
            hp.z = Math.max(-4.0, Math.min(4.2, hp.z));
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
        camState.targetYaw    = Math.max(-0.9, Math.min(0.9, camState.targetYaw));
      };

      const onMouseUp = () => {
        if (dragAhmed) {
          dragAhmed = false; grabbingAhmed = false;
          canvas.style.cursor = "";
          showBubble("😤 هذا ظلم يا حزم!!", 2500);
          dTimer = 120; aState = "idle";
        }
        camState.isDragging = false;
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * 0.004;
        camState.targetZ += delta * Math.cos(camState.targetYaw);
        camState.targetX += delta * Math.sin(camState.targetYaw);
        camState.targetX = Math.max(-3.5, Math.min(3.5, camState.targetX));
        camState.targetZ = Math.max(-3.0, Math.min(4.2, camState.targetZ));
      };

      const onResize = () => {
        cam.aspect = canvas.clientWidth / canvas.clientHeight;
        cam.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      };

      canvas.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup",   onMouseUp);
      canvas.addEventListener("wheel",     onWheel, { passive: false });
      window.addEventListener("resize",    onResize);

      /* ── Helpers ── */
      function ctex(w: number, h: number, fn: (c: CanvasRenderingContext2D, w: number, h: number) => void) {
        const cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        fn(cv.getContext("2d")!, w, h);
        const t = new THREE.CanvasTexture(cv);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      }
      function std(p: {
        c?: string; r?: number; m?: number; map?: THREE.Texture;
        t?: boolean; o?: number; em?: string; ei?: number;
        side?: THREE.Side; depthWrite?: boolean;
      }) {
        const o: Record<string, unknown> = {
          color:     new THREE.Color(p.c || "#fff"),
          roughness: p.r !== undefined ? p.r : 0.8,
          metalness: p.m !== undefined ? p.m : 0,
        };
        if (p.map)  o.map = p.map;
        if (p.t)    { o.transparent = true; o.opacity = p.o !== undefined ? p.o : 1; }
        if (p.em)   { o.emissive = new THREE.Color(p.em); o.emissiveIntensity = p.ei || 1; }
        if (p.side !== undefined) o.side = p.side;
        if (p.depthWrite !== undefined) o.depthWrite = p.depthWrite;
        return new THREE.MeshStandardMaterial(o as THREE.MeshStandardMaterialParameters);
      }
      function sh<T extends THREE.Object3D>(m: T): T {
        m.castShadow = true; m.receiveShadow = true; return m;
      }
      function rsh<T extends THREE.Object3D>(m: T): T {
        m.receiveShadow = true; return m;
      }
      function BOX(w: number, h: number, d: number, mat: THREE.Material,
        x=0,y=0,z=0,rx=0,ry=0,rz=0) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
        m.position.set(x,y,z); m.rotation.set(rx,ry,rz); return sh(m);
      }
      function CYL(rt: number,rb: number,h: number,seg: number,mat: THREE.Material,x=0,y=0,z=0) {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg), mat);
        m.position.set(x,y,z); return sh(m);
      }
      function SPH(r: number,ws: number,hs: number,mat: THREE.Material,x=0,y=0,z=0) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(r,ws,hs), mat);
        m.position.set(x,y,z); return sh(m);
      }
      function ol(mesh: THREE.Mesh, t=0.016, col=0x111111) {
        const o = new THREE.Mesh(mesh.geometry,
          new THREE.MeshBasicMaterial({color:col, side:THREE.BackSide}));
        o.scale.setScalar(1+t); mesh.add(o); return mesh;
      }

      /* ── Textures ── */
      const floorTex = ctex(1024, 1024, (c, w, h) => {
        const planks = ["#d4a96a","#c89a58","#dbb572","#c49050","#e0bc7a"];
        for (let row=0;row<10;row++) {
          let x=(row%2)*140;
          while(x<w) {
            const pw=120+Math.random()*80;
            c.fillStyle=planks[Math.floor(Math.random()*planks.length)];
            c.fillRect(x,row*102,pw-1.5,101);
            c.strokeStyle="rgba(0,0,0,0.07)"; c.lineWidth=1;
            for(let g=0;g<3;g++){c.beginPath();c.moveTo(x+Math.random()*pw,row*102);c.lineTo(x+Math.random()*pw,row*102+102);c.stroke();}
            x+=pw;
          }
          c.fillStyle="rgba(0,0,0,0.12)"; c.fillRect(0,row*102,w,1.5);
        }
      });
      floorTex.wrapS=floorTex.wrapT=THREE.RepeatWrapping; floorTex.repeat.set(3,3);

      const wallTex = ctex(512,512,(c,w,h)=>{
        c.fillStyle="#dcdad4"; c.fillRect(0,0,w,h);
        for(let i=0;i<3000;i++){c.fillStyle=`rgba(0,0,0,${Math.random()*0.008})`;c.fillRect(Math.random()*w,Math.random()*h,Math.random()*4+1,Math.random()*4+1);}
      });
      wallTex.wrapS=wallTex.wrapT=THREE.RepeatWrapping; wallTex.repeat.set(3,1.5);

      const woodTex = ctex(512,256,(c,w,h)=>{
        c.fillStyle="#b07838"; c.fillRect(0,0,w,h);
        for(let i=0;i<10;i++){c.strokeStyle="rgba(60,30,5,0.1)";c.lineWidth=Math.random()*3+0.5;c.beginPath();c.moveTo(0,Math.random()*h);c.lineTo(w,Math.random()*h+10);c.stroke();}
      });
      woodTex.wrapS=woodTex.wrapT=THREE.RepeatWrapping;

      const dkWoodTex = ctex(256,256,(c,w,h)=>{
        c.fillStyle="#2a1808"; c.fillRect(0,0,w,h);
        for(let i=0;i<8;i++){c.strokeStyle="rgba(50,25,8,0.2)";c.lineWidth=Math.random()*4+1;c.beginPath();c.moveTo(0,Math.random()*h);c.lineTo(w,Math.random()*h);c.stroke();}
      });
      dkWoodTex.wrapS=dkWoodTex.wrapT=THREE.RepeatWrapping;

      /* ── Materials ── */
      const M = {
        floor:   std({c:"#ffffff",r:0.45,m:0.05,map:floorTex}),
        wall:    std({c:"#dcdad4",r:0.92,map:wallTex}),
        ceil:    std({c:"#e8e6e0",r:0.96}),
        wood:    std({c:"#b07838",r:0.58,m:0.02,map:woodTex}),
        dkWood:  std({c:"#2a1808",r:0.7,m:0.02,map:dkWoodTex}),
        sfBlue:  std({c:"#4a6fa5",r:0.88}),
        sfDark:  std({c:"#3a5580",r:0.9}),
        black:   std({c:"#111111",r:0.5,m:0.2}),
        dkGray:  std({c:"#2a2a2a",r:0.5,m:0.3}),
        silver:  std({c:"#aaaaaa",r:0.25,m:0.85}),
        winG:    std({c:"#d8eeff",r:0.02,t:true,o:0.18,side:THREE.DoubleSide}),
        skin:    std({c:"#f5c5a3",r:0.82}),
        hair:    std({c:"#1c0a00",r:0.92}),
        shirt:   std({c:"#cc2222",r:0.88}),
        jeans:   std({c:"#1e3a8a",r:0.9}),
        shoe:    std({c:"#eeeeee",r:0.65,m:0.05}),
        green:   std({c:"#2d6a2d",r:0.92}),
        pot:     std({c:"#f0f0f0",r:0.7}),
        mug:     std({c:"#fafafa",r:0.6}),
        wfm:     std({c:"#ffffff",r:0.55}),
        trim:    std({c:"#4a3020",r:0.65,m:0.02,map:dkWoodTex}),
        chBlue:  std({c:"#1a2a3a",r:0.82,m:0.05}),
        chDark:  std({c:"#111a22",r:0.88,m:0.08}),
        swR:     std({c:"#dd2222",r:0.7,m:0.1}),
        swB:     std({c:"#2255cc",r:0.7,m:0.1}),
        curtain: std({c:"#4a5d7a",r:0.95,side:THREE.DoubleSide}),
        gold:    std({c:"#c49a28",r:0.28,m:0.75}),
      };

      /* ── Lights ── */
      scene.add(new THREE.AmbientLight(0xfff5e8, 0.5));

      const pendantLight = new THREE.PointLight(0xfff5e0, 3.5, 12, 1.2);
      pendantLight.position.set(0,4.8,0);
      pendantLight.castShadow=true;
      pendantLight.shadow.mapSize.set(1024,1024);
      pendantLight.shadow.bias=-0.002;
      scene.add(pendantLight);

      const winL=new THREE.DirectionalLight(0xd0e8ff,0.8); winL.position.set(-6,3,0); scene.add(winL);
      const winR=new THREE.DirectionalLight(0xd0e8ff,0.6); winR.position.set(6,3,2); scene.add(winR);
      const lampPt=new THREE.PointLight(0xffaa44,1.4,4,1.8); lampPt.position.set(-2.5,1.8,1.0); scene.add(lampPt);
      const monGlow=new THREE.PointLight(0x6688ff,0.4,3); monGlow.position.set(0,1.7,-1.5); scene.add(monGlow);

      /* ── Room ── */
      const RW=10, RH=5.0, RD=9;

      const floor=rsh(new THREE.Mesh(new THREE.PlaneGeometry(RW,RD),M.floor));
      floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; scene.add(floor);

      const reflM=std({c:"#c49050",r:0,t:true,o:0.08,depthWrite:false});
      const refl=new THREE.Mesh(new THREE.PlaneGeometry(RW,RD),reflM);
      refl.rotation.x=-Math.PI/2; refl.position.y=0.002; scene.add(refl);

      [
        [0,RH/2,-RD/2,0,0,0],
        [0,RH/2,RD/2,0,Math.PI,0],
        [-RW/2,RH/2,0,0,Math.PI/2,0],
        [RW/2,RH/2,0,0,-Math.PI/2,0],
      ].forEach(([x,y,z,rx,ry,rz])=>{
        const w=rsh(new THREE.Mesh(new THREE.PlaneGeometry(
          Math.abs(ry)===Math.PI/2?RD:RW,RH),M.wall));
        w.position.set(x,y,z); w.rotation.set(rx,ry,rz); scene.add(w);
      });

      const ceil=rsh(new THREE.Mesh(new THREE.PlaneGeometry(RW,RD),M.ceil));
      ceil.rotation.x=Math.PI/2; ceil.position.y=RH; scene.add(ceil);

      // Baseboard + ceiling trim
      scene.add(BOX(RW+0.02,0.18,0.06,M.trim,0,0.09,-RD/2+0.03));
      scene.add(BOX(RW+0.02,0.18,0.06,M.trim,0,0.09, RD/2-0.03));
      scene.add(BOX(0.06,0.18,RD,M.trim,-RW/2+0.03,0.09,0));
      scene.add(BOX(0.06,0.18,RD,M.trim, RW/2-0.03,0.09,0));

      /* ── Pendant light fixture ── */
      const pendantG=new THREE.Group(); pendantG.position.set(0,RH,0); scene.add(pendantG);
      pendantG.add(sh(new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.6,8),std({c:"#222",r:0.5,m:0.5}))));
      pendantG.children[0].position.y=-0.3;
      const shadeRing=sh(new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.45,0.14,24),M.gold));
      shadeRing.position.y=-0.68; pendantG.add(shadeRing);
      const bulb=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,8),std({c:"#fffaee",r:0.1,em:"#fffaee",ei:3}));
      bulb.position.y=-0.65; pendantG.add(bulb);

      /* ── Windows ── */
      function makeWindow(wx: number, wy: number, wz: number, rotY: number) {
        const g=new THREE.Group(); g.position.set(wx,wy,wz); g.rotation.y=rotY; scene.add(g);
        const WW=1.8, WH=2.2;
        const skyT=ctex(128,128,(c,w,h)=>{
          const grad=c.createLinearGradient(0,0,0,h);
          grad.addColorStop(0,"#8bb8d4"); grad.addColorStop(0.5,"#e8c89a"); grad.addColorStop(1,"#c8a070");
          c.fillStyle=grad; c.fillRect(0,0,w,h);
          c.fillStyle="#5a4030"; c.fillRect(0,h*0.7,w,h*0.3);
          for(let b=0;b<12;b++){const bw=6+Math.random()*12,bh=15+Math.random()*30;c.fillRect(Math.random()*w,h*0.7-bh,bw,bh);}
        });
        const outside=new THREE.Mesh(new THREE.PlaneGeometry(WW-0.1,WH-0.1),
          new THREE.MeshBasicMaterial({map:skyT,side:THREE.BackSide}));
        outside.position.z=-0.04; g.add(outside);
        g.add(BOX(WW+0.12,0.08,0.12,M.wfm,0,WH/2));
        g.add(BOX(WW+0.12,0.08,0.12,M.wfm,0,-WH/2));
        g.add(BOX(0.08,WH+0.08,0.12,M.wfm,-WW/2,0));
        g.add(BOX(0.08,WH+0.08,0.12,M.wfm, WW/2,0));
        g.add(BOX(WW,0.05,0.06,M.wfm,0,0));
        g.add(BOX(0.05,WH,0.06,M.wfm,0,0));
        g.add(new THREE.Mesh(new THREE.PlaneGeometry(WW-0.06,WH-0.06),M.winG));
        const cL=sh(new THREE.Mesh(new THREE.BoxGeometry(0.35,WH+0.4,0.04),M.curtain));
        cL.position.set(-WW/2-0.2,0.1,0.04); g.add(cL);
        const cR=sh(new THREE.Mesh(new THREE.BoxGeometry(0.35,WH+0.4,0.04),M.curtain));
        cR.position.set(WW/2+0.2,0.1,0.04); g.add(cR);
      }
      makeWindow(-RW/2+0.04,2.1,-1.5,Math.PI/2);
      makeWindow( RW/2-0.04,2.1, 1.2,-Math.PI/2);

      /* ── Floor lamp ── */
      const flG=new THREE.Group(); flG.position.set(-3.0,0,0.8); scene.add(flG);
      flG.add(sh(CYL(0.025,0.025,1.8,10,std({c:"#c8a830",r:0.3,m:0.7}),0,0.9,0)));
      flG.add(sh(new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.22,0.06,16),std({c:"#c8a830",r:0.3,m:0.7}))));
      const fShade=sh(new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.2,0.44,18),std({c:"#f5f0dc",r:0.7})));
      fShade.position.y=2.05; flG.add(fShade);

      /* ── Wall shelves (back wall right) ── */
      [-0.8,0.4,1.4].forEach((y,si)=>{
        const sy=2.4+y;
        const shelf=sh(ol(new THREE.Mesh(new THREE.BoxGeometry(1.4,0.05,0.24),
          std({c:"#c4895a",r:0.6,m:0.02})),0.01));
        shelf.position.set(2.5,sy,-RD/2+0.16); scene.add(shelf);
        const bc=["#8B1A1A","#1A3A8B","#1A6B3A","#8B6A1A","#5A1A8B","#cc4422"];
        let bx=2.5-0.55;
        for(let b=0;b<4+si&&bx<3.1;b++){
          const bh=0.18+Math.random()*0.1,bw=0.06+Math.random()*0.04;
          const book=sh(ol(new THREE.Mesh(new THREE.BoxGeometry(bw,bh,0.18),std({c:bc[b%bc.length],r:0.9})),0.014));
          book.position.set(bx+bw/2,sy+bh/2+0.028,-RD/2+0.16);
          book.rotation.y=(Math.random()-0.5)*0.04; scene.add(book);
          bx+=bw+0.008;
        }
      });

      /* ── Desk ── */
      const dkG=new THREE.Group(); dkG.position.set(0,0,-RD/2+1.2); scene.add(dkG);
      const dskMat=std({c:"#b07838",r:0.55,m:0.02,map:woodTex});
      const dtop=sh(ol(new THREE.Mesh(new THREE.BoxGeometry(2.2,0.06,0.9),dskMat),0.008));
      dtop.position.y=0.78; dkG.add(dtop);
      const lFM=std({c:"#1a1a1a",r:0.4,m:0.5});
      [[-1.0,0.39,-0.1],[1.0,0.39,-0.1],[-1.0,0.39,0.3],[1.0,0.39,0.3]].forEach(([x,y,z])=>dkG.add(BOX(0.06,0.78,0.06,lFM,x,y,z)));
      dkG.add(BOX(1.96,0.05,0.04,lFM,0,0.06,-0.1));
      dkG.add(BOX(1.96,0.05,0.04,lFM,0,0.06, 0.3));
      dkG.add(BOX(0.04,0.05,0.38,lFM,-1.0,0.06,0.1));
      dkG.add(BOX(0.04,0.05,0.38,lFM, 1.0,0.06,0.1));

      /* ── 3 Monitors ── */
      const scrT=ctex(512,320,(c,w,h)=>{
        const g=c.createLinearGradient(0,0,w,h); g.addColorStop(0,"#0a1628"); g.addColorStop(1,"#0d1f3c");
        c.fillStyle=g; c.fillRect(0,0,w,h);
        c.fillStyle="#1a4080"; c.fillRect(0,0,w,h*0.6);
        c.fillStyle="#2563eb"; c.globalAlpha=0.4; c.beginPath(); c.arc(w*0.4,h*0.4,80,0,Math.PI*2); c.fill();
        c.globalAlpha=1;
        c.fillStyle="rgba(0,0,10,0.7)"; c.fillRect(0,h-28,w,28);
        c.fillStyle="#fff";
        c.fillRect(w/2-10,h-21,8,8); c.fillRect(w/2+2,h-21,8,8);
        c.fillRect(w/2-10,h-11,8,8); c.fillRect(w/2+2,h-11,8,8);
      });
      [-0.82,0,0.82].forEach(ox=>{
        const mG=new THREE.Group(); mG.position.set(ox,1.2,-RD/2+1.16); scene.add(mG);
        const fr=sh(ol(new THREE.Mesh(new THREE.BoxGeometry(0.72,0.44,0.04),std({c:"#111111",r:0.4,m:0.3})),0.012));
        mG.add(fr);
        const scr=new THREE.Mesh(new THREE.PlaneGeometry(0.66,0.38),std({c:"#ffffff",r:0.05,map:scrT,em:"#0a1628",ei:0.5}));
        scr.position.z=0.022; mG.add(scr);
        const stN=sh(CYL(0.02,0.02,0.18,8,std({c:"#1a1a1a",r:0.4,m:0.4}),0,-0.1,0.02));
        mG.add(stN);
        const stB=sh(ol(new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.14,0.02,16),std({c:"#111111",r:0.35,m:0.4})),0.01));
        stB.position.set(0,-0.2,0.02); mG.add(stB);
      });

      /* ── Keyboard + mouse ── */
      const kbT=ctex(256,96,(c,w,h)=>{
        c.fillStyle="#d2d2d2"; c.fillRect(0,0,w,h);
        for(let r=0;r<3;r++) for(let k=0;k<14;k++){c.fillStyle=k%2===0?"#c8c8c8":"#dedede";c.fillRect(2+k*17,4+r*27,15,21);}
        c.fillStyle="#d0d0d0"; c.fillRect(45,85,166,16);
      });
      const kb=sh(new THREE.Mesh(new THREE.BoxGeometry(0.7,0.018,0.26),std({c:"#d2d2d2",r:0.65,map:kbT})));
      kb.position.set(-0.1,0.82,-RD/2+1.52); scene.add(kb);
      const ms=sh(ol(new THREE.Mesh(new THREE.BoxGeometry(0.09,0.035,0.14),std({c:"#dddddd",r:0.4,m:0.1})),0.018));
      ms.position.set(0.46,0.82,-RD/2+1.52); scene.add(ms);

      /* ── Coffee mug ── */
      const mgG=new THREE.Group(); mgG.position.set(0.85,0.825,-RD/2+1.15); scene.add(mgG);
      mgG.add(sh(CYL(0.09,0.075,0.19,20,M.mug)));
      const hC=new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.09,0.05,0),new THREE.Vector3(0.17,0.05,0),
        new THREE.Vector3(0.17,-0.02,0),new THREE.Vector3(0.09,-0.06,0)
      ]);
      mgG.add(sh(new THREE.Mesh(new THREE.TubeGeometry(hC,10,0.015,8,false),M.mug)));
      const cTop=new THREE.Mesh(new THREE.CircleGeometry(0.075,20),std({c:"#2c1005",r:0.4}));
      cTop.rotation.x=-Math.PI/2; cTop.position.y=0.09; mgG.add(cTop);

      // Steam
      const stPts: THREE.Mesh[] = [];
      for(let i=0;i<10;i++){
        const sm=new THREE.Mesh(new THREE.SphereGeometry(0.012,6,6),
          new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.22,depthWrite:false}));
        sm.userData={ox:0.85,oy:0.95+i*0.12,oz:-RD/2+1.15,ph:Math.random()*Math.PI*2,sp:0.6+Math.random()*0.4};
        stPts.push(sm); scene.add(sm);
      }

      /* ── Chair ── */
      const chG=new THREE.Group(); chG.position.set(-0.1,0,-RD/2+2.0); scene.add(chG);
      const chSeat=sh(ol(new THREE.Mesh(new THREE.BoxGeometry(0.66,0.1,0.62),M.chBlue),0.01));
      chSeat.position.y=0.52; chG.add(chSeat);
      const chBk=sh(ol(new THREE.Mesh(new THREE.BoxGeometry(0.64,0.78,0.1),M.chDark),0.01));
      chBk.position.set(0,0.93,-0.26); chBk.rotation.x=0.08; chG.add(chBk);
      const chHd=sh(ol(new THREE.Mesh(new THREE.BoxGeometry(0.44,0.22,0.1),M.chBlue),0.01));
      chHd.position.set(0,1.36,-0.26); chG.add(chHd);
      [-0.38,0.38].forEach(x=>{
        chG.add(BOX(0.07,0.05,0.38,M.dkGray,x,0.62,-0.04));
        chG.add(BOX(0.06,0.14,0.05,M.dkGray,x,0.54,0.14));
      });
      chG.add(CYL(0.038,0.038,0.4,10,M.dkGray,0,0.2,0));
      for(let i=0;i<5;i++){
        const a=i*Math.PI*2/5;
        chG.add(BOX(0.42,0.04,0.055,M.dkGray,Math.cos(a)*0.18,0.03,Math.sin(a)*0.18,0,a+Math.PI/2,0));
        const wh=CYL(0.042,0.042,0.055,8,M.black,Math.cos(a)*0.4,0.022,Math.sin(a)*0.4);
        wh.rotation.z=Math.PI/2; chG.add(wh);
      }

      /* ── Big plant ── */
      const bgP=new THREE.Group(); bgP.position.set(3.8,0,1.5); scene.add(bgP);
      bgP.add(sh(ol(CYL(0.3,0.25,0.6,16,M.pot),0.012))).position.y=0.3;
      [0,Math.PI*0.65,Math.PI*1.35].forEach((a,i)=>{
        const tk=CYL(0.025,0.04,0.9+i*0.15,8,std({c:"#7a5030",r:0.85}),Math.cos(a)*0.08,0.85+i*0.04,Math.sin(a)*0.08);
        tk.rotation.z=Math.cos(a)*0.16; tk.rotation.x=Math.sin(a)*0.16; bgP.add(tk);
      });
      for(let i=0;i<28;i++){
        const lf=SPH(0.13+Math.random()*0.1,8,8,std({c:Math.random()>.4?"#2d6a2d":"#3a8a3a",r:0.92}),
          (Math.random()-.5)*0.8,1.2+Math.random()*0.9,(Math.random()-.5)*0.8);
        lf.scale.set(1,0.65+Math.random()*0.35,1); bgP.add(lf);
      }

      /* ── Ahmed character ── */
      const ahmed=new THREE.Group(); ahmed.name="ahmed"; scene.add(ahmed);
      const bodyG2=new THREE.Group(); ahmed.add(bodyG2);
      const headG2=new THREE.Group(); bodyG2.add(headG2); headG2.position.y=1.35;
      const lLG=new THREE.Group(); bodyG2.add(lLG); lLG.position.set(-0.12,0.68,0);
      const rLG=new THREE.Group(); bodyG2.add(rLG); rLG.position.set( 0.12,0.68,0);
      const lAG=new THREE.Group(); bodyG2.add(lAG); lAG.position.set(-0.22,1.08,0);
      const rAG=new THREE.Group(); bodyG2.add(rAG); rAG.position.set( 0.22,1.08,0);

      // Head
      const hdM=sh(new THREE.Mesh(new THREE.SphereGeometry(0.23,22,18),M.skin));
      hdM.scale.set(1,1.06,.96); headG2.add(hdM);
      const hairCap=new THREE.Mesh(new THREE.SphereGeometry(0.225,16,12,0,Math.PI*2,0,Math.PI*.55),M.hair);
      hairCap.position.y=0.02; headG2.add(hairCap);
      for(let i=0;i<6;i++){
        const sp=new THREE.Mesh(new THREE.ConeGeometry(0.036,0.13,7),M.hair);
        const a=(i-2.5)*.28; sp.position.set(Math.sin(a)*.19,0.21,-Math.abs(Math.cos(a))*.04);
        sp.rotation.z=a; sp.rotation.x=-.38+Math.abs(a)*.1; headG2.add(sp);
      }
      [-1,1].forEach(s=>{
        const ear=sh(new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),M.skin));
        ear.position.set(s*.23,0,0); ear.scale.set(.5,.7,.6); headG2.add(ear);
      });
      [-0.09,0.09].forEach(x=>{
        const ew=new THREE.Mesh(new THREE.SphereGeometry(.055,12,10),std({c:"#fff",r:0.5}));
        ew.position.set(x,-.02,.19); ew.scale.z=.6; headG2.add(ew);
        const pu=new THREE.Mesh(new THREE.SphereGeometry(.036,10,8),new THREE.MeshBasicMaterial({color:0x0d0d0d}));
        pu.position.set(x,-.02,.22); pu.scale.z=.5; headG2.add(pu);
        const sh2=new THREE.Mesh(new THREE.SphereGeometry(.014,6,6),new THREE.MeshBasicMaterial({color:0xffffff}));
        sh2.position.set(x+.012,.01,.235); headG2.add(sh2);
      });
      [-0.09,0.09].forEach(x=>{
        const br=new THREE.Mesh(new THREE.BoxGeometry(.08,.022,.018),M.hair);
        br.position.set(x,.09,.19); br.rotation.z=x>0?-.2:.2; headG2.add(br);
      });
      const ns=sh(new THREE.Mesh(new THREE.SphereGeometry(.028,8,6),M.skin));
      ns.position.set(0,-.05,.22); ns.scale.set(.9,.8,.6); headG2.add(ns);
      [-0.13,0.13].forEach(x=>{
        const ck=new THREE.Mesh(new THREE.SphereGeometry(.065,8,8),std({c:"#ff9999",r:0.9,t:true,o:0.4}));
        ck.position.set(x,-.07,.17); ck.scale.z=.35; headG2.add(ck);
      });
      const mth=new THREE.Mesh(new THREE.TorusGeometry(.048,.013,7,14,Math.PI),std({c:"#aa5544",r:0.9}));
      mth.position.set(0,-.1,.21); mth.rotation.z=Math.PI; headG2.add(mth);
      bodyG2.add(sh(CYL(.075,.09,.1,12,M.skin,0,1.25,0)));
      const torso=sh(ol(new THREE.Mesh(new THREE.BoxGeometry(.4,.46,.24),M.shirt),.014));
      torso.position.set(0,.94,0); bodyG2.add(torso);
      bodyG2.add(sh(CYL(.1,.13,.06,12,std({c:"#aa1111",r:.9}),0,1.14,0)));
      [lAG,rAG].forEach(ag=>{
        const up=sh(ol(new THREE.Mesh(new THREE.CylinderGeometry(.072,.065,.34,12),M.shirt),.012));
        up.position.y=-.17; ag.add(up);
        ag.add(sh(CYL(.062,.055,.3,12,M.skin,0,-.48,0)));
        const hand=sh(new THREE.Mesh(new THREE.SphereGeometry(.068,10,8),M.skin));
        hand.scale.set(1,.75,.85); hand.position.y=-.66; ag.add(hand);
      });
      [lLG,rLG].forEach(lg=>{
        const thi=sh(ol(new THREE.Mesh(new THREE.CylinderGeometry(.1,.09,.38,12),M.jeans),.012));
        thi.position.y=-.19; lg.add(thi);
        lg.add(sh(CYL(.085,.075,.34,12,M.jeans,0,-.55,0)));
        const shoe=sh(ol(new THREE.Mesh(new THREE.BoxGeometry(.15,.08,.24),M.shoe),.015));
        shoe.position.set(0,-.76,.03); lg.add(shoe);
      });
      ahmed.position.set(1.5,0,0.5);
      ahmed.rotation.y=-0.6;

      /* ── Speech bubble ── */
      let bTO: ReturnType<typeof setTimeout> | null = null;
      function showBubble(txt: string, dur=2500) {
        if (!bubEl) return;
        bubEl.textContent=txt; bubEl.style.opacity="1";
        if (bTO) clearTimeout(bTO);
        bTO=setTimeout(()=>{ if(bubEl) bubEl.style.opacity="0"; },dur);
      }
      function updateBubble() {
        if (!bubEl || !canvas) return;
        const p=new THREE.Vector3();
        ahmed.getWorldPosition(p); p.y+=1.9; p.project(cam);
        const r=canvas.getBoundingClientRect();
        bubEl.style.left=((p.x*.5+.5)*r.width+r.left-14)+"px";
        bubEl.style.top =((-p.y*.5+.5)*r.height+r.top-18)+"px";
      }

      /* ── Ahmed AI ── */
      const DESTS=[
        {p:new THREE.Vector3(-2.5,0,0.5), b:"🎮 بلاي استيشن!"},
        {p:new THREE.Vector3(-0.2,0,-RD/2+2.2), b:"💻 يله نشتغل"},
        {p:new THREE.Vector3(1.5,0,0.8), b:"😴 خمس دقايق..."},
        {p:new THREE.Vector3(-1.0,0,1.2), b:"📱"},
      ];
      let dI=0, dTimer=0, aState="idle";
      let grabbingAhmed=false, dragAhmed=false;
      const tPos=new THREE.Vector3(1.5,0,0.5);
      let AT=0;

      function updateAhmed() {
        if(grabbingAhmed) return;
        dTimer++;
        if(aState==="idle"&&dTimer>100){
          const d=DESTS[dI%DESTS.length]; tPos.copy(d.p);
          aState="walking"; dTimer=0; showBubble(d.b,2000);
        }
        if(aState==="walking"){
          const dx=tPos.x-ahmed.position.x, dz=tPos.z-ahmed.position.z;
          const dist=Math.sqrt(dx*dx+dz*dz);
          if(dist>.06){ ahmed.position.x+=dx/dist*.025; ahmed.position.z+=dz/dist*.025;
            ahmed.rotation.y=Math.atan2(dx,dz)*.12+ahmed.rotation.y*.88; }
          else{ ahmed.position.copy(tPos); aState="idle"; dTimer=0; dI=(dI+1)%DESTS.length; }
        }
        const wk=aState==="walking"; const ws=wk?10:0,wa=wk?.3:0;
        lLG.rotation.x=Math.sin(AT*ws)*wa; rLG.rotation.x=-Math.sin(AT*ws)*wa;
        lAG.rotation.x=-Math.sin(AT*ws)*wa*.5; rAG.rotation.x=Math.sin(AT*ws)*wa*.5;
        bodyG2.position.y=wk?Math.abs(Math.sin(AT*ws))*.045:Math.sin(AT*1.8)*.012;
        if(!wk){headG2.rotation.z=Math.sin(AT*.9)*.06; headG2.rotation.y=Math.sin(AT*.6)*.08;}
        else{headG2.rotation.z*=.9; headG2.rotation.y*=.9;}
      }

      /* ── Camera update ── */
      function updateCamera() {
        camState.yaw  +=(camState.targetYaw  -camState.yaw  )*.08;
        camState.pitch+=(camState.targetPitch-camState.pitch)*.08;
        camState.posX +=(camState.targetX    -camState.posX )*.06;
        camState.posZ +=(camState.targetZ    -camState.posZ )*.06;
        cam.position.set(camState.posX,camState.posY,camState.posZ);
        cam.rotation.order="YXZ";
        cam.rotation.y=camState.yaw;
        cam.rotation.x=camState.pitch;
      }

      /* ── Main loop ── */
      const clk=new THREE.Clock();
      let animId: number;
      function animate() {
        animId=requestAnimationFrame(animate);
        const t=clk.getElapsedTime(); AT=t;
        updateCamera(); updateAhmed(); updateBubble();
        pendantLight.intensity=3.2+Math.sin(t*2.1)*.08+Math.sin(t*4.7)*.04;
        lampPt.intensity=1.3+Math.sin(t*3.1)*.06+Math.sin(t*7.3)*.03;
        monGlow.intensity=0.35+Math.sin(t*.5)*.08;
        stPts.forEach(p=>{
          const d=p.userData;
          const age=((t*d.sp+d.ph)%(Math.PI*2))/(Math.PI*2);
          p.position.set(d.ox+Math.sin(t*2+d.ph)*.018,d.oy+age*.4,d.oz+Math.cos(t*1.5+d.ph)*.014);
          (p.material as THREE.MeshBasicMaterial).opacity=.22*(1-age)*(1-age);
          p.scale.setScalar(1+age*2);
        });
        renderer.render(scene,cam);
      }
      animate();
      showBubble("👋 أهلاً! أنا أحمد",2500);

      return () => {
        cancelAnimationFrame(animId);
        if (canvas) {
          canvas.removeEventListener("mousedown", onMouseDown);
          canvas.removeEventListener("wheel", onWheel as EventListener);
        }
        window.removeEventListener("mousemove",onMouseMove);
        window.removeEventListener("mouseup",onMouseUp);
        window.removeEventListener("resize",onResize);
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
    <section
      ref={sectionRef}
      id="ahmed-room"
      style={{ position:"relative", width:"100%", height:"100vh", background:"#080812", overflow:"hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{ width:"100%", height:"100%", display:"block" }}
      />

      {/* Text overlay */}
      <div style={{
        position:"absolute", top:0, left:0, right:0,
        display:"flex", flexDirection:"column", alignItems:"center",
        paddingTop:"22px", pointerEvents:"none", zIndex:10,
      }}>
        <div style={{
          fontFamily:"'Epilogue', Georgia, serif",
          fontSize:"clamp(13px, 1.8vw, 17px)",
          color:"rgba(255,252,245,0.92)",
          textAlign:"center", direction:"rtl", lineHeight:1.8,
          textShadow:"0 2px 20px rgba(0,0,0,0.8)",
          padding:"10px 20px", maxWidth:"520px",
          background:"rgba(0,0,0,0.22)",
          borderRadius:"12px",
          backdropFilter:"blur(8px)",
        }}>
          وصلت هنا؟ خلّي بالك من{" "}
          <span style={{ color:"#f59e0b", fontWeight:"bold" }}>أحمد</span>
          <br />
          لحتى أجهّزلك كوب القهوة الخاص بك ☕
        </div>
        <div style={{
          marginTop:"8px", fontSize:"10px",
          color:"rgba(255,255,255,0.22)",
          letterSpacing:"0.18em", textTransform:"uppercase",
          fontFamily:"'DM Mono', monospace",
        }}>
          drag to look around · scroll to move · click ahmed to grab him
        </div>
      </div>

      {/* Speech bubble */}
      <div
        ref={bubbleRef}
        style={{
          position:"absolute", left:0, top:0,
          background:"#fff",
          borderRadius:"14px 14px 14px 3px",
          padding:"8px 14px", fontSize:"15px",
          boxShadow:"0 6px 24px rgba(0,0,0,0.3)",
          pointerEvents:"none", zIndex:20,
          opacity:0, transition:"opacity 0.4s",
          whiteSpace:"nowrap", fontFamily:"sans-serif",
          direction:"rtl",
        }}
      />
    </section>
  );
}
