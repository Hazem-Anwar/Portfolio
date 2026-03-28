"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function StatementSection({ 
  number, 
  title, 
  text, 
  isEditing = false,
  animate3D = false
}: { 
  number: string, 
  title: string, 
  text: string, 
  isEditing?: boolean,
  animate3D?: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      if (!textContainerRef.current || !sectionRef.current) return;
      const words = textContainerRef.current.querySelectorAll('.word');
      
      // 1. Inverse 3D Entrance (straighten out from Hero's final position as it slides UP)
      if (artboardRef.current && animate3D) {
        gsap.fromTo(artboardRef.current, 
          {
            rotationX: 38.9669,
            rotationZ: -8.6593,
            rotationY: 0,
            scale: 0.6536,
            yPercent: 12.989, // comes up relative to perspective center
            opacity: 0,       // Starts completely dark
            borderRadius: "40px",
            borderColor: "rgba(255,255,255,0.15)",
            boxShadow: "0 0 100px rgba(0,0,0,1)",
          }, 
          {
            rotationX: 0,
            rotationZ: 0,
            rotationY: 0,
            scale: 1,
            yPercent: 0,
            opacity: 1,       // Illuminates precisely as it straightens out!
            borderRadius: "0px",
            borderColor: "transparent",
            boxShadow: "none",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom", // Starts when section touches bottom of screen
              end: "top top",      // Finishes exactly when section reaches top
              scrub: true,
            }
          }
        );
      } else if (artboardRef.current) {
        // Flat continuation layer
        gsap.set(artboardRef.current, { opacity: 1, scale: 1 });
      }

      // Scrub word-by-word highlight
      gsap.to(words, {
        opacity: 1,
        color: "#ffffff",
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "+=80%",      // Pin for 80% viewport height
          pin: true,         // Lock screen in place
          scrub: 1,          // Smooth scrubbing
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full h-screen z-10 relative overflow-hidden" style={{ transform: "translateZ(0)" }}>
      <div 
        className="w-full h-full overflow-hidden flex items-center justify-center"
        style={{ perspective: "2500px" }}
      >
        <div 
          ref={artboardRef} 
          className="w-[100vw] h-[100vh] bg-[#050505] flex flex-col items-center justify-center relative origin-center border-[0.5px] border-transparent rounded-none will-change-transform overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]" 
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="container-custom max-w-5xl relative w-full px-6">
            <div className="relative flex flex-col items-center">
              
              {/* Index Number */}
          <div className="text-[rgba(228,254,154,1)] font-mono text-[10px] md:text-sm mb-12 tracking-[0.2em]">
            {number}
          </div>
          
          {/* The Statement Box */}
          <div className={`relative p-4 md:p-8 ${isEditing ? 'border border-[#a855f7]/70' : 'border border-transparent'}`}>
            
            {/* Top Left Badge */}
            {isEditing && (
              <div className="absolute -top-7 -left-[1px] bg-[#a855f7] text-white font-mono text-[10px] font-bold px-2 py-1 shadow-sm whitespace-nowrap flex items-center gap-2">
                {title}
              </div>
            )}
            
            {/* The Text */}
            <h2 ref={textContainerRef} className="text-3xl md:text-5xl lg:text-7xl font-display font-medium leading-[1.2] md:leading-[1.15] tracking-tight text-center md:text-left">
              {text.split('\n').map((line, i) => (
                <span key={i} className="block relative">
                  {line.split(' ').map((word, j) => (
                    <span key={j} className="inline-block whitespace-nowrap">
                      <span className="word opacity-20 text-[#a1a1aa] inline-block transition-colors">{word}</span>
                      <span className="inline-block w-[0.25em]" />
                    </span>
                  ))}
                  {isEditing && i === text.split('\n').length - 1 && (
                    <span className="inline-block w-[3px] h-[0.8em] bg-white translate-y-[2px] ml-1 animate-pulse" />
                  )}
                </span>
              ))}
            </h2>
            
            {/* Fake Cursor (Editing) */}
            {isEditing && (
              <div className="absolute -bottom-8 right-0 md:-right-8 flex items-start z-20 pointer-events-none">
                <svg width="22" height="22" viewBox="0 0 24 24" className="drop-shadow-lg z-10 mr-[-5px] transform rotate-[-25deg]">
                  <path d="M5 3L19 10L12.5 13.5L9 20L5 3Z" fill="#a855f7" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                <div className="bg-[#1a1a1a] border border-white/10 text-white px-3 py-1.5 text-[10px] font-mono rounded shadow-xl whitespace-nowrap mt-4 flex items-center gap-1.5">
                  <span className="opacity-70">content</span> 
                  <span className="text-[#a855f7]">→</span> 
                  <span>editing...</span>
                </div>
              </div>
            )}
            
            {/* Figma Corners (Only when editing) */}
            {isEditing && (
              <>
                <div className="absolute -top-1 -left-1 w-2 h-2 border border-[#a855f7] bg-white" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border border-[#a855f7] bg-white" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-[#a855f7] bg-white" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border border-[#a855f7] bg-white" />
              </>
            )}

            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
