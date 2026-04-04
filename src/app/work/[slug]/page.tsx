"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/all";
import { cases } from "@/data/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);
}

export default function CaseStudy({ params }: { params: { slug: string } }) {
  const c = cases.find((item) => item.slug === params.slug);
  if (!c) notFound();

  // Gallery Data
  const allProjectImages = [c.image, ...(c.images || [])].filter((img): img is string => !!img);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, { type: "lines" });
      gsap.fromTo(split.lines, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1,
      });
    }
  }, []);

  useEffect(() => {
    if (selectedIndex !== null && sliderRef.current) {
      gsap.to(sliderRef.current, { x: -selectedIndex * 100 + "%", duration: 0.6, ease: "power2.out" });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== null && sliderRef.current) {
      const d = Draggable.create(sliderRef.current, {
        type: "x",
        onDragEnd: function() {
          const threshold = window.innerWidth / 4;
          const diff = this.x - (-selectedIndex * window.innerWidth);
          if (diff > threshold) setSelectedIndex((p) => (p! > 0 ? p! - 1 : allProjectImages.length - 1));
          else if (diff < -threshold) setSelectedIndex((p) => (p! < allProjectImages.length - 1 ? p! + 1 : 0));
          else gsap.to(sliderRef.current, { x: -selectedIndex! * 100 + "%", duration: 0.4 });
        }
      });
      return () => { if(d[0]) d[0].kill(); };
    }
  }, [selectedIndex, allProjectImages.length]);

  useEffect(() => {
    if (selectedIndex !== null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowLeft") setSelectedIndex(p => p! > 0 ? p! - 1 : allProjectImages.length - 1);
      if (e.key === "ArrowRight") setSelectedIndex(p => p! < allProjectImages.length - 1 ? p! + 1 : 0);
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, allProjectImages.length]);

  return (
    <main className="bg-white min-h-screen font-inter text-[#111] selection:bg-[#111] selection:text-white pb-32 relative">
      
      {/* FIXED BACK BUTTON */}
      <div className="fixed top-12 left-12 z-[1000]">
        <Link 
          href="/work" 
          className="w-12 h-12 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] flex items-center justify-center transition-colors shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
             <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      <div className="max-w-[720px] mx-auto px-6 space-y-12">
        
        {/* HEADER */}
        <section className="pt-40 space-y-4">
           <h1 ref={titleRef} className="text-[32px] font-extrabold leading-[1.1] tracking-tight uppercase">{c.title}</h1>
           <div className="text-[16px] text-[#555] leading-[1.6] space-y-6">
             <p>{c.description}</p>
             {c.link && (
               <a 
                 href={c.link} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111] text-white text-[14px] font-bold hover:bg-[#333] transition-colors"
               >
                 <span>Visit Live Website</span>
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                 </svg>
               </a>
             )}
           </div>
        </section>

        {/* REARRANGED CORE STORYTELLING (Strict Image -> Text Rhythm) */}
        <section className="space-y-12">
           
           {/* IMAGE 01: HERO COVER */}
           <div onClick={() => setSelectedIndex(0)} className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#f7f7f7] cursor-zoom-in group border border-black/5">
              <Image src={c.image || ""} alt={c.title} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-700" priority />
           </div>

           {/* TEXT 01: RESEARCH */}
           <div className="space-y-2">
              <h2 className="text-[16px] font-bold uppercase tracking-wider">Research & Discovery</h2>
              <div className="text-[16px] text-[#555] leading-[1.8] space-y-4">
                 <p>{c.approach}</p>
              </div>
           </div>

           {/* IMAGE 02: ARCHITECTURE VIEW */}
           {c.images?.[1] && (
              <div onClick={() => setSelectedIndex(1)} className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#fafafa] cursor-zoom-in border border-black/5">
                 <Image src={c.images?.[1]} alt="Architecture" fill className="object-cover" />
              </div>
           )}

           {/* TEXT 02: THE CHALLENGE */}
           <div className="space-y-2">
              <h2 className="text-[16px] font-bold uppercase tracking-wider">The Problem</h2>
              <div className="text-[16px] text-[#555] leading-[1.8]">
                 <p>{c.problem}</p>
              </div>
           </div>

           {/* IMAGE 03: PROBLEM GRID */}
           <div className="grid grid-cols-2 gap-4">
              <div onClick={() => setSelectedIndex(2)} className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#f7f7f7] cursor-zoom-in border border-black/5">
                 <Image src={c.images?.[2] || c.image} alt="Detail A" fill className="object-cover" />
              </div>
              <div onClick={() => setSelectedIndex(3)} className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#f7f7f7] cursor-zoom-in border border-black/5">
                 <Image src={c.images?.[3] || c.image} alt="Detail B" fill className="object-cover" />
              </div>
           </div>

           {/* TEXT 03: ARCHITECTURE LOGIC */}
           <div className="space-y-2">
              <h2 className="text-[16px] font-bold uppercase tracking-wider">Product Architecture</h2>
              <div className="text-[16px] text-[#555] leading-[1.8]">
                 <p>{c.architecture}</p>
              </div>
           </div>

           {/* BLOCK: DESIGN SYSTEM (Restored Card Mode) */}
           <div className="bg-[#f9f9f9] p-8 md:p-14 rounded-2xl space-y-12 border border-black/5">
              <div className="space-y-4">
                 <h2 className="text-[16px] font-bold uppercase tracking-wider text-[#111]">Design System.</h2>
                 <p className="text-[16px] text-[#555] leading-relaxed">{(c as any).designSystem || 'Standard layout'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <span className="text-[11px] font-bold uppercase text-[#aaa] tracking-[0.2em] block">Typography Scale</span>
                    <div className="space-y-4">
                       <div className="text-[28px] font-black leading-none uppercase">Headline Bold</div>
                       <div className="text-[20px] font-bold leading-none capitalize">Subhead Regular</div>
                       <div className="text-[16px] font-medium leading-none">Body Sans Serif</div>
                    </div>
                 </div>
                 <div className="flex flex-col justify-end">
                    <div className="text-[64px] font-black leading-none tracking-tighter">Aa.</div>
                    <span className="text-[11px] text-[#aaa] font-mono mt-4 uppercase tracking-widest uppercase tracking-widest">Inter System</span>
                 </div>
              </div>
              <div className="pt-10 border-t border-black/5 space-y-6">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                       { hex: "#111111", name: 'Primary' },
                       { hex: "#333333", name: 'Secondary' },
                       { hex: "#888888", name: 'Muted' },
                       { hex: "#E5E5E5", name: 'Surface' }
                    ].map((col, i) => (
                       <div key={i} className="space-y-3">
                          <div className="aspect-square rounded-lg border border-black/5 shadow-sm" style={{ background: col.hex }} />
                          <div className="space-y-1">
                             <span className="block text-[11px] font-bold uppercase">{col.name}</span>
                             <span className="block text-[10px] font-mono text-[#aaa]">{col.hex}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* IMAGE 04: PROTOTYPING VIEW */}
           <div onClick={() => setSelectedIndex(2)} className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#fafafa] cursor-zoom-in border border-black/5">
              <Image src={c.images?.[2] || c.image} alt="Prototyping" fill className="object-cover" />
           </div>

           {/* TEXT 04: PROTOTYPING NARRATIVE */}
           <div className="space-y-2">
              <h2 className="text-[16px] font-bold uppercase tracking-wider text-[#111]">Interactive Prototyping</h2>
              <div className="text-[16px] text-[#555] leading-[1.8]">
                 <p>{(c as any).prototyping || 'Prototyping essential user paths.'}</p>
              </div>
           </div>

           {/* IMAGE 05: TESTING VIEW */}
           <div onClick={() => setSelectedIndex(3)} className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#fafafa] cursor-zoom-in border border-black/5">
              <Image src={c.images?.[3] || c.image} alt="Testing" fill className="object-cover" />
           </div>

           {/* TEXT 05: TESTING NARRATIVE */}
           <div className="space-y-2">
              <h2 className="text-[16px] font-bold uppercase tracking-wider text-[#111]">Refined Quality & Testing</h2>
              <div className="text-[16px] text-[#555] leading-[1.8]">
                 <p>{(c as any).testing || 'Rigorous QA cycles for cross-platform fidelity.'}</p>
              </div>
           </div>

           {/* METRICS SECTION */}
           <div className="space-y-12">
              <div className="space-y-2">
                 <h2 className="text-[16px] font-bold uppercase tracking-wider">Business Impact</h2>
                 <div className="text-[16px] text-[#555] leading-[1.8] space-y-4">
                    <p>The operational metrics following the implementation showed a significant improvement in efficiency and user satisfaction.</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {c.stats.map((stat, i) => (
                    <div key={i} className="bg-[#f9f9f9] p-8 md:p-12 rounded-2xl space-y-4 border border-black/5">
                       <div className="text-[32px] md:text-[42px] font-extrabold text-[#111] leading-none tracking-tight">{stat.value}</div>
                       <div className="text-[14px] text-[#555] leading-relaxed max-w-[200px]">{stat.label}</div>
                    </div>
                 ))}
              </div>
           </div>

           {/* CONCLUSION */}
           <div className="space-y-2">
              <h2 className="text-[16px] font-bold uppercase tracking-wider">Conclusion</h2>
              <div className="text-[16px] text-[#555] leading-[1.8]">
                 <p>{c.outcome}</p>
              </div>
           </div>

        </section>

        {/* CTA FOOTER */}
        <section className="pt-24 pb-12 border-t border-black/5 flex flex-col items-center">
           <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#aaa] mb-10">Case Study Complete</span>
           <Link href="/work" className="group flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-[#111] group-hover:border-[#111] transition-all duration-500">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-white transition-colors">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                 </svg>
              </div>
              <span className="text-[16px] font-bold tracking-tight uppercase">Return to Collection</span>
           </Link>
        </section>
      </div>

      {/* GALLERY LIGHTBOX */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[2000] bg-white/95 backdrop-blur-2xl flex flex-col overflow-hidden select-none" onClick={() => setSelectedIndex(null)}>
          <div className="flex justify-between items-center p-8 md:p-12 z-50">
             <div className="font-mono text-[11px] tracking-widest text-[#aaa] uppercase">{selectedIndex + 1} / {allProjectImages.length}</div>
             <button className="text-black hover:opacity-50 transition-all p-2" onClick={() => setSelectedIndex(null)}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
             </button>
          </div>
          <div className="flex-1 relative flex items-center justify-start overflow-visible cursor-grab active:cursor-grabbing">
            <div ref={sliderRef} className="flex items-center absolute left-0 h-full w-full">
               {allProjectImages.map((img, i) => (
                  <div key={i} onClick={(e) => e.stopPropagation()} className={`relative flex-shrink-0 w-screen h-[70vh] flex items-center justify-center transition-opacity duration-500 ${selectedIndex === i ? "opacity-100" : "opacity-10"}`}>
                     <div className="relative w-[85vw] h-full pointer-events-none">
                        <Image src={img} alt={`Img ${i + 1}`} fill className="object-contain rounded-xl" priority />
                     </div>
                  </div>
               ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-8 md:p-12 z-50 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
             <div className="flex items-center gap-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#aaa]">Navigate</span>
                <div className="flex gap-2">
                   <button onClick={() => setSelectedIndex(p => p! > 0 ? p! - 1 : allProjectImages.length - 1)} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#111] hover:text-white transition-all">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                   </button>
                   <button onClick={() => setSelectedIndex(p => p! < allProjectImages.length - 1 ? p! + 1 : 0)} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#111] hover:text-white transition-all">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                   </button>
                </div>
             </div>
             <div className="hidden md:flex items-center gap-4 text-[#aaa] font-bold text-[11px] uppercase tracking-[0.2em]">
                <span>Exit full screen</span>
                <div className="px-3 py-1.5 border border-black/10 rounded-md text-[9px] font-mono uppercase">Esc</div>
             </div>
          </div>
        </div>
      )}
    </main>
  );
}
