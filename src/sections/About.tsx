"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLDivElement>(null);
  const word2Ref = useRef<HTMLDivElement>(null);
  const word3Ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const word1 = word1Ref.current;
    const word2 = word2Ref.current;
    const word3 = word3Ref.current;

    if (!word1 || !word2 || !word3) return;

    // Set initial states
    gsap.set([word1, word2, word3], {
      opacity: 0,
      yPercent: 100,
      rotationX: -35,
      transformOrigin: "center center",
    });

    // Use IntersectionObserver instead of ScrollTrigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            // Create timeline
            const tl = gsap.timeline();

            tl.to(word1, {
              opacity: 1,
              yPercent: 0,
              rotationX: 0,
              duration: 1,
              ease: "power4.out",
            })
            .to(word2, {
              opacity: 1,
              yPercent: 0,
              rotationX: 0,
              duration: 1,
              ease: "power4.out",
            }, "-=0.65")
            .to(word3, {
              opacity: 1,
              yPercent: 0,
              rotationX: 0,
              duration: 1,
              ease: "power4.out",
            }, "-=0.65");
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% visible
        rootMargin: "0px 0px -100px 0px"
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-bg py-32 md:py-48 lg:py-56 relative"
    >
      <div
        ref={containerRef}
        className="flex flex-col items-center justify-center w-full px-6 gap-y-6 md:gap-y-10 lg:gap-y-14"
        style={{ 
          perspective: "1200px",
          perspectiveOrigin: "center center"
        }}
      >
        {/* Word 1: Designer */}
        <div 
          ref={word1Ref}
          className="w-full flex justify-center overflow-hidden"
          style={{ 
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            willChange: "transform, opacity"
          }}
        >
          <span className="block font-display text-center text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] text-text leading-[1.1] uppercase tracking-tighter">
            Designer
          </span>
        </div>

        {/* Word 2: Engineer */}
        <div 
          ref={word2Ref}
          className="w-full flex justify-center overflow-hidden"
          style={{ 
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            willChange: "transform, opacity"
          }}
        >
          <span className="block font-display text-center text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] leading-[1.1] uppercase tracking-tighter text-text">
            Engineer
          </span>
        </div>

        {/* Word 3: One Person */}
        <div 
          ref={word3Ref}
          className="w-full flex justify-center overflow-hidden"
          style={{ 
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            willChange: "transform, opacity"
          }}
        >
          <span className="block font-display text-center text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] text-outline leading-[1.1] uppercase tracking-tighter">
            One Person
          </span>
        </div>
      </div>
    </section>
  );
}