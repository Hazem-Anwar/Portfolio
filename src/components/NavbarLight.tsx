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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;
        
        // 1. Scrolled State
        if (currentScrollY > 20) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }

        // 2. Visibility Logic (More sensitive)
        const scrollDelta = currentScrollY - lastScrollY;
        
        if (currentScrollY <= 5) {
          // Force visible at the very top
          setIsVisible(true);
        } else if (Math.abs(scrollDelta) > 5) {
          // Sensitive to direction changes
          if (scrollDelta > 0) {
            setIsVisible(false); // Scrolling down
          } else {
            setIsVisible(true); // Scrolling up
          }
          setLastScrollY(currentScrollY);
        }
      }
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  if (isProjectPage) return null;

  return (
    <>
      <nav 
        ref={containerRef}
        className={`fixed top-0 left-0 w-full z-[120] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isVisible || isOpen ? "translate-y-0" : "-translate-y-full"}
          ${isScrolled || isOpen 
            ? "py-4 before:opacity-100 shadow-sm" 
            : "py-6 before:opacity-0 shadow-none"}
          before:content-[''] before:absolute before:inset-0 before:bg-white/80 before:backdrop-blur-md before:z-[-1] before:transition-opacity before:duration-300
          after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-black/10 after:z-[-1]`}
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
            <a 
              href="https://calendar.app.google/vb1Z7fKZwwxTAXUo7"
              target="_blank"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group bg-[#111] text-white px-7 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#222] flex items-center justify-start gap-2 overflow-hidden"
            >
              <span className="transition-transform duration-300 group-hover:translate-x-[1px] min-w-[75px] inline-block text-left">
                 <TypewriterText text="Book a Call" active={isHovered} />
              </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-[45deg] group-hover:translate-x-[2px]">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </a>
          </div>

          {/* Hamburger Menu Icon / Close Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center p-2 z-[130] focus:outline-none transition-transform active:scale-90"
            aria-label="Toggle Menu"
          >
            <div className="relative w-6 h-5 flex flex-col items-end justify-center gap-[7px]">
              <span className={`h-[2px] bg-[#111] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "w-6 rotate-45 translate-y-[4.5px]" : "w-6"}`} />
              <span className={`h-[2px] bg-[#111] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "w-6 -rotate-45 -translate-y-[4.5px]" : "w-4"}`} />
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
          href="https://calendar.app.google/vb1Z7fKZwwxTAXUo7" 
          target="_blank"
          onClick={() => setIsOpen(false)}
          className="text-4xl font-bold tracking-tight hover:text-[#111] transition-colors"
        >
          Book a Call
        </Link>
      </div>

      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
    </>
  );
}
