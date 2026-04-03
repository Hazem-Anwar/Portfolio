"use client";

import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef, useState, useCallback } from "react";

function TypewriterText({ text, active }: { text: string; active: boolean }) {
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

import AboutModal from "./AboutModal";

export default function NavbarLight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAboutOpen(!isAboutOpen);
    if (isOpen) setIsOpen(false); // Close mobile menu if open
  };

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power4.out",
        visibility: "visible",
      });
    } else {
      gsap.to(menuRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          if (menuRef.current) menuRef.current.style.visibility = "hidden";
        },
      });
    }
  }, [isOpen]);

  return (
    <>
      <nav 
        ref={containerRef}
        className="fixed top-0 left-0 w-full z-[100] py-5 
          before:content-[''] before:absolute before:inset-0 before:bg-white/70 before:backdrop-blur-md before:z-[-1]
          after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-black/[0.04] after:z-[-1]"
      >
        <div className="container-custom flex items-center justify-between relative font-epilogue">
          {/* Logo */}
          <Link href="/" className="text-[20px] font-bold tracking-tight hover:scale-[1.05] transition-all duration-300 z-10">
            HA<span className="text-[#ff4d00]">.</span>
          </Link>
          
          {/* Centered Pill Navigation */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center bg-[#f2f2f2]/80 backdrop-blur-md p-1 rounded-full border border-[#eee] shadow-sm">
          <Link href="/" className="bg-white text-[#111] px-6 py-2 rounded-full text-[13px] font-semibold shadow-sm transition-all duration-300">
              Home
            </Link>
            <Link href="#work" className="text-[#666] hover:text-[#111] px-6 py-2 rounded-full text-[13px] font-semibold transition-all duration-300">
              Work
            </Link>
            <button 
              onClick={toggleAbout}
              className="text-[#666] hover:text-[#111] px-6 py-2 rounded-full text-[13px] font-semibold transition-all duration-300"
            >
              About
            </button>
            <Link href="#cv" className="text-[#666] hover:text-[#111] px-6 py-2 rounded-full text-[13px] font-semibold transition-all duration-300">
              CV
            </Link>
          </div>

          {/* Right Side / Contact Button */}
          <div className="hidden md:flex items-center z-10">
            <Link 
              href="#contact" 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group bg-[#111] text-white px-7 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#222] flex items-center justify-start gap-2 overflow-hidden"
            >
              <span className="transition-transform duration-300 group-hover:translate-x-[1px] min-w-[70px] inline-block text-left">
                 <TypewriterText text="Let's Talk" active={isHovered} />
              </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-[45deg] group-hover:translate-x-[2px]">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </Link>
          </div>

          {/* Hamburger Menu Icon */}
          <button 
            onClick={toggleMenu}
            className="md:hidden flex flex-col gap-1.5 p-2 z-[110]"
            aria-label="Toggle Menu"
          >
            <span className={`w-6 h-[2px] bg-[#111] transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[8px]" : ""}`}></span>
            <span className={`w-6 h-[2px] bg-[#111] transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-6 h-[2px] bg-[#111] transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Backdrop Menu */}
      <div 
        ref={menuRef}
        className="fixed inset-0 bg-white z-[105] flex flex-col items-center justify-center gap-8 md:hidden invisible opacity-0 translate-y-[-50px]"
      >
        <Link 
          href="#work" 
          onClick={toggleMenu}
          className="text-4xl font-bold tracking-tight hover:text-[#ff4d00] transition-colors"
        >
          Work
        </Link>
        <button 
          onClick={toggleAbout}
          className="text-4xl font-bold tracking-tight hover:text-[#ff4d00] transition-colors"
        >
          About
        </button>
        <Link 
          href="#cv" 
          onClick={toggleMenu}
          className="text-4xl font-bold tracking-tight hover:text-[#ff4d00] transition-colors"
        >
          CV
        </Link>
        <Link 
          href="#contact" 
          onClick={toggleMenu}
          className="text-4xl font-bold tracking-tight hover:text-[#ff4d00] transition-colors font-underline decoration-[#ff4d00]"
        >
          Contact
        </Link>
      </div>

      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
    </>
  );
}
