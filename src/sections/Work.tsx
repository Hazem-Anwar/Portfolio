"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import WorkCard from "@/components/WorkCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

import { cases } from "@/data/projects";

export default function Work() {
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
  const projectsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Effect for heading animation (runs once)
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(headingRef.current, { type: "chars" });
      gsap.fromTo(
        split.chars,
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Effect for project cards animation (Layered Stacking effect)
  useEffect(() => {
    if (filteredCases.length === 0) return;

    const ctx = gsap.context(() => {
      projectsRef.current.forEach((project, i) => {
        if (!project) return;
        
        // Pin each card at the top (with offset) as user scrolls past it
        const pinST = ScrollTrigger.create({
          trigger: project,
          start: `top ${100 + (i * 20)}px`,
          endTrigger: stackRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
          scrub: true, // Smooth scrub for pinning movement
          anticipatePin: 1,
        });

        // Add a subtle reveal animation to the inner card content
        gsap.fromTo(
          project.querySelector('.work-card-inner'),
          { 
            y: 40, 
            opacity: 0,
            scale: 1
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "expo.out",
            scrollTrigger: {
              trigger: project,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [filteredCases]);

  return (
    <section id="work" ref={containerRef} className="bg-bg py-20">
      <div className="container-custom relative z-[100] bg-bg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-0">
          <div className="overflow-hidden">
            <h2 ref={headingRef} className="font-display text-5xl md:text-7xl lg:text-8xl leading-none text-text uppercase">
              FEATURED <span className="text-outline">WORK</span>
            </h2>
          </div>
        </div>

        {/* Sleek Category Filters closer to the projects */}
        <div className="flex flex-wrap gap-6 mt-12 md:mt-6 items-center">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`relative py-2 font-mono text-xs md:text-sm tracking-widest uppercase transition-colors duration-300 ${
                activeFilter === filter.id
                  ? "text-white"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              {filter.label}
              {activeFilter === filter.id && (
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-white" />
              )}
            </button>
          ))}
        </div>

        <div
          ref={stackRef}
          className="projects-list flex flex-col gap-10 md:gap-20 mt-20"
        >
          {filteredCases.length === 0 ? (
            <div className="flex items-center justify-center w-full py-20 text-muted font-mono uppercase border border-dashed border-white/10 rounded-3xl">
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
                  className="w-full flex items-center justify-center"
                  style={{ 
                    zIndex: 10 + i 
                  }}
                >
                  <div className="work-card-inner w-full flex justify-center">
                    <WorkCard project={project} />
                  </div>
                </div>
              ))}
              {/* Invisible spacer to ensure last card can pin properly */}
              <div className="h-[25vh] w-full pointer-events-none" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
