"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { cases } from "@/data/projects";

// Only taking the first 4 projects for the homepage
const works = cases.slice(0, 4);

export default function SelectedProjects() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="work" ref={containerRef} className="bg-white py-12 mb-12 md:mb-18 font-jakarta border-border">
      <div className="container-custom">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12 md:mb-12 pt-12 border-t border-[#f0f0f0]" >
          <h2 className="text-[11px] md:text-[12px] font-bold tracking-[0.2em] text-[#2c2c2c] uppercase font-jakarta">
            SELECTED PROJECTS
          </h2>
          <Link 
            href="/work"
            className="w-fit flex items-center justify-start gap-1.5 text-[13px] font-bold text-[#111] group/btn font-jakarta overflow-hidden"
          >
            <span className="relative min-w-[110px] inline-block transition-transform duration-300 group-hover/btn:translate-x-[1px] text-left uppercase">
               VIEW ALL WORK
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
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {works.map((work, i) => (
            <div 
              key={i}
              className="group flex flex-col transition-all duration-300"
            >
              {/* Image Side (Top) */}
              <Link 
                 href={`/work/${work.slug}`}
                 className="relative overflow-hidden rounded-[16px] md:rounded-[20px] aspect-[1.4/1] mb-6 border border-transparent group-hover:border-[#eee] transition-all duration-300"
                 style={{ background: (work as any).bgColor || '#f9f9f9' }}
              >
                <div className="absolute inset-0">
                   <Image 
                     src={work.image} 
                     alt={work.title}
                     fill
                     className="object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                </div>
              </Link>

              {/* Content Side (Bottom) */}
              <div className="pt-4 space-y-2">
                <h3 className="text-[17px] font-bold text-[#111] uppercase tracking-tighter">
                  {work.title}
                </h3>
                
                {work.type === "Design" ? (
                  <Link 
                     href={`/work/${work.slug}`}
                     className="w-fit flex items-center justify-start gap-1.5 text-[13px] font-bold text-[#111] group/btn uppercase tracking-widest"
                  >
                    <span className="relative min-w-[100px] inline-block transition-transform duration-300 group-hover/btn:translate-x-[1px] text-left">
                       EXPLORE CASE STUDY
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
                       className="w-fit flex items-center justify-start gap-1.5 text-[13px] font-bold text-[#111] group/btn uppercase tracking-widest"
                    >
                      <span className="relative min-w-[100px] inline-block transition-transform duration-300 group-hover/btn:translate-x-[1px] text-left">
                         VIEW PROJECT
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
    </section>
  );
}
