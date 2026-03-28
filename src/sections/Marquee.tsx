"use client";

import { useRef } from "react";

const services = [
  "Product Design",
  "Frontend Development",
  "Design Systems",
  "UX Audit",
  "Prototyping",
  "SQA & Quality",
  "Webflow",
  "Mobile Design",
];

export default function Marquee() {
  return (
    <div className="overflow-hidden bg-bg border-y border-border py-5 relative z-10">
      <div className="marquee-wrapper flex items-center" style={{ userSelect: "none" }}>
        <div className="marquee-track flex items-center gap-0 whitespace-nowrap">
          {[...services, ...services].map((service, i) => (
            <span key={i} className="flex items-center">
              <span className="font-display text-xl md:text-2xl tracking-widest uppercase text-text px-8 hover:text-accent transition-colors duration-300">
                {service}
              </span>
              <span className="text-accent font-mono text-sm">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
