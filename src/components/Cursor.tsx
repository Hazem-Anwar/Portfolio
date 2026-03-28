"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.set(cursor, {
        x: e.clientX,
        y: e.clientY
      });
    };

    const onMouseEnterLink = () => {
      isHovering.current = true;
      gsap.to(cursor, { scale: 1.15, duration: 0.2, ease: "back.out(1.5)" });
    };

    const onMouseLeaveLink = () => {
      isHovering.current = false;
      gsap.to(cursor, { scale: 1, duration: 0.2, ease: "power2.out" });
    };

    const onMouseDown = () => {
      gsap.to(cursor, { scale: 0.9, duration: 0.1 });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: isHovering.current ? 1.15 : 1, duration: 0.2, ease: "back.out(1.5)" });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    const updateHoverListeners = () => {
      const links = document.querySelectorAll("a, button, [data-cursor-hover], .drag-text");
      links.forEach((link) => {
        link.addEventListener("mouseenter", onMouseEnterLink);
        link.addEventListener("mouseleave", onMouseLeaveLink);
      });
      return links;
    };

    let links = updateHoverListeners();

    // Occasional DOM check for new links
    const interval = setInterval(() => {
      links.forEach(l => {
        l.removeEventListener("mouseenter", onMouseEnterLink);
        l.removeEventListener("mouseleave", onMouseLeaveLink);
      });
      links = updateHoverListeners();
    }, 1500);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      clearInterval(interval);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", onMouseEnterLink);
        link.removeEventListener("mouseleave", onMouseLeaveLink);
      });
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none hidden md:block origin-top-left"
      style={{ zIndex: 2147483647 }}
    >
      {/* Figma Multiplayer Pointer SVG - White fill, thick Black stroke */}
      <svg 
        width="24" height="24" viewBox="0 0 24 24" 
        className="absolute top-0 left-0 overflow-visible drop-shadow-md"
      >
        <path d="M1 1L15 7L8.5 9.5L6 16L1 1Z" fill="#ffffff" stroke="#111111" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      
      {/* "You" Tag - White background */}
      <div 
        className="absolute top-[16px] left-[12px] bg-[#ffffff] text-[#111111] px-1.5 py-0.5 text-[10px] font-mono rounded-b-md rounded-tr-md font-bold tracking-widest shadow-lg whitespace-nowrap border border-[#111111]"
      >
        You
      </div>
    </div>,
    document.body
  );
}
