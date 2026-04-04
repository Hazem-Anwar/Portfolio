"use client";

import { useState, useEffect, useCallback } from "react";

interface TypewriterTextProps {
  text: string;
  active: boolean;
  speed?: number;
}

export function TypewriterText({ text, active, speed = 35 }: TypewriterTextProps) {
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
    }, speed);
    return interval;
  }, [text, speed]);

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
