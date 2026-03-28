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

  // Effect for stack animation (runs when filtered cases change)
  useEffect(() => {
    projectsRef.current = projectsRef.current.slice(0, filteredCases.length);

    if (!containerRef.current || filteredCases.length === 0) return;

    const stackEl = stackRef.current;
    if (!stackEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stackEl,
          start: "top top",
          // Reserve scroll distance for the pinned stack.
          // Keeps the following sections in normal document flow.
          end: () => `+=${(filteredCases.length - 1) * 100}%`, // Matched to card-to-card steps
          pin: true,
          pinSpacing: true,
          scrub: true, // Native 1:1 scroll tracking (no lag)
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      projectsRef.current.forEach((project, i) => {
        if (!project) return;

        if (i === 0) {
          gsap.set(project, { yPercent: 0, scale: 1, opacity: 1 });
        } else {
          // Initialize upcoming cards out of view (below screen)
          gsap.set(project, { yPercent: 100, scale: 1, opacity: 1 });

          // Crucial: remove initial 1s timeline gap so movement starts instantly on 1st scroll
          const startTime = i - 1;

          // Animate current card sliding up exactly synced with physical scroll speed
          tl.to(
            project,
            {
              yPercent: 0,
              ease: "none", // Constant speed feeling like native scroll
              duration: 1,
            },
            startTime,
          );

          // Animate previous card scaling down for 3D depth
          const previousLayer = projectsRef.current[i - 1];
          if (previousLayer) {
            tl.to(
              previousLayer,
              {
                scale: 0.92,
                opacity: 0.4, // تعتيم بسيط للمشروع السابق
                ease: "none",
                duration: 1,
              },
              startTime,
            );
          }

          // إخفاء المشروع الذي يسبق السابق (المشروع i-2)
          if (i >= 2) {
            const olderLayer = projectsRef.current[i - 2];
            if (olderLayer) {
              tl.to(
                olderLayer,
                {
                  opacity: 0, // إخفاء تماماً
                  ease: "none",
                  duration: 0.5,
                },
                startTime,
              );
            }
          }
        }

        // Continuous Parallax for images tied to the overall container scroll
        const img = project.querySelector(".project-image-inner");
        if (img) {
          const type = (img as HTMLElement).dataset.type;

          if (type === "Front-end") {
            gsap.set(img, { xPercent: 0, yPercent: 0 });
            gsap.to(img, {
              yPercent: -20, // Move up vertically continuously
              ease: "none",
              scrollTrigger: {
                trigger: stackEl,
                start: "top bottom",
                end: "bottom top",
                scrub: true, // Native feeling continuous scrub
              },
            });
          } else {
            gsap.set(img, { xPercent: 0, yPercent: 0 });
            gsap.to(img, {
              xPercent: -15, // Move left horizontally continuously
              ease: "none",
              scrollTrigger: {
                trigger: stackEl,
                start: "top bottom",
                end: "bottom top",
                scrub: true, // Native feeling continuous scrub
              },
            });
          }
        }
      });
    }, containerRef);

    // Ensure all ScrollTriggers (including the pinned Work stack) recalculate
    // after this section's DOM + pin spacer are established.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, [filteredCases]);

  return (
    <section id="work" ref={containerRef} className="bg-bg mt-0 md:mt-14">
      <div className="container-custom pt-48 pb-8 relative z-[100] bg-bg">
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
      </div>

      <div
        ref={stackRef}
        className="projects-stack-container h-screen relative overflow-hidden mt-2"
      >
        {filteredCases.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full text-muted font-mono uppercase">
            No projects found.
          </div>
        ) : (
          filteredCases.map((project, i) => (
            <div
              key={project.slug + activeFilter} // Force re-render on filter change for clean animation state
              ref={(el) => {
                projectsRef.current[i] = el;
              }}
              className="panel absolute inset-0 w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12" // Absolute layering for zero-jump GSAP translation
              style={{ zIndex: (i + 1) * 10 }}
            >
            <WorkCard project={project} />
            </div>
          ))
        )}
      </div>

      <div className="h-[20vh] bg-bg" />
    </section>
  );
}
