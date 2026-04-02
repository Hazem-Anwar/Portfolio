"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";

function TypewriterText({ text, active }: { text: string; active: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  
  const type = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split("")
        .map((letter, index) => {
          if (index <= iteration) return text[index];
          return "";
        })
        .join("")
      );
      
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1;
    }, 35);
    return interval;
  }, [text]);

  useEffect(() => {
    if (active) {
      const interval = type();
      return () => clearInterval(interval);
    } else {
      setDisplayText(text);
    }
  }, [active, text, type]);

  return <>{displayText}</>;
}

const works = [
  {
    title: "hashbank",
    subtitle: "Mobile Bank",
    description: "Founding designer from concept to launch. Redefining mobile banking with a bold, simple, and secure experience.",
    image: "/images/projects/thumbnails/2.png",
    color: "#f8f8f8"
  },
  {
    title: "USER Billing",
    subtitle: "Management System",
    description: "A flexible billing and subscription management experience with powerful controls and clear hierarchy.",
    image: "/images/projects/thumbnails/1.png", 
    color: "#f2f2f2"
  },
  {
    title: "USER Billing",
    subtitle: "Management System",
    description: "A flexible billing and subscription management experience with powerful controls and clear hierarchy.",
    image: "/images/projects/thumbnails/3.png", 
    color: "#f2f2f2"
  },
  {
    title: "USER Billing",
    subtitle: "Management System",
    description: "A flexible billing and subscription management experience with powerful controls and clear hierarchy.",
    image: "/images/projects/thumbnails/3.png", 
    color: "#f2f2f2"
  },
];

export default function SelectedProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHoveredAll, setIsHoveredAll] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
            onMouseEnter={() => setIsHoveredAll(true)}
            onMouseLeave={() => setIsHoveredAll(false)}
            className="w-fit flex items-center justify-start gap-1.5 text-[13px] font-bold text-[#111] group/btn font-jakarta overflow-hidden"
          >
            <span className="relative min-w-[110px] inline-block transition-transform duration-300 group-hover/btn:translate-x-[1px] text-left">
               <TypewriterText text="View All Projects" active={isHoveredAll} />
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
              {/* Image / Mockup Side (Top) */}
              <div 
                className="relative overflow-hidden rounded-[16px] md:rounded-[20px] aspect-[1.4/1] mb-6 border border-transparent group-hover:border-[#eee] transition-all duration-300"
                style={{ backgroundColor: work.color }}
              >
                <div className="absolute inset-0">
                   <Image 
                     src={work.image} 
                     alt={work.title}
                     fill
                     className="object-cover transition-transform duration-500"
                   />
                </div>
              </div>

              {/* Content Side (Bottom) */}
              <div className="">
                <Link 
                   href={`/work/${work.title.toLowerCase().replace(" ", "-")}`}
                   onMouseEnter={() => setHoveredIndex(i)}
                   onMouseLeave={() => setHoveredIndex(null)}
                   className="w-fit flex items-center justify-start gap-1.5 text-[13px] font-bold text-[#111] group/btn font-jakarta overflow-hidden"
                >
                  <span className="relative min-w-[100px] inline-block transition-transform duration-300 group-hover/btn:translate-x-[1px] text-left">
                     <TypewriterText text="See Case Study" active={hoveredIndex === i} />
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
