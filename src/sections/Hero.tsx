"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";

const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), {
  ssr: false,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const hazemRef = useRef<HTMLHeadingElement>(null);
  const anwarRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // SplitText for HAZEM
      if (hazemRef.current) {
        const splitHazem = new SplitText(hazemRef.current, {
          type: "chars",
        });
        tl.fromTo(
          splitHazem.chars,
          { y: "110%", opacity: 0, rotationX: -80 },
          {
            y: "0%",
            opacity: 1,
            rotationX: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.06,
          },
          0
        );
      }

      // SplitText for ANWAR
      if (anwarRef.current) {
        const splitAnwar = new SplitText(anwarRef.current, { type: "chars" });
        tl.fromTo(
          splitAnwar.chars,
          { y: "110%", opacity: 0, rotationX: -80 },
          {
            y: "0%",
            opacity: 1,
            rotationX: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.06,
          },
          0.15
        );
      }

      // Subline
      if (sublineRef.current) {
        tl.fromTo(
          sublineRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          0.7
        );
      }

      // CTAs
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1 },
          0.9
        );
      }

      // Badge
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          1.0
        );
      }

      // Scroll line
      if (scrollLineRef.current) {
        tl.fromTo(
          scrollLineRef.current,
          { scaleY: 0, opacity: 0 },
          { scaleY: 1, opacity: 1, duration: 1, ease: "power3.out" },
          1.0
        );
      }

      // Metrics
      if (metricsRef.current) {
        tl.fromTo(
          metricsRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1 },
          1.0
        );
      }

      // Scroll parallax
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set([hazemRef.current, anwarRef.current], {
              y: progress * 120,
              opacity: 1 - progress * 1.5,
              scale: 1 - progress * 0.06,
            });
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Three.js Background */}
      <HeroCanvas />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,5,10,0) 0%, rgba(5,5,10,0.7) 100%)",
          zIndex: 1,
        }}
      />

      {/* Availability badge */}
      <div
        ref={badgeRef}
        className="absolute top-8 left-8 md:left-16 flex items-center gap-2 z-10"
      >
        <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
        <span className="font-mono text-xs text-green-400 tracking-widest uppercase">
          Available Apr 2026
        </span>
      </div>

      {/* Main content */}
      <div
        className="relative z-10 text-center px-4 w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* HAZEM line */}
        <div className="overflow-hidden">
          <h1
            ref={hazemRef}
            className="font-display text-text leading-none tracking-tight"
            style={{ fontSize: "clamp(5.5rem, 20vw, 24rem)" }}
          >
            HAZEM
          </h1>
        </div>

        {/* ANWAR line — outline text */}
        <div className="overflow-hidden mt-[-0.12em]">
          <h1
            ref={anwarRef}
            className="font-display leading-none tracking-tight text-outline"
            style={{ fontSize: "clamp(5.5rem, 20vw, 24rem)" }}
          >
            ANWAR
          </h1>
        </div>

        {/* Subline */}
        <p
          ref={sublineRef}
          className="font-mono text-muted text-sm md:text-base tracking-[0.25em] uppercase mt-8"
        >
          Product Designer&nbsp;&nbsp;/&nbsp;&nbsp;Frontend Engineer
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <Link href="#work" className="btn-primary">
            View Work
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="#contact" className="btn-ghost">
            Start a Project
          </Link>
        </div>
      </div>

      {/* Metrics row */}
      <div
        ref={metricsRef}
        className="absolute bottom-20 left-0 right-0 z-10 flex justify-center"
      >
        <div className="flex items-center gap-12 md:gap-20">
          {[
            { value: "5+", label: "Years" },
            { value: "20+", label: "Projects" },
            { value: "3", label: "Disciplines" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="font-display text-4xl md:text-5xl text-text"
                style={{ lineHeight: 1 }}
              >
                {stat.value}
              </div>
              <div className="font-mono text-xs text-muted tracking-widest uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div
          ref={scrollLineRef}
          className="w-px h-16 bg-gradient-to-b from-accent to-transparent origin-top"
          style={{ transform: "scaleY(0)" }}
        />
        <span className="font-mono text-[10px] text-muted tracking-widest rotate-90 origin-center mt-2">
          SCROLL
        </span>
      </div>
    </section>
  );
}
