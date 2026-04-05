"use client";

import { useEffect, useRef, useState } from "react";
import NavbarLight from "@/components/NavbarLight";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InternalFooter from "@/components/InternalFooter";
import Link from "next/link";   
import Tools from "@/components/Toolkit";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FigmaBox = ({ label, show }: { label: string; show: boolean }) => (
  <div
    className={`absolute -inset-2 border border-[#a855f7] pointer-events-none transition-opacity duration-300 z-40 ${
      show ? "opacity-100" : "opacity-0"
    }`}
  >
    <div className="absolute -top-[3px] -left-[3px] w-1.5 h-1.5 bg-white border border-[#a855f7] rounded-[1px]" />
    <div className="absolute -top-[3px] -right-[3px] w-1.5 h-1.5 bg-white border border-[#a855f7] rounded-[1px]" />
    <div className="absolute -bottom-[3px] -left-[3px] w-1.5 h-1.5 bg-white border border-[#a855f7] rounded-[1px]" />
    <div className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 bg-white border border-[#a855f7] rounded-[1px]" />
    <div className="absolute -top-[18px] left-[-1px] bg-[#a855f7] text-white text-[9px] font-bold font-sans px-1.5 py-[2px] rounded-sm tracking-wider whitespace-nowrap shadow-sm leading-none">
      {label}
    </div>
  </div>
);

const PhotoTag = ({
  text,
  active,
  cursorPos,
}: {
  text: string;
  active: boolean;
  cursorPos: { x: number; y: number };
}) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (active) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    } else {
      setDisplayText("");
    }
  }, [active, text]);

  if (!active && !displayText) return null;

  return (
    <div
      className="fixed pointer-events-none z-[100] flex flex-row items-start font-sans transition-opacity duration-300"
      style={{ left: cursorPos.x, top: cursorPos.y, opacity: active ? 1 : 0 }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" className="drop-shadow-md z-10 mt-1 mr-[-6px]">
        <path d="M5 3L19 10L12.5 13.5L9 20L5 3Z" fill="#a855f7" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <div className="flex flex-col text-left mt-4" style={{ filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.4))" }}>
        <div className="bg-[#d8b4fe] text-black px-2 py-0.5 text-[10px] font-sans rounded-t-md w-max font-semibold border border-b-0 border-[#c084fc]/30">
          Hazem Anwar
        </div>
        <div className="bg-[#c084fc] text-black font-medium px-3 py-2 text-[13px] rounded-b-md rounded-tr-md shadow-lg tracking-wide min-h-[32px] flex items-center border border-[#c084fc]">
          {displayText}
          <span className="w-[1.5px] h-3.5 bg-black ml-1 inline-block animate-pulse align-middle" />
        </div>
      </div>
    </div>
  );
};

