"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const steps = [
  {
    number: "01",
    title: "Discover",
    desc: "Deep dive into user research, stakeholder interviews, analytics audit, and competitive landscape mapping.",
  },
  {
    number: "02",
    title: "Define",
    desc: "Synthesize insights into clear problem statements, user flows, and a measurable north star metric.",
  },
  {
    number: "03",
    title: "Design & Build",
    desc: "From wireframes to production — design, prototype, and build pixel-perfect, accessible interfaces.",
  },
  {
    number: "04",
    title: "Test & Refine",
    desc: "Usability testing, QA cycles, and data-driven iteration until the product feels inevitable.",
  },
];

function ProcessCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const line = lineRef.current;
    if (!card || !line) return;

    gsap.fromTo(card, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
      delay: index * 0.1,
      scrollTrigger: { trigger: card, start: "top 85%", once: true },
    });

    const onEnter = () => {
      gsap.to(line, { scaleX: 1, duration: 0.4, ease: "power3.out" });
    };
    const onLeave = () => {
      gsap.to(line, { scaleX: 0, duration: 0.4, ease: "power3.in" });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, [index]);

  return (
    <div ref={cardRef} className="p-8 border border-border relative group cursor-none">
      <div className="mb-8">
        <span className="font-mono text-xs text-accent tracking-widest">{step.number}</span>
      </div>
      <h3 className="font-display text-3xl md:text-4xl text-text mb-4 group-hover:text-accent transition-colors duration-300">
        {step.title}
      </h3>
      <p className="font-body text-sm text-muted leading-relaxed">{step.desc}</p>

      {/* Animated blue line */}
      <div
        ref={lineRef}
        className="absolute bottom-0 left-0 h-px bg-accent origin-left"
        style={{ width: "100%", transform: "scaleX(0)" }}
      />
    </div>
  );
}

export default function Process() {
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
    <section id="process" className="section-pad bg-bg">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-12">
          <div className="overflow-hidden">
            <h2 ref={headingRef} className="font-display text-5xl md:text-7xl lg:text-8xl leading-none text-text">
              PROCESS
            </h2>
          </div>
          <p className="font-mono text-xs text-muted hidden md:block max-w-[200px] text-right">
            How I work from brief to launch
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {steps.map((step, i) => (
            <ProcessCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
