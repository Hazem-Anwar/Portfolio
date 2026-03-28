"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hazem-anwar98" },
  { label: "Behance", href: "https://www.behance.net/hazem-anwar" },
  { label: "Email", href: "mailto:hazem.amrainana98@gmail.com" },
];

export default function Contact() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      const split = new SplitText(headingRef.current, { type: "lines" });
      gsap.fromTo(split.lines, { y: "100%", opacity: 0 }, {
        y: "0%", opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.15,
        scrollTrigger: { trigger: headingRef.current, start: "top 80%", once: true },
      });
    }
    if (contentRef.current) {
      gsap.fromTo(contentRef.current.children, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: contentRef.current, start: "top 85%", once: true },
      });
    }
  }, []);

  return (
    <section id="contact" className="section-pad bg-bg border-t border-border">
      <div className="container-custom text-center">
        {/* Giant heading */}
        <div className="overflow-hidden mb-10">
          <h2
            ref={headingRef}
            className="font-display text-text leading-none"
            style={{ fontSize: "clamp(3rem, 10vw, 12rem)" }}
          >
            LET&apos;S BUILD<br />
            <span className="text-outline">SOMETHING.</span>
          </h2>
        </div>

        <div ref={contentRef}>
          {/* Email */}
          <a
            href="mailto:hazem.amrainana98@gmail.com"
            className="font-body text-lg md:text-2xl text-muted hover:text-text transition-colors duration-300 inline-block mb-10"
          >
            hazem.amrainana98@gmail.com
          </a>

          {/* Social pills */}
          <div className="flex items-center justify-center flex-wrap gap-3 mb-12">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs"
              >
                {s.label} ↗
              </a>
            ))}
          </div>

          {/* Location + availability */}
          <div className="flex items-center justify-center gap-2 text-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
            <span className="font-mono text-xs tracking-widest uppercase">
              EMEA / Remote · Available April 2026
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-muted">
            © 2026 Hazem Anwar. All rights reserved.
          </span>
          <span className="font-mono text-xs text-muted">
            Product Designer & Frontend Engineer — EMEA
          </span>
        </div>
      </div>
    </section>
  );
}
