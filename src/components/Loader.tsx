"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const progress = progressRef.current;
    const text = textRef.current;
    const counter = counterRef.current;

    if (!loader || !progress || !text || !counter) return;

    const tl = gsap.timeline();

    // Animate letters in
    tl.fromTo(
      text.querySelectorAll(".loader-char"),
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.3,
        ease: "power4.out",
        stagger: 0.02,
      },
      0,
    );

    // Progress bar + counter
    const obj = { value: 35 };
    tl.to(
      obj,
      {
        value: 100,
        duration: 0.4,
        ease: "none",
        onUpdate: () => {
          const v = Math.round(obj.value);
          if (counter) counter.textContent = v + "%";
          if (progress) progress.style.width = v + "%";
        },
      },
      "-=0.15",
    );

    // Exit animation
    tl.to(
      text,
      { opacity: 0, scale: 0.98, duration: 0.2, ease: "power2.in" },
      "+=0.05",
    );
    tl.to(
      loader,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          document.body.style.overflow = "";
          onComplete();
        },
      },
      "-=0.1",
    );

    document.body.style.overflow = "hidden";
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] bg-bg flex flex-col items-center justify-center"
    >
      {/* Loader text */}
      <div ref={textRef} className="overflow-hidden flex gap-1 mb-12">
        {"HAZEM".split("").map((char, i) => (
          <span
            key={i}
            className="loader-char font-display text-4xl md:text-8xl text-text tracking-widest"
            style={{ display: "inline-block" }}
          >
            {char}
          </span>
        ))}
        <span
          className="loader-char font-display text-4xl md:text-8xl tracking-widest"
          style={{
            display: "inline-block",
            WebkitTextStroke: "1px #f0f0eb",
            color: "transparent",
          }}
        >
          &nbsp;
        </span>
        {"ANWAR".split("").map((char, i) => (
          <span
            key={i}
            className="loader-char font-display text-4xl md:text-8xl tracking-widest"
            style={{
              display: "inline-block",
              WebkitTextStroke: "1px #f0f0eb",
              color: "transparent",
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Progress */}
      <div className="w-64 md:w-96">
        <div className="flex justify-between items-center mb-3">
          <span className="font-mono text-xs text-muted tracking-widest uppercase">
            Loading
          </span>
          <span ref={counterRef} className="font-mono text-xs text-accent">
            35%
          </span>
        </div>
        <div className="h-px bg-border w-full relative overflow-hidden">
          <div
            ref={progressRef}
            className="absolute left-0 top-0 h-full bg-accent transition-none"
            style={{ width: "35%" }}
          />
        </div>
      </div>
    </div>
  );
}
