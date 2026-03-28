"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

let sharedAudioCtx: AudioContext | null = null;
const getAudioCtx = () => {
  if (typeof window === "undefined") return null;
  if (!sharedAudioCtx) {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) sharedAudioCtx = new AC();
    } catch (e) {}
  }
  // Try to wake it up if it's suspended (e.g. before user interaction)
  if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
};

const FigmaBox = ({ label, className }: { label: string, className?: string }) => (
  <div className={`absolute inset-0 border border-[#a855f7] pointer-events-none opacity-0 figma-demo-box z-40 ${className || ''}`}>
    {/* Corners */}
    <div className="absolute -top-[3px] -left-[3px] w-1.5 h-1.5 bg-white border border-[#a855f7] rounded-[1px]" />
    <div className="absolute -top-[3px] -right-[3px] w-1.5 h-1.5 bg-white border border-[#a855f7] rounded-[1px]" />
    <div className="absolute -bottom-[3px] -left-[3px] w-1.5 h-1.5 bg-white border border-[#a855f7] rounded-[1px]" />
    <div className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 bg-white border border-[#a855f7] rounded-[1px]" />
    {/* Label */}
    <div className="absolute -top-[18px] left-[-1px] bg-[#a855f7] text-[#111111] text-[9px] font-bold font-sans px-1.5 py-[2px] rounded-sm tracking-wider whitespace-nowrap shadow-sm leading-none">
      {label}
    </div>
  </div>
);

export default function HeroV2({ isLoaded = true }: { isLoaded?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const eyeRef = useRef<HTMLSpanElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag State logic via Refs and GSAP for 60fps
  const draggableRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  
  // Soft click/pop when returning
  const playPopSound = () => {
    try {
      const ctx = getAudioCtx();
      if (!ctx || ctx.state !== "running") return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Soft, pleasant and deep "thump/pop"
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15); 
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch(e) {}
  };
  
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [dragCount, setDragCount] = useState(0);
  const [typewriter, setTypewriter] = useState("");

  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);

  // Canvas Grid Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    
    const setSize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      
      const gridSize = 60;
      
      ctx.beginPath();
      const offsetX = (w / 2) % gridSize;
      for (let x = offsetX; x <= w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let x = offsetX - gridSize; x >= 0; x -= gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      
      const offsetY = (h / 2) % gridSize;
      for (let y = offsetY; y <= h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      for (let y = offsetY - gridSize; y >= 0; y -= gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    };

    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []);

  // Intro Animations
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ 
        delay: 0.1, // Tiny delay just to ensure the DOM is painted after opacity transition
        onComplete: () => {
          const masks = document.querySelectorAll(".mask-wrap");
          masks.forEach(m => (m as HTMLElement).style.overflow = "visible");
        }
      });

      // Scale out the entire section slightly for a cinematic reveal
      if (sectionRef.current) {
        gsap.fromTo(sectionRef.current, { scale: 1.05 }, { scale: 1, duration: 2.5, ease: "power3.out", delay: 0.1 });
      }

      // Background fade
      if (canvasRef.current) tl.to(canvasRef.current, { opacity: 0.8, duration: 2.5, ease: "power2.out" }, 0);
      
      // Eyebrow sliding up and letter-spacing expansion
      if (eyeRef.current) {
        gsap.set(eyeRef.current, { y: 20, opacity: 0, letterSpacing: "1px" });
        tl.to(eyeRef.current, { opacity: 1, y: 0, letterSpacing: "4px", duration: 1.5, ease: "power3.out" }, 0.2);
      }
      
      // Main text elements slide up with a subtle rotation tilt
      if (text1Ref.current) {
        gsap.set(text1Ref.current, { y: "120%", rotationZ: 3 });
        tl.to(text1Ref.current, { y: "0%", rotationZ: 0, duration: 1.6, ease: "power4.out" }, 0.5);
      }
      
      if (text2Ref.current) {
        gsap.set(text2Ref.current, { y: "120%", rotationZ: -3 });
        tl.to(text2Ref.current, { y: "0%", rotationZ: 0, duration: 1.6, ease: "power4.out" }, 0.65);
      }
      
      // Subtitle slides in
      if (subRef.current) {
        gsap.set(subRef.current, { y: 15, opacity: 0 });
        tl.to(subRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 1.3);
      }

      // --- Figma Intro Tutorial Sequence ---
      const demoCursor = document.getElementById("demo-cursor");
      const demoMarquee = document.getElementById("demo-marquee");
      if (demoCursor && demoMarquee) {
        // Start almost immediately as the text elements finish snapping into place
        const dTl = gsap.timeline({ delay: 2.1 });
        
        // 1. Move to HAZEM
        dTl.fromTo(demoCursor, 
          { x: window.innerWidth / 2 + 300, y: window.innerHeight, opacity: 0 }, 
          { opacity: 1, duration: 0.5 }
        );
        dTl.to(demoCursor, {
          x: () => { const r = text1Ref.current?.getBoundingClientRect(); return r ? r.left + r.width/2 : 0; },
          y: () => { const r = text1Ref.current?.getBoundingClientRect(); return r ? r.top + r.height/2 : 0; },
          duration: 1.2, ease: "power3.inOut"
        });
        const box1 = text1Ref.current ? text1Ref.current.querySelector('.figma-demo-box') : null;
        if (box1 && draggableRef.current) {
          dTl.to(box1, { opacity: 1, duration: 0.1 });
          dTl.to(demoCursor, { scale: 0.85, duration: 0.1 }); // Mouse Down
          
          // Drag word slightly to showcase it's movable
          dTl.to([demoCursor, draggableRef.current], { x: "+=40", y: "-=20", duration: 0.4, ease: "power2.out" }, "+=0.1");
          // Return word
          dTl.to([demoCursor, draggableRef.current], { x: "-=40", y: "+=20", duration: 0.4, ease: "power2.inOut" }, "+=0.2");
          
          dTl.to(demoCursor, { scale: 1, duration: 0.1 }); // Mouse Up
          dTl.to(box1, { opacity: 0, duration: 0.2 });
        }

        // 2. Move to ANWAR
        dTl.to(demoCursor, {
          x: () => { const r = text2Ref.current?.getBoundingClientRect(); return r ? r.left + r.width/2 : 0; },
          y: () => { const r = text2Ref.current?.getBoundingClientRect(); return r ? r.top + r.height/2 : 0; },
          duration: 0.8, ease: "power2.inOut"
        });
        const box2 = text2Ref.current ? text2Ref.current.querySelector('.figma-demo-box') : null;
        if (box2 && text2Ref.current) {
          dTl.to(box2, { opacity: 1, duration: 0.1 });
          dTl.to(demoCursor, { scale: 0.85, duration: 0.1 }); // Mouse Down
          
          // Color change effect indicating selection (stroke only)
          dTl.to(text2Ref.current, { WebkitTextStrokeColor: "rgba(228, 254, 154, 1)", duration: 0.2 }, "+=0.1");
          dTl.to(text2Ref.current, { WebkitTextStrokeColor: "rgba(255,255,255,0.7)", duration: 0.3 }, "+=0.6");
          
          dTl.to(demoCursor, { scale: 1, duration: 0.1 }); // Mouse Up
          dTl.to(box2, { opacity: 0, duration: 0.2 });
        }

        // 3. Move to Subtitle & Draw Marquee Selection Box
        dTl.to(demoCursor, {
          x: () => { const r = subRef.current?.getBoundingClientRect(); return r ? r.left - 30 : 0; },
          y: () => { const r = subRef.current?.getBoundingClientRect(); return r ? r.top - 30 : 0; },
          duration: 0.8, ease: "power2.inOut"
        });
        const box3 = subRef.current ? subRef.current.querySelector('.figma-demo-box') : null;
        if (box3) {
          dTl.to(demoCursor, { scale: 0.85, duration: 0.1 }); // Mouse Down
          
          dTl.set(demoMarquee, { 
            opacity: 1, width: 0, height: 0, 
            x: () => { const r = subRef.current?.getBoundingClientRect(); return r ? r.left - 30 : 0; },
            y: () => { const r = subRef.current?.getBoundingClientRect(); return r ? r.top - 30 : 0; }
          });

          // Drag to bottom-right
          dTl.to(demoCursor, {
            x: () => { const r = subRef.current?.getBoundingClientRect(); return r ? r.right + 30 : 0; },
            y: () => { const r = subRef.current?.getBoundingClientRect(); return r ? r.bottom + 30 : 0; },
            duration: 0.8, ease: "power3.inOut"
          }, "marqueeDrag");
          
          dTl.to(demoMarquee, {
            width: () => { const r = subRef.current?.getBoundingClientRect(); return r ? r.width + 60 : 0; },
            height: () => { const r = subRef.current?.getBoundingClientRect(); return r ? r.height + 60 : 0; },
            duration: 0.8, ease: "power3.inOut"
          }, "marqueeDrag");

          // Element becomes 'selected'
          dTl.to(box3, { opacity: 1, duration: 0.1 });
          dTl.to(demoCursor, { scale: 1, duration: 0.1 }); // Mouse Up
          dTl.to(demoMarquee, { opacity: 0, duration: 0.2 }, "+=0.2");
          
          dTl.to({}, { duration: 0.8 }); // Wait
          dTl.to(box3, { opacity: 0, duration: 0.2 });
        }

        // Finish and vanish
        dTl.to(demoCursor, { y: window.innerHeight + 100, opacity: 0, duration: 1, ease: "power3.inOut" });
      }

      // 3D Artboard Scroll
      if (sectionRef.current && artboardRef.current) {
        gsap.to(artboardRef.current, {
          rotationX: 38.9669,
          rotationZ: -8.6593,
          rotationY: 0,
          scale: 0.6536,
          yPercent: -12.989, // exact equivalent of translate(0%, -12.989%)
          opacity: 0,        // Ensures the hero beautifully fades off into the void
          borderRadius: "40px",
          borderColor: "rgba(255,255,255,0.15)", // standard subtle canvas edge
          boxShadow: "0 0 100px rgba(0,0,0,1)",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=120%",    // Animates symmetrically as the next block slides up over 100vh
            pin: true,
            pinSpacing: false, // Essential: The next section doesn't wait, it scrolls up in parallel!
            scrub: true,
          }
        });
      }

      // Parallax
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            const wrap = sectionRef.current?.querySelector(".hero-ic-wrap");
            if (wrap) gsap.set(wrap, { y: p * 150, opacity: Math.max(0, 1 - p * 1.5) });
            if (canvasRef.current) gsap.set(canvasRef.current, { opacity: 0.8 * Math.max(0, 1 - p * 2), y: p * 50 });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    setShowChat(false);
    
    // Kill any active return animation to avoid conflicts
    if (draggableRef.current) {
      gsap.killTweensOf(draggableRef.current);
    }
    
    // Show badge only on drag
    if (badgeRef.current) {
      gsap.to(badgeRef.current, { opacity: 1, duration: 0.2 });
    }
    
    startX.current = e.clientX - currentX.current;
    startY.current = e.clientY - currentY.current;
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;
      currentX.current = dx;
      currentY.current = dy;

      if (draggableRef.current) gsap.set(draggableRef.current, { x: dx, y: dy });
      
      // Update Pixel Badge
      if (badgeRef.current) {
        const dxSpan = badgeRef.current.querySelector('.dx-val');
        const dySpan = badgeRef.current.querySelector('.dy-val');
        if (dxSpan) dxSpan.textContent = Math.round(dx).toString();
        if (dySpan) dySpan.textContent = Math.round(dy).toString();
      }

      if (lineRef.current) {
        lineRef.current.setAttribute("x2", `calc(50% + ${dx}px)`);
        lineRef.current.setAttribute("y2", `calc(50% + ${dy}px)`);
      }
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      if (badgeRef.current) {
        gsap.to(badgeRef.current, { opacity: 0, duration: 0.3 });
      }

      // Smooth return to center
      if (draggableRef.current) {
        gsap.to(draggableRef.current, {
          x: 0,
          y: 0,
          delay: 0.6,
          duration: 0.7,
          ease: "back.out(1.2)",
          onUpdate: () => {
            currentX.current = gsap.getProperty(draggableRef.current, "x") as number;
            currentY.current = gsap.getProperty(draggableRef.current, "y") as number;
          },
          onComplete: () => {
            playPopSound();
            setDragCount(c => c + 1);
            setShowChat(true);
          }
        });
      }
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  // Typewriter effect for Chat Bubble
  useEffect(() => {
    if (showChat) {
      const messages = [
        "Whoa, where are you taking me?",
        "Again? We just fixed this.",
        "Okay, very funny. Put me down.",
        "Are you seriously still doing this?",
        "I'm getting dizzy! Stop it!"
      ];
      // fallback to message[0] if logic fails, though (dragCount - 1) % 5 handles it perfectly.
      const rawCount = Math.max(0, dragCount - 1);
      const messageToType = messages[rawCount % messages.length];
      
      let audioCtx: AudioContext | null = null;
      try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        if (AC) audioCtx = new AC();
      } catch (e) {}
      
      let i = 0;
      setTypewriter("");
      const interval = setInterval(() => {
        setTypewriter(messageToType.slice(0, i + 1));
        
        // Play typing sound
        if (audioCtx && audioCtx.state === "running") {
          try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            // Randomize frequency slightly for a soft tick sound
            osc.frequency.setValueAtTime(600 + Math.random() * 300, audioCtx.currentTime);
            
            // sharp attack and decay
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.03);
          } catch(e) {}
        }
        
        i++;
        if (i >= messageToType.length) {
          clearInterval(interval);
          // Hide message after 3 seconds
          setTimeout(() => {
            setShowChat(false);
          }, 3000);
        }
      }, 50); // Speed of typewriter
      return () => {
        clearInterval(interval);
        if (audioCtx) {
          audioCtx.close().catch(() => {});
        }
      };
    } else {
      setTypewriter("");
    }
  }, [showChat, dragCount]);

  return (
    <section ref={sectionRef} className="w-full relative h-screen bg-[#000000] z-0" style={{ transform: "translateZ(0)" }}>
      <div 
        className="w-full h-full overflow-hidden flex items-center justify-center"
        style={{ perspective: "2500px" }}
      >
        <div ref={artboardRef} className="w-[100vw] h-[100vh] bg-[#050505] relative origin-center border-[0.5px] border-transparent rounded-none will-change-transform overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]" style={{ transformStyle: "preserve-3d" }}>
          {/* Fake Figma Marquee Selection */}
      <div
        id="demo-marquee"
        className="fixed top-0 left-0 pointer-events-none opacity-0 z-[99990] bg-[#a855f7]/20 border border-[#a855f7]"
        style={{ width: 0, height: 0 }}
      />
      {/* Fake Demo Cursor */}
      <div
        id="demo-cursor"
        className="fixed top-0 left-0 pointer-events-none opacity-0 flex flex-col items-start font-sans origin-top-left"
        style={{ zIndex: 999900 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="drop-shadow-md">
          <path d="M1 1L15 7L8.5 9.5L6 16L1 1Z" fill="#a855f7" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <div className="absolute top-[16px] left-[12px] bg-[#a855f7] text-white px-2 py-0.5 text-[10px] font-mono rounded-b-md rounded-tr-md shadow-md whitespace-nowrap border border-white/20">
          Hazem Anwar
        </div>
        <div className="absolute top-[34px] left-[12px] bg-[#111111] text-white/80 px-1.5 py-0.5 text-[9px] font-mono rounded shadow-lg whitespace-nowrap border border-white/5">
          <span className="text-white/50">tracking → </span>-0.05em
        </div>
      </div>

      <canvas ref={canvasRef} className="hero-canvas-grid absolute inset-0 z-0 pointer-events-none opacity-0 w-full h-full" />
      
      <div className="hero-ic relative z-10 min-h-screen flex flex-col items-center justify-center select-none">
        <div className="hero-ic-wrap w-full px-4 text-center">
          <span ref={eyeRef} className="hero-ic-eye font-mono text-[12px] font-bold tracking-[4px] uppercase text-[rgba(240,240,235,0.5)] mb-6 block opacity-0 pointer-events-none">
            DESIGN STRUCTURE, ENGINEER INTENTION

          </span>
          
          <div className="flex flex-col justify-center items-center pointer-events-none">
            {/* FIRST WORD WITH DRAG LOGIC */}
            <div className="mask-wrap inline-block overflow-hidden py-1 px-5 pointer-events-auto leading-none relative z-50">
              <div ref={text1Ref} className="drag-text relative translate-y-[120%]">
                
                {/* Visual Connector Line */}
                {isDragging && (
                  <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none" style={{ zIndex: -1 }}>
                    <line 
                      ref={lineRef}
                      x1="50%" y1="50%" 
                      x2="50%" y2="50%" 
                      stroke="#ff0055" strokeWidth="2" strokeDasharray="6 6" 
                    />
                  </svg>
                )}
                
                {/* The Draggable Inner Content */}
                <div 
                  ref={draggableRef}
                  className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} w-full h-full border border-dashed border-[rgba(255,255,255,0.3)]`}
                  onPointerDown={handlePointerDown}
                  onPointerEnter={() => setIsHovered(true)}
                  onPointerLeave={() => setIsHovered(false)}
                >
                  <FigmaBox label="h1 / First Name" />

                  {/* DRAG TO MOVE (Static) */}
                  <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-mono font-bold px-2 py-0.5 shadow-md whitespace-nowrap z-20 pointer-events-none tracking-widest border border-black/10">
                    DRAG TO MOVE
                  </div>

                  {/* Pixel Coordination Badge (DX / DY) */}
                  <div 
                    ref={badgeRef}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#111111] text-white/90 font-mono text-[11px] px-1.5 py-0.5 rounded shadow-xl border border-white/5 opacity-0 z-50 pointer-events-none whitespace-nowrap"
                  >
                    DX: <span className="dx-val text-[#a855f7]">0</span> DY: <span className="dy-val text-[#a855f7]">0</span>
                  </div>
                  
                  HAZEM

                  {/* Figma Comment Bubble */}
                  {showChat && !isDragging && (
                    <div className="absolute top-full left-1/2 -translate-x-6 mt-4 pointer-events-none z-50 flex flex-row items-start font-sans">
                      {/* Purple Cursor */}
                      <svg width="20" height="20" viewBox="0 0 24 24" className="drop-shadow-md z-10 mt-1 mr-[-6px]">
                        <path d="M5 3L19 10L12.5 13.5L9 20L5 3Z" fill="#a855f7" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                      </svg>
                      {/* Bubble content */}
                      <div className="flex flex-col text-left mt-4" style={{ filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.4))" }}>
                        <div className="bg-[#d8b4fe] text-black px-2 py-0.5 text-[10px] font-sans rounded-t-md w-max font-semibold border border-b-0 border-[#c084fc]/30">
                          Hazem Anwar
                        </div>
                        <div className="bg-[#c084fc] text-black font-medium sm:font-semibold px-3 py-2 text-[14px] rounded-b-md rounded-tr-md shadow-lg tracking-wide min-h-[32px] flex items-center border border-[#c084fc]">
                          {typewriter}
                          <span className="w-[1.5px] h-3.5 bg-black ml-1 inline-block animate-pulse align-middle" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
            
            <div className="mask-wrap inline-block overflow-hidden py-1 px-5" style={{ marginTop: '20px' }}>
              <div 
                ref={text2Ref} 
                className="drag-text translate-y-[120%] relative"
                style={{ WebkitTextStroke: "2px rgba(255,255,255,0.7)", color: "transparent" }}
              >
                ANWAR
                <FigmaBox label="h1 / Last Name" />
              </div>
            </div>
          </div>
          
          <div className="w-full flex justify-center mt-6">
            <div ref={subRef} className="hero-ic-sub inline-flex items-center text-[1.6rem] text-[rgba(240,240,235,0.5)] opacity-0 pointer-events-none relative">
              <FigmaBox label="p / Precision structure, bold creative vision." className="-m-2" />
              <em>Precision structure, bold creative vision.</em> <span className="ghost-cursor w-[1.5px] h-[0.85em] bg-[rgba(240,240,235,0.5)] ml-[2px] align-middle" style={{ animation: 'ic-blink 1s infinite' }} />
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </section>
  );
}
