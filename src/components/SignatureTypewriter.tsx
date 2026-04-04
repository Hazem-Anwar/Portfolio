"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface SignatureTypewriterProps {
  text: string;
  delay?: number;
}

export function SignatureTypewriter({ text, delay = 0.5 }: SignatureTypewriterProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay });

      // Smooth reveal using clipPath
      tl.fromTo(textRef.current, 
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: text.length * 0.05, ease: "none" }
      );
    }, textRef);

    return () => ctx.revert();
  }, [text, delay]);

  return (
    <span className="relative inline-flex items-center min-h-[1.2em]">
      <span className="relative">
        <span 
          ref={textRef} 
          className="relative block whitespace-nowrap pr-1"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          {text}
        </span>
      </span>
    </span>
  );
}
