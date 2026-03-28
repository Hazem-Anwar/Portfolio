"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const services = [
  {
    number: "01",
    title: "Product Design",
    desc: "End-to-end product design from discovery to delivery — research, wireframes, hi-fi flows.",
  },
  {
    number: "02",
    title: "Frontend Development",
    desc: "React, Next.js, TypeScript — pixel-perfect implementation of complex interfaces.",
  },
  {
    number: "03",
    title: "Design Systems",
    desc: "Scalable component libraries and token-based systems that ship with your team.",
  },
  {
    number: "04",
    title: "UX Audit",
    desc: "Systematic analysis of your product to identify friction, drop-off, and missed revenue.",
  },
  {
    number: "05",
    title: "Prototyping",
    desc: "Interactive prototypes that test and validate ideas before a line of code is written.",
  },
  {
    number: "06",
    title: "SQA & Quality",
    desc: "Manual testing, UI/UX validation, cross-browser QA — shipping with confidence.",
  },
];

function ServiceRow({ service, index }: { service: (typeof services)[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const bg = bgRef.current;
    if (!row || !bg) return;

    const onEnter = () => {
      gsap.to(bg, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(row.querySelector(".service-num"), {
        color: "#2563eb",
        duration: 0.3,
      });
      gsap.to(row.querySelector(".service-title"), {
        x: 8,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(bg, {
        clipPath: "inset(0 100% 0 0)",
        duration: 0.4,
        ease: "power3.in",
      });
      gsap.to(row.querySelector(".service-num"), {
        color: "rgba(240,240,235,0.2)",
        duration: 0.3,
      });
      gsap.to(row.querySelector(".service-title"), {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    row.addEventListener("mouseenter", onEnter);
    row.addEventListener("mouseleave", onLeave);

    gsap.fromTo(
      row,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: index * 0.08,
        scrollTrigger: { trigger: row, start: "top 85%", once: true },
      }
    );

    return () => {
      row.removeEventListener("mouseenter", onEnter);
      row.removeEventListener("mouseleave", onLeave);
    };
  }, [index]);

  return (
    <div
      ref={rowRef}
      className="relative border-t border-border py-7 cursor-none overflow-hidden"
    >
      {/* Spotlight bg */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, rgba(37,99,235,0.06) 0%, transparent 100%)",
          clipPath: "inset(0 100% 0 0)",
        }}
      />

      <div className="container-custom flex items-center gap-8 md:gap-16 relative z-10">
        <span className="service-num font-mono text-sm w-8 shrink-0" style={{ color: "rgba(240,240,235,0.2)" }}>
          {service.number}
        </span>
        <h3 className="service-title opacity-25 font-display text-3xl md:text-4xl lg:text-5xl text-text flex-1 leading-none">
          {service.title}
        </h3>
        <p className="font-body text-sm text-muted leading-relaxed hidden md:block max-w-xs">
          {service.desc}
        </p>
        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
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
    <section id="services" className="section-pad bg-bg ">
      <div className="container-custom mb-12">
        <div className="overflow-hidden">
          <h2 ref={headingRef} className="font-display text-5xl md:text-7xl lg:text-8xl leading-none text-text uppercase">
            <span className="text-outline">SERVICES</span>
          </h2>
        </div>
      </div>
      <div className="mt-8"> 
        {services.map((s, i) => (
          <ServiceRow key={s.number} service={s} index={i} />
        ))}
        <div className="border-t border-border" />
      </div>
    </section>
  );
}
