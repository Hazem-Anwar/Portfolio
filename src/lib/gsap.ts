"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export { gsap, ScrollTrigger, SplitText };

export function splitAndAnimate(
  selector: string,
  vars?: gsap.TweenVars,
  triggerSelector?: string
) {
  const elements = document.querySelectorAll(selector);
  const splits: SplitText[] = [];

  elements.forEach((el) => {
    const split = new SplitText(el, { type: "chars,words,lines" });
    splits.push(split);

    gsap.from(split.chars, {
      y: "100%",
      opacity: 0,
      rotationX: -90,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.03,
      scrollTrigger: triggerSelector
        ? {
            trigger: triggerSelector || el,
            start: "top 80%",
            once: true,
          }
        : undefined,
      ...vars,
    });
  });

  return splits;
}

export function countUp(el: HTMLElement, target: number, suffix = "") {
  const obj = { value: 0 };
  gsap.to(obj, {
    value: target,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = Math.round(obj.value) + suffix;
    },
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      once: true,
    },
  });
}
