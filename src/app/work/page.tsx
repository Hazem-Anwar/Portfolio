"use client";

import { useState, useEffect } from "react";
import Contact from "@/sections/Contact";
import LineFooter from "@/components/LineFooter";
import { cases } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Force Light Mode on this page
  useEffect(() => {
    document.documentElement.classList.add("light-mode");
    return () => {
      document.documentElement.classList.remove("light-mode");
    };
  }, []);

  const filters = [
    { id: "All", label: "ALL WORK" },
    { id: "Design", label: "DESIGN" },
    { id: "Front-end", label: "FRONT-END" },
  ];

  const filteredCases = cases.filter((c) => {
    return activeFilter === "All" ? true : c.type === activeFilter;
  });

  return (
    <main className="bg-white min-h-screen font-inter text-[#111] relative overflow-hidden">
      {/* Artistic Touches: Background Glow & Grid */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#0000000d] blur-[120px] rounded-full" />
        <div className="absolute top-[10%] left-[-5%] w-[300px] h-[300px] bg-[#00000008] blur-[100px] rounded-full" />
        {/* Subtle Dot Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="pt-32 md:pt-48 pb-20">
        <div className="container-custom">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-8 mb-16 md:mb-24 relative">
            <div className="flex items-baseline gap-4">
              <h1 className="text-[36px] md:text-[48px] font-bold tracking-tight text-[#111] uppercase">
                SELECTED{" "}
                <span
                  className="text-outline"
                  style={{ WebkitTextStroke: "1px #111", color: "transparent" }}
                >
                  WORK
                </span>
                <span className="text-[#ff4d00]">.</span>
              </h1>
              <span className="font-mono text-[11px] text-[#888] font-bold tracking-widest bg-[#f7f7f7] px-2 py-0.5 rounded-full border border-[#eee]">
                {filteredCases.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 text-[11px] font-bold tracking-[0.2em] uppercase text-[#888]">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`transition-colors duration-300 relative pb-1 ${
                    activeFilter === f.id ? "text-[#111]" : "hover:text-[#111]"
                  }`}
                >
                  {f.label}
                  {activeFilter === f.id && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#111]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid- (Same as Home Page Section) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 mb-16 md:mb-24 ">
            {filteredCases.map((work) => (
              <div
                key={work.slug}
                className="group flex flex-col transition-all duration-300"
              >
                {/* Image / Mockup Side (Top) */}
                <div className="relative overflow-hidden rounded-[16px] md:rounded-[20px] aspect-[1.4/1] mb-6 border border-transparent group-hover:border-[#eee] transition-all duration-300 bg-[#f8f8f8]">
                  <div className="absolute inset-0">
                    <Image
                      src={work.image || ""}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Content Side (Bottom) */}
                <div className="">
                  <div className="flex flex-col mb-4">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#888] uppercase mb-1">
                      {work.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-[#111]">
                      {work.title}
                    </h3>
                  </div>

                  {work.type === "Design" ? (
                    <Link
                      href={`/work/${work.slug}`}
                      className="w-fit flex items-center justify-start gap-1.5 text-[13px] font-bold text-[#111] group/btn font-jakarta overflow-hidden"
                    >
                      <span className="relative min-w-[100px] inline-block transition-transform duration-300 group-hover/btn:translate-x-[1px] text-left">
                        See Case Study
                      </span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover/btn:rotate-[45deg] group-hover/btn:translate-x-[2px]"
                      >
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </Link>
                  ) : (
                    work.link && (
                      <a
                        href={work.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-fit flex items-center justify-start gap-1.5 text-[13px] font-bold text-[#111] group/btn font-jakarta overflow-hidden"
                      >
                        <span className="relative min-w-[100px] inline-block transition-transform duration-300 group-hover/btn:translate-x-[1px] text-left">
                          View Project
                        </span>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform duration-300 group-hover/btn:rotate-[45deg] group-hover/btn:translate-x-[2px]"
                        >
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </a>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Contact />
      <LineFooter />
    </main>
  );
}
