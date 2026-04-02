"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroV3({ isLoaded = true }: { isLoaded?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Headline stagger reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".hero3-word");
        gsap.set(words, { y: "110%", opacity: 0 });
        tl.to(words, {
          y: "0%",
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          stagger: 0.06,
        }, 0);
      }

      // Bio + buttons slide up
      if (bioRef.current) {
        gsap.set(bioRef.current, { y: 30, opacity: 0 });
        tl.to(bioRef.current, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.55);
      }
      if (buttonsRef.current) {
        gsap.set(buttonsRef.current, { y: 20, opacity: 0 });
        tl.to(buttonsRef.current, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.7);
      }

      // Photo scale in
      if (photoRef.current) {
        gsap.set(photoRef.current, { scale: 0.9, opacity: 0 });
        tl.to(photoRef.current, { scale: 1, opacity: 1, duration: 1.1, ease: "power3.out" }, 0.4);
      }

      // Badge pop in
      if (badgeRef.current) {
        gsap.set(badgeRef.current, { scale: 0.6, opacity: 0, rotate: -6 });
        tl.to(badgeRef.current, {
          scale: 1,
          opacity: 1,
          rotate: -6,
          duration: 0.7,
          ease: "back.out(1.8)",
        }, 0.9);
      }

      // Logos + tagline fade in
      if (taglineRef.current) {
        gsap.set(taglineRef.current, { opacity: 0, y: 10 });
        tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.0);
      }
      if (logosRef.current) {
        const logos = logosRef.current.querySelectorAll(".hero3-logo");
        gsap.set(logos, { opacity: 0, y: 12 });
        tl.to(logos, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 1.1);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded]);

  const logos = [
    "FIGMA", "REACT", "NEXT.JS", "VERCEL", "TYPESCRIPT"
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen text-[#f0f0ec] flex flex-col overflow-hidden container-custom"
      style={{ fontFamily: "var(--font-epilogue, 'Epilogue', sans-serif)" }}
    >
      {/* Main hero content */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-12 pt-10 pb-10">

        {/* Headline */}
        <div className="mb-10 md:mb-14 overflow-visible">
          <h1
            ref={headlineRef}
            className="hero3-headline font-black uppercase leading-[1.2] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 5.5rem)",   
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            }}
          >
            {/* Line 1: DESIGN-DRIVEN */}
            <div className="overflow-hidden block">
              <span className="hero3-word inline-block">DESIGN&shy;-&shy;</span>
              <span className="hero3-word inline-block text-[#4b4b4b]">DRIVEN</span>
              &nbsp;
              <span className="hero3-word inline-block">FRONTEND</span>
            </div>
            {/* Line 2: ENGINEER */}
            <div className="overflow-hidden block">
              <span className="hero3-word inline-block">ENGINEER</span>
            </div>
          </h1>
        </div>

        {/* Bottom row: Bio left / Photo right */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-12 md:gap-20">

          {/* Left: bio + stack + buttons */}
          <div className="flex-1 max-w-lg">
            <div ref={bioRef}>
              <p className="text-[0.95rem] leading-relaxed text-[#9a9a9a] mb-4 max-w-[420px]">
                Front-end Engineer &amp; UX/UI Designer focused on building
                high-performance, scalable digital products. Expert at
                translating complex concepts into clean, production-ready
                interfaces with a focus on UX and detail. Bridging the gap
                between design and development to ship refined, user-centered
                solutions at scale.
              </p>
              <p className="text-[0.85rem] text-[#6a6a6a] mb-8 tracking-wide">
                React&nbsp;•&nbsp;Next.js&nbsp;•&nbsp;UX/UI&nbsp;•&nbsp;Performance
              </p>
            </div>

            <div ref={buttonsRef} className="flex items-center gap-4 flex-wrap">
              <a
                href="#work"
                id="hero3-view-work-btn"
                className="hero3-btn-outline inline-flex items-center px-6 py-3 border border-[#3a3a3a] rounded-full text-[0.8rem] font-semibold tracking-widest uppercase text-[#f0f0ec] transition-all duration-300 hover:border-[#f0f0ec] hover:bg-[#f0f0ec]/5"
              >
                View Work
              </a>
              <a
                href="#contact"
                id="hero3-contact-btn"
                className="hero3-btn-filled inline-flex items-center px-7 py-3 rounded-full bg-[#1a1a1a] border border-transparent text-[0.8rem] font-bold tracking-widest uppercase text-[#f0f0ec] transition-all duration-300 hover:bg-[#2a2a2a]"
              >
                Send Me a Message
              </a>
            </div>
          </div>

          {/* Right: Photo + badge */}
          <div className="relative flex-shrink-0 self-center md:self-auto">
            <div
              ref={photoRef}
              className="relative w-[260px] md:w-[320px] aspect-[4/5] rounded-2xl overflow-hidden bg-[#1c1c1c]"
            >
              {/* Photo placeholder — using a gradient stand-in */}
              <div
                className="absolute inset-0 flex items-end justify-center"
                style={{
                  background: "linear-gradient(160deg, #2a2a2a 0%, #111 60%, #0d0d0d 100%)",
                }}
              >
                {/* Silhouette shape */}
                <svg
                  viewBox="0 0 320 400"
                  className="w-full h-full"
                  style={{ opacity: 0.9 }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Head */}
                  <ellipse cx="160" cy="130" rx="52" ry="58" fill="#3a3a3a" />
                  {/* Neck */}
                  <rect x="140" y="178" width="40" height="30" rx="4" fill="#3a3a3a" />
                  {/* Body/shoulders */}
                  <path
                    d="M60 400 C60 310, 110 260, 160 255 C210 260, 260 310, 260 400 Z"
                    fill="#333"
                  />
                  {/* Beard hint */}
                  <ellipse cx="160" cy="182" rx="30" ry="12" fill="#2e2e2e" />
                  {/* Arms crossed */}
                  <path
                    d="M70 310 Q90 290 130 295 Q160 300 160 300 Q160 300 190 295 Q230 290 250 310"
                    fill="none"
                    stroke="#3a3a3a"
                    strokeWidth="32"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Available for work badge */}
            <div
              ref={badgeRef}
              className="absolute -top-3 -right-5 bg-[#e84f2c] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-xl"
              style={{ rotate: "-6deg", transformOrigin: "center center" }}
            >
              Available for work
            </div>
          </div>
        </div>

        {/* Bottom: tagline + logos */}
        <div className="mt-14 pt-8 border-t border-[#1e1e1e]">
          <p
            ref={taglineRef}
            className="text-[0.75rem] text-[#4a4a4a] tracking-wide mb-5 uppercase"
          >
            Depended on by funded novices and tech giants alike
          </p>
          <div ref={logosRef} className="flex items-center gap-8 flex-wrap">
            {logos.map((logo) => (
              <span
                key={logo}
                className="hero3-logo text-[0.7rem] font-mono font-bold tracking-[0.2em] text-[#2e2e2e] uppercase select-none"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
