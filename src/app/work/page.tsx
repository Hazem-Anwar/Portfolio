"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import InternalFooter from "@/components/InternalFooter";
import { cases } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import WorkCard from "@/components/WorkCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const filters = [
    { id: "All", label: "ALL WORK" },
    { id: "Design", label: "DESIGN" },
    { id: "Front-end", label: "FRONT-END" },
  ];

  const filteredCases = cases.filter((c) => {
    return activeFilter === "All" ? true : c.type === activeFilter;
  });

  useEffect(() => {
    // Entrance animation for headline
    if (headlineRef.current) {
      const split = new SplitText(headlineRef.current, { type: "chars" });
      gsap.fromTo(split.chars, {
        y: 100,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.5,
      });
    }

    // Scroll reveal for cards
    const revealCards = () => {
      const cards = gsap.utils.toArray<HTMLElement>(".work-card");
      cards.forEach((card) => {
        gsap.fromTo(card, {
          y: 60,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        });
      });
    };

    revealCards();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [activeFilter]);

  return (
    <div ref={containerRef} className="bg-bg min-h-screen">
      <Nav />
      
      <main className="pt-40 md:pt-48 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-12 mb-24">
          <h1 ref={headlineRef} className="font-display text-[64px] md:text-[120px] lg:text-[160px] leading-[0.85] tracking-tight uppercase">
            SELECTED<br />
            <span className="text-outline">WORK</span>
          </h1>

          <div className="flex flex-wrap gap-x-8 gap-y-4 font-mono text-[11px] tracking-[0.2em] uppercase">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`transition-colors duration-300 relative pb-1 ${
                  activeFilter === f.id ? "text-[rgba(228,254,154,1)]" : "text-text/40 hover:text-text"
                }`}
              >
                {f.label}
                {activeFilter === f.id && (
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[rgba(228,254,154,1)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div className="flex flex-col gap-32">
          {filteredCases.map((project, i) => (
            <div key={project.slug} className="work-card w-full flex justify-center">
              <WorkCard project={project} />
            </div>
          ))}
        </div>

      </main>

      <InternalFooter />
    </div>
  );
}
