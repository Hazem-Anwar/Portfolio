"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InternalFooter() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll(".footer-reveal"),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
          },
        }
      );
    }
  }, []);

  return (
    <footer ref={containerRef} className="w-full bg-bg border-t border-white/5 py-20 md:py-32 px-6 md:px-0 mt-20">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-baseline justify-between gap-12 md:gap-20">
        
        {/* Left: Giant Heading */}
        <div className="footer-reveal">
          <Link href="mailto:hazem.amrainana98@gmail.com" className="group flex flex-col items-start">
            <h2 className="font-display text-[40px] md:text-[60px] lg:text-[80px] leading-none tracking-[-0.02em] text-text transition-colors group-hover:text-[rgba(228,254,154,1)]">
              LET&apos;S <span className="text-outline">TALK</span>.
            </h2>
          </Link>
        </div>

        {/* Right: Info & Links */}
        <div className="footer-reveal flex flex-col md:flex-row flex-wrap items-baseline gap-x-8 gap-y-4 font-mono text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-text/50">
          <a
            href="mailto:hazem.amrainana98@gmail.com"
            className="text-text/80 hover:text-[rgba(228,254,154,1)] transition-colors border-b border-white/10 pb-0.5"
          >
            hazem.amrainana98@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/hazem-anwar98/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors border-b border-white/10 pb-0.5"
          >
            LinkedIn
          </a>
          <a
            href="https://www.behance.net/hazem-anwar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors border-b border-white/10 pb-0.5"
          >
            Behance
          </a>
          <Link href="/privacy" className="hover:text-text transition-colors border-b border-white/10 pb-0.5">
            Privacy
          </Link>
          <span className="text-text/30 mt-4 md:mt-0">
            © 2026 Hazem Anwar. All rights reserved.
          </span>
        </div>

      </div>

      {/* Optional: Subtle floating button if needed on pages without the Nav floating button */}
      <button 
        className="fixed bottom-6 right-6 z-[500] bg-[rgba(228,254,154,1)] text-black font-mono text-[11px] font-bold px-5 py-3 rounded-full flex md:hidden items-center justify-center gap-2 shadow-[0_0_20px_rgba(228,254,154,0.3)]"
      >
        <span className="text-[14px]">✦</span> Ask
      </button>

    </footer>
  );
}
