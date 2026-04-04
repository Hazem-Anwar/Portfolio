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

import { usePathname } from "next/navigation";

export default function NavbarLight() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isHome = pathname === "/";
  const isWork = pathname === "/work";
  const isProjectPage = pathname.startsWith("/work/") && pathname !== "/work";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAboutOpen(!isAboutOpen);
    if (isOpen) setIsOpen(false); // Close mobile menu if open
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      const { getLenis } = require("@/lib/lenis");
      const lenis = getLenis();
      
      if (lenis) {
        lenis.scrollTo(id, { duration: 1.5, offset: -80 });
        if (isOpen) setIsOpen(false);
      } else {
        el.scrollIntoView({ behavior: "smooth" });
        if (isOpen) setIsOpen(false);
      }
    }
  };

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  if (isProjectPage) return null;

  return (
    <>
      <nav 
        ref={containerRef}
        className={`fixed top-0 left-0 w-full z-[120] py-5 transition-colors duration-300
          ${isOpen ? "" : "before:content-[''] before:absolute before:inset-0 before:bg-white/70 before:backdrop-blur-md before:z-[-1]"}
          after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-black/[0.04] after:z-[-1]`}
      >
        <div className="container-custom flex items-center justify-between relative font-epilogue">
          {/* Logo */}
          <Link href="/" className="text-[20px] font-bold tracking-tight hover:scale-[1.05] transition-all duration-300 z-10">
            HA<span className="text-[#ff4d00]">.</span>
          </Link>
          
          {/* Centered Pill Navigation */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center bg-[#f2f2f2]/80 backdrop-blur-md p-1 rounded-full border border-[#eee] shadow-sm">
            <Link 
              href="/" 
              className={`${isHome ? "bg-white text-[#111] shadow-sm" : "text-[#666] hover:text-[#111]"} px-6 py-2 rounded-full text-[13px] font-semibold transition-all duration-300`}
            >
              Home
            </Link>
            <Link 
              href="/work" 
              className={`${isWork ? "bg-white text-[#111] shadow-sm" : "text-[#666] hover:text-[#111]"} px-6 py-2 rounded-full text-[13px] font-semibold transition-all duration-300`}
            >
              Work
            </Link>
            <button 
              onClick={toggleAbout}
              className="text-[#666] hover:text-[#111] px-6 py-2 rounded-full text-[13px] font-semibold transition-all duration-300"
            >
              About
            </button>
            <Link 
              href="/#cv" 
              onClick={(e) => handleScrollTo(e, "#cv")}
              className="text-[#666] hover:text-[#111] px-6 py-2 rounded-full text-[13px] font-semibold transition-all duration-300"
            >
              CV
            </Link>
          </div>

          {/* Right Side / Contact Button */}
          <div className="hidden md:flex items-center z-10">
            <Link 
              href="/#contact" 
              onClick={(e) => handleScrollTo(e, "#contact")}
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

          {/* Hamburger Menu Icon / Close Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden flex items-center gap-3 p-2 z-[130] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#111] mb-[1px]">Close</span>
            )}
            <div className="flex flex-col gap-1.5 pt-0.5">
              <span className={`w-6 h-[2.5px] bg-[#111] transition-all duration-300 origin-center ${isOpen ? "rotate-45 translate-y-[8.5px]" : ""}`}></span>
              <span className={`w-6 h-[2.5px] bg-[#111] transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
              <span className={`w-6 h-[2.5px] bg-[#111] transition-all duration-300 origin-center ${isOpen ? "-rotate-45 -translate-y-[8.5px]" : ""}`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Backdrop Menu */}
      <div 
        ref={menuRef}
        className="fixed inset-0 bg-white z-[105] flex flex-col items-center justify-center gap-8 md:hidden invisible opacity-0 translate-y-[-50px]"
      >
        <Link 
          href="/" 
          onClick={(e) => { if(isHome) handleScrollTo(e, "body"); else setIsOpen(false); }}
          className={`text-4xl font-bold tracking-tight transition-colors ${isHome ? "text-[#111]" : "hover:text-[#111]"}`}
        >
          Home
        </Link>
        <Link 
          href="/work" 
          onClick={() => setIsOpen(false)}
          className={`text-4xl font-bold tracking-tight transition-colors ${isWork ? "text-[#111]" : "hover:text-[#111]"}`}
        >
          Work
        </Link>
        <button 
          onClick={toggleAbout}
          className="text-4xl font-bold tracking-tight hover:text-[#111] transition-colors"
        >
          About
        </button>
        <Link 
          href="/#cv" 
          onClick={(e) => handleScrollTo(e, "#cv")}
          className="text-4xl font-bold tracking-tight hover:text-[#111] transition-colors"
        >
          CV
        </Link>
        <Link 
          href="/#contact" 
          onClick={(e) => handleScrollTo(e, "#contact")}
          className="text-4xl font-bold tracking-tight hover:text-[#111] transition-colors font-underline decoration-[#111]"
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
