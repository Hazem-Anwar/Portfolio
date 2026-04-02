"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import NavbarLight from "@/components/NavbarLight";
import LogoSlider from "@/components/LogoSlider";

function TypewriterText({ text, active }: { text: string; active: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  
  const type = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split("")
        .map((letter, index) => {
          if (index <= iteration) return text[index];
          return "";
        })
        .join("")
      );
      
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1;
    }, 35);
    return interval;
  }, [text]);

  useEffect(() => {
    if (active) {
      const interval = type();
      return () => clearInterval(interval);
    } else {
      setDisplayText(text);
    }
  }, [active, text, type]);

  return <>{displayText}</>;
}

function SignatureTypewriter({ text, delay = 0.5 }: { text: string; delay?: number }) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    
    const tl = gsap.timeline({ delay });

    // Smooth reveal using clipPath
    tl.fromTo(textRef.current, 
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: text.length * 0.05, ease: "none" }
    );
  }, [text, delay]);

  return (
    <span className="relative inline-flex items-center min-h-[1.2em]">
      <span className="relative">
        <span 
          ref={textRef} 
          className="relative block whitespace-nowrap pr-1"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          {text}
        </span>
      </span>
    </span>
  );
}

export default function HeroLight() {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const imgCardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const [isHoveredWork, setIsHoveredWork] = useState(false);
  const [isHoveredCV, setIsHoveredCV] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to("nav", { opacity: 1, y: 0, duration: 0.8, startAt: { y: -20 } }, 0.1);
    tl.to("#hero-signature", { opacity: 1, duration: 0.8 }, 0.4);
    tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20 } }, "-=0.6");
    tl.to(descRef.current, { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20 } }, "-=0.65");
    tl.to(skillsRef.current, { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20 } }, "-=0.7");
    tl.to(btnsRef.current, { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20 } }, "-=0.7");
    tl.to("#hero-logos", { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20 } }, "-=0.7");
    tl.to(imgCardRef.current, { opacity: 1, y: 0, duration: 0.9, startAt: { y: 40 } }, "-=0.8");
    tl.to(badgeRef.current, { opacity: 1, scale: 1, duration: 0.6, startAt: { scale: 0.5, rotation: 0 } }, "-=0.4");
    
    // Background Glow - Neutral Sequence
    tl.to("#glow-1", { opacity: 1, duration: 3, ease: "power2.out" }, 0.5);
  }, []);

  return (
    <>  
      <NavbarLight />

    <section ref={heroRef} className="w-full bg-[#fff] mt-20 lg:pt-6 flex flex-col font-inter selection:bg-[#ff4d00] selection:text-white overflow-hidden relative">
      {/* Neutral Smoky Ambient Glow - Refined Luxury Treatment */}
      <div className="absolute top-[-5%] left-[-10%] w-[450px] h-[450px] bg-[#0000001a] blur-[180px] rounded-full z-0 opacity-0 animate-[pulse_15s_ease-in-out_infinite] " style={{ animationDelay: '2s' }} id="glow-1" />
    
      <div className="container-custom pt-[80px] pb-40 flex-1 flex flex-col relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-14 lg:gap-16 items-center w-full">
          {/* Left Side Content - Now order-2 on mobile */}
          <div className="flex flex-col lg:pt-10 z-10 min-w-0 order-2 md:order-1">
            <h6 
              className="text-[#111] text-[22px] md:text-[26px] font-['Caveat'] font-bold tracking-normal opacity-0 -rotate-1"
              id="hero-signature"
            >
              <SignatureTypewriter text="Hazem Anwar" delay={0.7} />
            </h6>
            <h1 
              ref={headingRef}
              className="font-bricolage font-extrabold mt-4 text-[clamp(2.5rem,6vw,44px)] md:text-[clamp(1.8rem,4vw,44px)] lg:text-[48px] leading-[1.1] tracking-[-0.03em] text-[#111] opacity-0"
            >
              Design-Driven <br /> Front-End Engineer<span className="text-[#ff4d00]">.</span>
            </h1>
            
            <p 
              ref={descRef}
              className="mt-4 md:mt-6 text-[#888] leading-[1.6] mb-0 text-[14px] md:text-[15px] opacity-0 max-w-[450px]"
            >
              Front-end Engineer & UX/UI Designer crafting scalable, high-performance interfaces with a strong focus on UX, detail, and bridging design with development.            
            </p>
            
            <div ref={btnsRef} className="md:mt-8 mt-4 flex flex-row flex-wrap items-center gap-3 md:gap-4 opacity-0">
              <button 
                onMouseEnter={() => setIsHoveredWork(true)}
                onMouseLeave={() => setIsHoveredWork(false)}
                className="group bg-[#111] text-white px-5 md:px-8 py-3 rounded-full font-medium text-[11px] md:text-[14px] transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#222] text-left flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2 overflow-hidden"
              >
                <span className="min-w-[80px] md:min-w-[100px] inline-block transition-transform duration-300 group-hover:translate-x-[1px] text-center sm:text-left">
                  <TypewriterText text="View My Work" active={isHoveredWork} />
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-[45deg] group-hover:translate-x-[2px] hidden sm:block">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </button>
              <button 
                onMouseEnter={() => setIsHoveredCV(true)}
                onMouseLeave={() => setIsHoveredCV(false)}
                className="group bg-transparent text-[#111] px-5 md:px-8 py-3 rounded-full font-medium text-[11px] md:text-[14px] border border-[#ccc] hover:border-[#111] transition-all duration-300 uppercase tracking-wide text-left flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2 overflow-hidden whitespace-nowrap"
              >
                <span className="min-w-[80px] md:min-w-[100px] inline-block transition-transform duration-300 group-hover:translate-x-[1px] text-center sm:text-left">
                   Download CV
                </span>
                <div className="relative overflow-hidden w-[16px] h-[16px] hidden sm:block">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500 group-hover:translate-y-[20px]">
                    <path d="M12 3v13M7 11l5 5 5-5M5 21h14"></path>
                  </svg>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[-20px] left-0 transition-all duration-500 group-hover:translate-y-[20px]">
                    <path d="M12 3v13M7 11l5 5 5-5M5 21h14"></path>
                  </svg>
                </div>
              </button>
            </div>

            <div ref={skillsRef} className="mt-8 text-[13px] md:text-[15px] text-[#555] font-medium opacity-0">
              React • Next.js • UX/UI • Performance
            </div>
          </div>

          {/* Right Side Image - Now order-1 on mobile */}
          <div className="relative flex justify-center md:justify-end md:pe-10 mb-12 md:mb-0 lg:pt-10 w-full min-w-0 order-1 md:order-2 pt-12 md:pt-0">
             <div 
               ref={imgCardRef}
               className="w-[220px] h-[280px] md:w-[300px] md:h-[400px] aspect-[4/5] shadow-lg rounded-[24px] bg-[#eee] overflow-hidden relative opacity-0 hover:grayscale-0 transition-all duration-700 group will-change-transform"
             >
               <Image 
                 src="/images/about/SS.png" 
                 alt="Hazem Anwar Portrait" 
                 fill
                 className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
               />
             </div>
             
             {/* Floating Experience Badge */}
              <div 
                ref={badgeRef}
                className="absolute md:-bottom-6 -bottom-10 md:-right-6 right-2 md:w-[120px] md:h-[120px] w-[100px] h-[100px] bg-white rounded-full shadow-2xl flex items-center justify-center z-20 opacity-0 scale-50"
              >
                <svg className="absolute w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
                  <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                  <text className="text-[7.5px] font-bold uppercase tracking-[0.22em] fill-[#111]">
                    <textPath href="#circlePath" startOffset="0%">
                    FRONT-END ENGINEER ✧ PRODUCT DESIGNER ✧ 
                    </textPath>
                  </text>
                </svg>
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-[#111] leading-none">6+</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#666] mt-1">Years</span>
                </div>
              </div>
          </div>
        </div>
        <div className="mt-20">
           <LogoSlider />
        </div>
      </div>
    </section>
    </>
  );
}
