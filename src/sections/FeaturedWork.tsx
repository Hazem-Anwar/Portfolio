"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import WorkCard from "@/components/WorkCard";
import { cases } from "@/data/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export default function FeaturedWork() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = [
    { id: "All", label: "ALL WORK" },
    { id: "Design", label: "DESIGN" },
    { id: "Front-end", label: "FRONT-END" },
  ];

  const filteredCases = cases.filter((c) => {
    return activeFilter === "All" ? true : c.type === activeFilter;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Heading animation
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(headingRef.current, { type: "chars" });
      gsap.fromTo(
        split.chars,
        { y: "115%", opacity: 0, rotateX: -40 },
        {
          y: "0%",
          opacity: 1,
          rotateX: 0,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.035,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Stacking + cascading scale animation
  useEffect(() => {
    if (filteredCases.length === 0) return;

    const ctx = gsap.context(() => {
      projectsRef.current.forEach((project, i) => {
        if (!project) return;

        const card = project.querySelector<HTMLElement>(".work-card-inner");

        // ── Entrance: 3D tilt slide-up ──────────────────────────────────
        gsap.set(card, {
          y: 80,
          opacity: 0,
          rotateX: 6,
          transformOrigin: "center top",
          transformPerspective: 1200,
        });

        gsap.timeline({
          scrollTrigger: {
            trigger: project,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }).to(card, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          ease: "expo.out",
          delay: i * 0.04,
        });

        // ── Pinning (all cards, same behavior) ──────────────────────────
        ScrollTrigger.create({
          trigger: project,
          start: `top ${100 + i * 22}px`,
          endTrigger: stackRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        // ── Cascading scale: shrink this card each time a later card pins ─
        // Card i shrinks by 0.055 for every card above it in the stack
        projectsRef.current.forEach((laterProject, j) => {
          if (j <= i || !laterProject) return;

          const targetScale = 1 - 0.055 * (j - i);
          const pinStart = 100 + j * 22;

          gsap.to(card, {
            scale: targetScale,
            ease: "none",
            scrollTrigger: {
              trigger: laterProject,
              start: `top ${pinStart + 80}px`,
              end: `top ${pinStart}px`,
              scrub: 1.5,
            },
          });
        });

        // ── Parallax on card image ───────────────────────────────────────
        const imgInner = project.querySelector(".project-image-inner");
        if (imgInner) {
          gsap.to(imgInner, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: project,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }
      });
      // ── Set spacer height so last card has exact travel distance ───────
      // spacer height = viewportH - lastCardPinOffset (all in pixels)
      if (spacerRef.current) {
        const lastPinOffset = 100 + (filteredCases.length - 1) * 22;
        spacerRef.current.style.height = `${window.innerHeight - lastPinOffset}px`;
      }
    }, containerRef);

    return () => ctx.revert();
  }, [filteredCases]);

  return (
    <section id="work" ref={containerRef} className="bg-bg py-20 overflow-hidden text-white">
      <div className="container-custom relative z-[100] bg-bg">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-0">
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-none text-white uppercase"
              style={{ perspective: "800px" }}
            >
              FEATURED WORK
            </h2>
          </div>

          <div className="flex items-end gap-2 pb-2">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#666]">
              {filteredCases.length} project{filteredCases.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-6 mt-10 md:mt-6 items-center border-t border-border pt-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`relative py-1.5 font-mono text-[11px] tracking-[0.22em] uppercase transition-all duration-500 ${
                activeFilter === filter.id
                  ? "text-white"
                  : "text-white/30 hover:text-white/70"
              }`}
            >
              {filter.label}
              <span
                className={`absolute left-0 bottom-0 h-px bg-white transition-all duration-500 ${
                  activeFilter === filter.id ? "w-full" : "w-0"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Stack list */}
        <div
          ref={stackRef}
          className="projects-list flex flex-col gap-8 md:gap-16 mt-16"
        >
          {filteredCases.length === 0 ? (
            <div className="flex items-center justify-center w-full py-24 text-muted font-mono uppercase border border-dashed border-white/10 rounded-3xl tracking-widest text-xs">
              No projects found.
            </div>
          ) : (
            <>
              {filteredCases.map((project, i) => (
                <div
                  key={project.slug + activeFilter}
                  ref={(el) => {
                    projectsRef.current[i] = el;
                  }}
                  className="w-full relative"
                  style={{ zIndex: 10 + i }}
                >
                  <div className="work-card-inner w-full">
                    <WorkCard project={project} />
                  </div>
                </div>
              ))}
              {/* Exact-pixel spacer — set by JS for last card travel distance */}
              <div ref={spacerRef} className="w-full pointer-events-none" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