export default function AboutArchivePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const photoStackRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  
  const [showTitleBox, setShowTitleBox] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(-1);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [firstPhotoAlt, setFirstPhotoAlt] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth > 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const photos = [
    { src: "/images/about/portrait.png", alt: "Father of Ahmed", x: "10%", y: "0px" },
    { src: "/images/about/hazem_ahmed.jpg", alt: "Family First", x: "-20%", y: "580px" },
    { src: "/images/about/desk.jpg", alt: "Craft over everything", x: "5%", y: "1160px" },
    { src: "/images/about/candid.jpg", alt: "Hazem Anwar", x: "-10%", y: "1740px" },
  ];

  const firstPhotoAlts = ["Father of Ahmed", "Product Designer", "Frontend Engineer"];

  useGSAP(() => {
    const introTl = gsap.timeline({ delay: 0.5 });

    // 1. Initial Cursor Animation
    introTl.fromTo(cursorRef.current, { opacity: 0, x: 800, y: 400 }, { opacity: 1, duration: 0.5 });
    introTl.to(cursorRef.current, {
      x: () => {
        const rect = titleRef.current?.getBoundingClientRect();
        return rect ? rect.left + 20 : 0;
      },
      y: () => {
        const rect = titleRef.current?.getBoundingClientRect();
        return rect ? rect.top + 40 : 0;
      },
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => setShowTitleBox(true)
    });

    introTl.to({}, { duration: 1 }); // Wait

    // 2. Sequential Typing for FIRST PHOTO ONLY (3 Strings)
    introTl.to(cursorRef.current, {
      x: () => {
        const el = document.getElementById("photo-0");
        const rect = el?.getBoundingClientRect();
        return rect ? rect.left + rect.width / 2 : 0;
      },
      y: () => {
        const el = document.getElementById("photo-0");
        const rect = el?.getBoundingClientRect();
        return rect ? rect.top + rect.height / 2 : 0;
      },
      duration: 0.8,
      ease: "power2.inOut",
      onStart: () => {
        setShowTitleBox(false);
        setActivePhotoIdx(-1);
      },
      onUpdate: () => {
        const x = gsap.getProperty(cursorRef.current, "x") as number;
        const y = gsap.getProperty(cursorRef.current, "y") as number;
        setCursorPos({ x, y });
      },
      onComplete: () => {
        setActivePhotoIdx(0);
        gsap.set(cursorRef.current, { opacity: 0 }); // Hide main cursor immediately when PhotoTag takes over
      }
    });

    // Sub-sequence for the 3 strings on the same photo
    firstPhotoAlts.forEach((text, i) => {
      introTl.to({}, { 
        duration: 3, 
        onStart: () => setFirstPhotoAlt(text) 
      });
      if (i < firstPhotoAlts.length - 1) {
        introTl.to({}, { duration: 0.5 }); 
      }
    });

    // Final stay and vanish
    introTl.to({}, { duration: 1 });
    introTl.to({}, {
      duration: 0.5,
      onStart: () => {
        setActivePhotoIdx(-1);
        setShowTitleBox(false);
      }
    });

    // introTl.to(cursorRef.current, { opacity: 0, scale: 0.8, duration: 0.5 }); // Removed as we hide it above

    // 3. Pinning
    if (window.innerWidth > 1024) {
      ScrollTrigger.create({
        trigger: "#hero-section",
        start: "top 140px",
        end: "bottom bottom",
        pin: leftColRef.current,
        pinSpacing: false,
        anticipatePin: 1
      });
    }

    // Reveals
    const reveals = gsap.utils.toArray<HTMLElement>(".reveal");
    reveals.forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-bg min-h-screen relative overflow-x-hidden">
      <NavbarLight />
      <div ref={cursorRef} className="fixed pointer-events-none z-[200] opacity-0 flex flex-row items-start font-sans">
        <svg width="24" height="24" viewBox="0 0 24 24" className="drop-shadow-md z-10 mt-1 mr-[-6px]">
          <path d="M5 3L19 10L12.5 13.5L9 20L5 3Z" fill="#a855f7" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        <div className="flex flex-col text-left mt-4" style={{ filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.4))" }}>
          <div className="bg-[#d8b4fe] text-black px-2 py-0.5 text-[10px] font-sans rounded-t-md w-max font-semibold border border-[#c084fc]/30">
            Hazem Anwar
          </div>
        </div>
      </div>

      {activePhotoIdx === 0 && (
        <PhotoTag 
          text={firstPhotoAlt} 
          active={true} 
          cursorPos={cursorPos} 
        />
      )}

      <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-24 lg:pt-[140px] relative z-10">
        <section id="hero-section" className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-20 items-start pb-6 lg:pb-40 relative">
          <div ref={leftColRef} className="reveal-pinned flex flex-col justify-start max-lg:pb-4 lg:pb-20">
            <span className="font-mono text-[13px] md:text-[15px] tracking-[0.25em] uppercase text-[#e4fe9a] mb-10 block">
              01 / The Book
            </span>
            <div className="relative inline-block mb-12">
              <h1 ref={titleRef} className="font-display text-[84px] md:text-[160px] leading-[0.85] tracking-[-0.02em] relative">
                ABOUT
              </h1>
              <FigmaBox label="h1 / Title" show={showTitleBox} />
            </div>
            <div className="flex flex-col gap-10">
              <p className="text-[24px] md:text-[34px] font-light leading-[1.3] text-text/90 max-w-[720px]">
                I&apos;ve spent 20+ years learning that{" "}
                <strong className="font-medium text-text border-b-2 border-[#e4fe9a]/60 pb-1">craft isn&apos;t a shortcut</strong> — it&apos;s the path.
                I design for those who crave clarity without sacrificing
                depth. I build things that move, feel intentional,
                and <em className="italic text-text/70">actually ship</em>.
              </p>
              <div className="space-y-12 mt-4">
                 <div className="flex flex-col">
                  <span className="font-mono text-[12px] text-[#e4fe9a] tracking-widest uppercase mb-4 opacity-80">01 / The Drive</span>
                  <p className="text-[17px] md:text-[20px] text-text/50 max-w-[620px] leading-[1.7] font-light">
                    I design for those who refuse to blend in. I craft digital experiences that are bold, memorable, and engineered to leave a lasting impact.
                  </p>
                 </div>
                 <div className="flex flex-col">
                  <span className="font-mono text-[12px] text-[#e4fe9a] tracking-widest uppercase mb-4 opacity-80">02 / The Off-Screen</span>
                  <p className="text-[17px] md:text-[20px] text-text/50 max-w-[620px] leading-[1.7] font-light">
                    When I&apos;m not pushing pixels, you&apos;ll find me in <strong className="text-text/70 font-medium italic">Minecraft</strong> — solving problems on the fly. It&apos;s the nerd side of me, and I&apos;m not sorry about it.
                  </p>
                 </div>
              </div>
            </div>
          </div>

          <div 
            ref={photoStackRef} 
            className="relative lg:pt-12 lg:min-h-[2600px] mb-2 lg:mb-20 max-lg:w-screen max-lg:-ml-[6vw] overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide no-scrollbar flex lg:block"
          >
            {/* On mobile, we use a flex layout with snap points. Spacing is maintained for clean section transitions. */}
            <div className="flex lg:contents gap-6 px-[6vw] pb-4 lg:pb-10 items-center">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  id={`photo-${i}`}
                  className="relative lg:absolute shrink-0 w-[85vw] md:w-[480px] aspect-[4/5] bg-bg border border-white/5 transition-all duration-700 ease-out hover:scale-[1.02] overflow-hidden rounded-lg lg:hover:z-50 group shadow-[0_30px_60px_rgba(0,0,0,0.4)] lg:shadow-[0_50px_100px_rgba(0,0,0,0.6)] snap-center"
                  style={{
                    transform: isDesktop 
                      ? `translate(${photo.x}, ${photo.y})` 
                      : 'none',
                    zIndex: 10 + i,
                  }}
                >
                  <img 
                    src={photo.src} 
                    alt={photo.alt} 
                    className="w-full h-full object-cover grayscale brightness-[0.8] rounded-lg hover:brightness-[1.1] hover:grayscale-0 hover:scale-[1.02] transition-all duration-700 pointer-events-none lg:pointer-events-auto" 
                  />
                  <FigmaBox label={`Image / 0${i+1}`} show={activePhotoIdx === i} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="bg-[#e4fe9a] w-[100vw] relative left-1/2 -translate-x-1/2 px-6 md:px-12 py-24 md:py-40 grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-0 lg:mt-24 mt-16 reveal containe">
          <div className="text-center md:px-12 md:border-r border-black/10">
            <div className="font-display text-[84px] md:text-[130px] leading-none text-bg tracking-[-0.04em]">5+</div>
            <div className="font-mono text-[14px] md:text-[16px] tracking-[0.3em] uppercase text-bg/40 mt-4 leading-none">Years Experience</div>
          </div>
          <div className="text-center md:px-12 md:border-r border-black/10">
            <div className="font-display text-[84px] md:text-[130px] leading-none text-bg tracking-[-0.04em]">20+</div>
            <div className="font-mono text-[14px] md:text-[16px] tracking-[0.3em] uppercase text-bg/40 mt-4 leading-none">Projects Shipped</div>
          </div>
          <div className="text-center md:px-12">
            <div className="font-display text-[84px] md:text-[130px] leading-none text-bg tracking-[-0.04em]">3</div>
            <div className="font-mono text-[14px] md:text-[16px] tracking-[0.3em] uppercase text-bg/40 mt-4 leading-none">Disciplines</div>
          </div>
        </div>

        {/* 01 — THE STORY */}
        <section className="py-32 border-t border-border mt-32">
          <div className="flex items-baseline gap-5 mb-16 reveal">
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#e4fe9a]">01</span>
            <h2 className="font-display text-[48px] md:text-[72px] leading-none tracking-[0.02em]">
              THE <span className="text-outline">STORY</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-16 reveal">
            <div className="hidden lg:block font-mono text-[11px] tracking-[0.2em] uppercase text-muted pt-2 opacity-40">
              <span className="block w-8 h-[1px] bg-white/20 mb-3" />
              Hazem Anwar
            </div>
            <div className="text-[18px] md:text-[20px] font-light leading-[1.8] text-text/80 space-y-8">
              <p>
                I&apos;m Hazem Anwar — a product designer and frontend engineer
                based in EMEA. What makes me different: <strong className="text-text font-medium border-b border-[#e4fe9a]/30 pb-px">I design and build</strong>.
                No handoff friction. No &quot;that&apos;s an engineering problem.&quot;
              </p>
              <div className="text-[24px] md:text-[28px] font-light italic text-text border-l-[3px] border-[#e4fe9a] pl-8 py-2 leading-relaxed opacity-90">
                Father. United supporter. Losing at FIFA to a four-year-old
                who has no business being that good.
              </div>
              <p>
                I studied Multimedia & Web Development at the Islamic University of Gaza —
                a place that taught me resourcefulness as much as technology.
                Today I work across the full product lifecycle: research, design,
                implementation, and quality assurance.
              </p>
            </div>
          </div>
        </section>

        {/* CAREER TIMELINE */}
        <section className="py-24 border-t border-border">
          <div className="flex items-baseline gap-5 mb-14 reveal">
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#e4fe9a]">02</span>
            <h2 className="font-display text-[36px] md:text-[64px] leading-none tracking-[0.02em]">
              CAREER <span className="text-outline">TIMELINE</span>
            </h2>
          </div>
          <div className="flex flex-col">
            {[
              { years: "2024 — Now", title: "Product Designer & Frontend Engineer", desc: "Full-stack design and engineering across booking, loyalty, and real estate platforms. Design systems, React implementation, and SQA.", company: "Freelance" },
              { years: "2022 — 2024", title: "Senior UX Designer", desc: "Led end-to-end product design for a loyalty and gamification platform serving 200k+ users. Built the company's first design system.", company: "Loyalty Co." },
              { years: "2020 — 2022", title: "UI/UX Designer", desc: "Designed mobile-first experiences for iOS and Android. Introduced component-based design thinking to the team.", company: "Tech Studio" },
              { years: "2019 — 2020", title: "Frontend Developer", desc: "Built responsive interfaces with React and Vue. Bridged the gap between design mockups and production code.", company: "Agency" },
            ].map((item, i) => (
              <div key={i} className="timeline-row grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-8 items-baseline py-7 border-b border-border hover:bg-white/[0.02] transition-colors group">
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted">{item.years}</span>
                <div>
                  <div className="text-[16px] font-medium mb-1 text-text">{item.title}</div>
                  <div className="text-[14px] text-muted max-w-[480px] leading-relaxed">{item.desc}</div>
                </div>
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#e4fe9a]">{item.company}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 03 — CORE FOUNDATIONS */}
        <section className="py-24 border-t border-border">
          <div className="flex items-baseline gap-5 mb-14 reveal">
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#e4fe9a]">03</span>
            <h2 className="font-display text-[36px] md:text-[64px] leading-none tracking-[0.02em]">
              CORE <span className="text-outline">FOUNDATIONS</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
            {[
              { num: "01", name: "People First", desc: "Every pixel, every component, every interaction exists to serve a human being. I start with why before I start with how." },
              { num: "02", name: "Commit to Craft", desc: "Lazy good enough isn't good enough. Every project deserves intention — in the typography, the animation, the edge cases." },
              { num: "03", name: "Adapt & Iterate", desc: "Plans change. Users surprise you. Great design adapts without losing its core intention. Ship, learn, improve." },
              { num: "04", name: "Connect the Dots", desc: "Design and engineering aren't separate disciplines — they're the same conversation. I speak both languages fluently." },
            ].map((item, i) => (
              <div key={i} className="foundation-item bg-bg p-8 md:p-9 hover:bg-white/[0.02] transition-colors">
                <div className="font-mono text-[11px] text-[#e4fe9a] tracking-[0.2em] mb-3">{item.num}</div>
                <div className="text-[18px] font-medium mb-2.5">{item.name}</div>
                <div className="text-[14px] text-muted leading-[1.7]">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 04 — CORE COMPETENCIES */}
        <section className="py-24 border-t border-border">
          <div className="flex items-baseline gap-5 mb-14 reveal">
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#e4fe9a]">04</span>
            <h2 className="font-display text-[36px] md:text-[64px] leading-none tracking-[0.02em]">
              CORE <span className="text-outline">COMPETENCIES</span>
            </h2>
          </div>
          <div className="flex flex-col">
            {[
              { icon: "◈", name: "Design Systems & Governance", desc: "Building scalable design languages and establishing governance frameworks that keep teams moving fast and aligned." },
              { icon: "◲", name: "Platform 0-to-1 Products", desc: "Taking products from zero to launch — defining vision, architecture, and experience across web and mobile surfaces." },
              { icon: "⊞", name: "Cross-Functional Delivery", desc: "Shipping design as code. Reducing handoff friction. Delivering production-ready components that match the design exactly." },
              { icon: "◇", name: "Strategic Product Thinking", desc: "Connecting business objectives to user needs. Knowing which problems are worth solving and in what order." },
              { icon: "∿", name: "Quality & SQA", desc: "Manual testing, UI/UX QA, and performance auditing. Shipping with confidence, not crossed fingers." },
              { icon: "◉", name: "Animation & Interaction", desc: "GSAP, Framer Motion, Three.js. Motion that feels intentional — not decoration, but communication." },
            ].map((item, i) => (
              <div key={i} className="comp-row grid grid-cols-[32px_1fr] md:grid-cols-[40px_200px_1fr] gap-8 items-start py-6 border-b border-border hover:bg-white/[0.018] transition-colors">
                <div className="w-8 h-8 border border-border flex items-center justify-center text-[14px] shrink-0">{item.icon}</div>
                <div className="text-[15px] font-medium pt-1.5 md:pt-1">{item.name}</div>
                <div className="hidden md:block text-[14px] text-muted leading-[1.65]">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 05 — TOOLKIT */}
        <Tools />

        {/* 06 — BEYOND WORK */}
        <section className="py-24 border-t border-border">
          <div className="flex items-baseline gap-5 mb-14 reveal">
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#e4fe9a]">06</span>
            <h2 className="font-display text-[36px] md:text-[64px] leading-none tracking-[0.02em]">
              BEYOND <span className="text-outline">WORK</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 reveal">
            <div className="hidden lg:block font-mono text-[11px] tracking-[0.2em] uppercase text-muted pt-1">
              <span className="block w-6 h-px bg-border mb-2.5" />
              Outside work
            </div>
            <div className="text-[17px] font-light leading-[1.85] text-text/80">
              <p>
                Father of Ahmed — the reason there&apos;s a Minecraft room in this portfolio.
                Manchester United supporter since before I understood what relegation meant.
                Video game enthusiast who takes co-op sessions more seriously than he should.
                Currently losing at FIFA to a four-year-old. It&apos;s humbling.
              </p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        {/* <section className="py-[120px] border-t border-border mt-12 reveal">
          <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted mb-5">Let&apos;s work together</div>
          <div className="font-display text-[56px] md:text-[120px] leading-[0.9] tracking-[-0.01em] mb-8">
            LET&apos;S<br />
            <span className="text-outline">TALK.</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:hazem.amrainana98@gmail.com" className="font-mono text-[11px] tracking-[0.18em] uppercase text-bg bg-[#e4fe9a] px-6 py-4 font-bold hover:bg-[#e4fe9a]/80 transition-all shadow-lg shadow-[#e4fe9a]/10">
              hazem.amrainana98@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/hazem-anwar98" target="_blank" className="font-mono text-[11px] tracking-[0.18em] uppercase text-text border border-border px-6 py-4 hover:bg-text hover:text-bg transition-all">
              LinkedIn ↗
            </a>
            <a href="https://www.behance.net/hazem-anwar" target="_blank" className="font-mono text-[11px] tracking-[0.18em] uppercase text-text border border-border px-6 py-4 hover:bg-text hover:text-bg transition-all">
              Behance ↗
            </a>
          </div>
        </section> */}

         <InternalFooter />
      </main>
    </div>
  );
}
