"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

function TypewriterText({ text, active }: { text: string; active: boolean }) {
  const [displayText, setDisplayText] = useState(text);

  const type = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index <= iteration) return text[index];
            return "";
          })
          .join(""),
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

export default function Contact() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (headingRef.current) {
      const split = new SplitText(headingRef.current, { type: "lines" });
      gsap.fromTo(
        split.lines,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }
  }, []);

  return (
    <section id="contact" className=" bg-white">
      <div className="container-custom">
        {/* Main Card */}
        <div className="bg-[#f7f7f7] rounded-[32px] py-12 md:py-16 px-6 md:px-12 text-center">
          {/* Heading */}
          <div className="overflow-hidden mb-6 md:mb-8">
            <h2
              ref={headingRef}
              className="font-bricolage font-extrabold text-[#111] leading-[1.2] tracking-tighter"
              style={{ fontSize: "clamp(2rem, 6vw, 72px)" }}
            >
              LET&apos;S BUILD
              <br />
              <span
                className="text-outline-dark"
                style={{ WebkitTextStroke: "1px #111", color: "transparent" }}
              >
                SOMETHING.
              </span>
            </h2>
          </div>

          <div ref={contentRef} className="flex flex-col items-center">
            {/* Email */}
            <a
              href="mailto:hazem.amrainana98@gmail.com"
              className="font-inter text-[16px] md:text-[20px] text-[#888] hover:text-[#111] transition-all duration-300 inline-block mb-8 font-medium"
            >
              hazem.amrainana98@gmail.com
            </a>

            {/* CTA Buttons */}
            <div className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://calendar.app.google/vb1Z7fKZwwxTAXUo7"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group bg-[#111] text-white px-10 py-4 rounded-full font-bold text-[14px] uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:bg-[#222] inline-flex items-center justify-start gap-2 overflow-hidden w-full sm:w-auto"
              >
                <span className="transition-transform duration-300 group-hover:translate-x-[1px] min-w-[120px] inline-block text-left">
                  <TypewriterText text="Book a Call" active={isHovered} />
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
                  className="transition-transform duration-300 group-hover:rotate-[45deg] group-hover:translate-x-[2.5px]"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>

              <a
                href="mailto:hazem.amrainana98@gmail.com"
                className="group bg-transparent text-[#111] px-10 py-4 rounded-full font-bold text-[14px] border border-[#ccc] hover:border-[#111] transition-all duration-300 uppercase tracking-widest inline-flex items-center justify-start gap-2 overflow-hidden w-full sm:w-auto"
              >
                <span className="transition-transform duration-300 group-hover:translate-x-[1px] min-w-[155px] inline-block text-left">
                  Send me a message
                </span>
                <div className="relative overflow-hidden w-[16px] h-[16px] flex items-center justify-center">
                  <div className="hidden group-hover:block transition-all duration-300">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-in fade-in slide-in-from-left-1 duration-300"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                  <div className="w-[8px] h-[8px] rounded-full bg-[#10b981] group-hover:hidden transition-all duration-300 shadow-[0_0_5px_rgba(16,185,129,0.4)]" />
                </div>
              </a>
            </div>

            {/* Location + availability */}
            <div className="flex items-center justify-center text-[#999] font-inter text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-bold">
              <span>EMEA / Remote</span>
              <span className="mx-3 opacity-30 text-lg font-light leading-none">
                •
              </span>
              <span className="text-[#111]">Open for Collaborations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
