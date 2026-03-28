"use client";

import { useEffect, useRef, useState } from "react";
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
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.04,
      }
    );

    // Progress bar + counter
    const obj = { value: 0 };
    tl.to(
      obj,
      {
        value: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(obj.value);
          if (counter) counter.textContent = v + "%";
          if (progress) progress.style.width = v + "%";
        },
      },
      "-=0.4"
    );

    // Exit animation
    tl.to(
      text,
      { y: "-80px", opacity: 0, duration: 0.6, ease: "power3.in" },
      "-=0.2"
    );
    tl.to(
      loader,
      {
        y: "-100%",
        duration: 1,
        ease: "power4.inOut",
        onComplete: () => {
          document.body.style.overflow = "";
          onComplete();
        },
      },
      "-=0.1"
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
            className="loader-char font-display text-6xl md:text-8xl text-text tracking-widest"
            style={{ display: "inline-block" }}
          >
            {char}
          </span>
        ))}
        <span
          className="loader-char font-display text-6xl md:text-8xl tracking-widest"
          style={{
            display: "inline-block",
            WebkitTextStroke: "1.5px #f0f0eb",
            color: "transparent",
          }}
        >
          &nbsp;
        </span>
        {"ANWAR".split("").map((char, i) => (
          <span
            key={i}
            className="loader-char font-display text-6xl md:text-8xl tracking-widest"
            style={{
              display: "inline-block",
              WebkitTextStroke: "1.5px #f0f0eb",
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
            0%
          </span>
        </div>
        <div className="h-px bg-border w-full relative overflow-hidden">
          <div
            ref={progressRef}
            className="absolute left-0 top-0 h-full bg-accent transition-none"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
