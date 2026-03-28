"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [time, setTime] = useState("");
  const pathname = usePathname();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const scrambleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // 1. Live clock logic
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // 2. Initial Entrance Animations
    gsap.fromTo("#nav-inner", 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 1.2 }
    );
    
    gsap.fromTo(".floating-ui",
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.5 }
    );

    return () => {
      clearInterval(timer);
    };
  }, []);

  // 3. Smart Sticky Logic
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;
        
        // Always show at the top
        if (currentScrollY < 80) {
          setIsVisible(true);
        } else {
          // Hide on scroll down, show on scroll up
          if (currentScrollY > lastScrollY) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // 4. Text Scramble Animation (Mobile Menu Button) - Improved for varying lengths
  useEffect(() => {
    if (!scrambleRef.current) return;
    
    const targetText = isOpen ? "CLOSE" : "MENU";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let iteration = 0;
    
    const interval = setInterval(() => {
      // Use targetText length to ensure full word is rendered (e.g., CLOSE vs MENU)
      scrambleRef.current!.innerText = targetText
        .split("")
        .map((char, index) => {
          if(index < iteration) return targetText[index];
          return chars[Math.floor(Math.random() * 26)];
        })
        .join("");
      
      if(iteration >= targetText.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 20);

    return () => clearInterval(interval);
  }, [isOpen]);

  // 5. Menu Overlay Animation (Pure Fade)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Elegant fade-in for overlay
      gsap.to(menuRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.8,
        ease: "power2.inOut",
      });
      // Staggered fade + slight slide for links
      gsap.fromTo(".menu-link", 
        { y: 20, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.1, 
          ease: "power3.out", 
          delay: 0.2 
        }
      );
    } else {
      document.body.style.overflow = "auto";
      gsap.to(menuRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.8, // Smooth and elegant close
        ease: "power2.out"
      });
    }
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "WORK", href: "/work" },
    { name: "ABOUT", href: "/about" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[1200] transition-transform duration-500 ${
          isVisible || isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div id="nav-inner" className="w-full px-6 py-6 md:px-12 flex items-center justify-between opacity-0">
          
          {/* Left: Branding */}
          <div className="flex justify-start">
            <Link
              href="/"
              className="font-display text-lg md:text-xl   tracking-tight text-white uppercase hover:opacity-70 transition-opacity"
            >
              Hazem Anwar
            </Link>
          </div>

          {/* Center: Location & Time (Desktop Only) */}
          <div className="hidden md:flex justify-center flex-1">
            <span className="font-mono text-[10px] md:text-[11px] font-bold tracking-widest text-[#a1a1aa] uppercase">
              Riyadh, KSA — {time || "00:00:00"} AST
            </span>
          </div>

          {/* Right: Original Desktop Links or Mobile Toggle */}
          <div className="flex justify-end items-center gap-6">
            <div className="hidden md:flex gap-8">
              <Link href="/work" className="font-mono text-[11px] font-bold tracking-widest text-white uppercase hover:text-[rgba(228,254,154,1)] transition-colors">
                Work
              </Link>
              <Link href="/about" className="font-mono text-[11px] font-bold tracking-widest text-white uppercase hover:text-[rgba(228,254,154,1)] transition-colors">
                About
              </Link>
            </div>

            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center gap-4 focus:outline-none"
            >
              <span 
                ref={scrambleRef}
                className="font-mono text-[11px] font-bold tracking-[0.2em] text-white uppercase w-[50px] text-right"
              >
                MENU
              </span>
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-[1.5px] bg-white transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
                <span className={`w-full h-[1.5px] bg-white transition-all duration-500 ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-[1.5px] bg-white transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <div 
        ref={menuRef}
        className="fixed inset-0 z-[1100] bg-bg flex flex-col justify-center items-center px-12 md:hidden"
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        <div className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="menu-link overflow-hidden"
            >
              <h2 className="font-display text-[15vw] leading-none uppercase tracking-tighter hover:text-[rgba(228,254,154,1)] transition-colors duration-300">
                {link.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating AI Button (Bottom Right) */}
      <button 
        className="floating-ui opacity-0 fixed bottom-6 right-6 z-[1300] bg-[rgba(228,254,154,1)] text-black font-mono text-[11px] font-bold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
        style={{ boxShadow: "0 0 20px rgba(228,254,154,0.4)" }}
      >
        <span className="text-[14px] leading-none mb-[1px]">✦</span> 
        Ask my work 
        <span className="ml-1 opacity-50 font-sans tracking-tight">⌘K</span>
      </button>

    </>
  );
}
