"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const stackColumns = [
  {
    category: "Design",
    icon: "✦",
    items: [
      "Figma (Advanced)",
      "Adobe XD",
      "Sketch",
      "Webflow",
      "Zeplin",
      "UX Research",
      "Wireframing",
      "Design Systems",
      "Prototyping",
      "Mobile App Design",
    ],
  },
  {
    category: "Frontend",
    icon: "⬡",
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Vue.js",
      "Tailwind CSS",
      "GSAP",
      "HTML / CSS",
      "Sass",
      "Bootstrap",
      "SSR / SSG",
    ],
  },
  {
    category: "QA & Process",
    icon: "◈",
    items: [
      "Manual Testing",
      "UI/UX Testing",
      "Cross-browser QA",
      "Bug Reporting",
      "Jira",
      "Trello",
      "Notion",
      "GitLab",
      "Agile/Scrum",
    ],
  },
  {
    category: "AI Tools",
    icon: "◉",
    items: [
      "Claude",
      "ChatGPT",
      "Figma AI",
      "Google AI Studio",
      "Google Antigravity",
      "Midjourney",
      "v0",
    ],
  },
];

function StackColumn({ col, colIdx }: { col: (typeof stackColumns)[0]; colIdx: number }) {
  const colRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!colRef.current) return;
    const items = colRef.current.querySelectorAll(".stack-item");
    gsap.fromTo(
      items,
      { x: -12, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.05,
        delay: colIdx * 0.1,
        scrollTrigger: { trigger: colRef.current, start: "top 85%", once: true },
      }
    );
  }, [colIdx]);

  return (
    <div ref={colRef} className="p-6 md:p-8 bg-bg">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-accent text-sm">{col.icon}</span>
        <span className="font-mono text-xs text-accent tracking-widest uppercase">
          {col.category}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {col.items.map((item) => (
          <div key={item} className="stack-item flex items-center gap-2 group">
            <div className="w-1 h-1 rounded-full bg-border group-hover:bg-accent transition-colors duration-300 shrink-0" />
            <span className="font-body text-sm text-muted group-hover:text-text transition-colors duration-300">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Stack() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const split = new SplitText(headingRef.current, { type: "chars" });
    gsap.fromTo(split.chars, { y: "100%", opacity: 0 }, {
      y: "0%", opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.03,
      scrollTrigger: { trigger: headingRef.current, start: "top 80%", once: true },
    });
  }, []);

  return (
    <section id="stack" className="section-pad bg-bg">
      <div className="container-custom">
        <div className="overflow-hidden mb-16">
          <h2
            ref={headingRef}
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-none text-text"
          >
            STACK
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {stackColumns.map((col, i) => (
            <StackColumn key={col.category} col={col} colIdx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
