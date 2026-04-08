"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavbarLight from "@/components/NavbarLight";
import LineFooter from "@/components/LineFooter";
import LogoSlider from "@/components/LogoSlider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Replicating HeroLight helper components for identical look
function TypewriterText({ text, active }: { text: string; active: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  const type = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => (index <= iteration ? text[index] : ""))
          .join(""),
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

function SignatureTypewriter({
  text,
  delay = 0.5,
}: {
  text: string;
  delay?: number;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!textRef.current) return;
    const tl = gsap.timeline({ delay });
    tl.fromTo(
      textRef.current,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: text.length * 0.05,
        ease: "none",
      },
    );
  }, [text, delay]);
  return (
    <span className="relative inline-flex items-center min-h-[1.2em]">
      <span
        ref={textRef}
        className="relative block whitespace-nowrap pr-1"
        style={{ clipPath: "inset(0 100% 0 0)" }}
      >
        {text}
      </span>
    </span>
  );
}

const timelineData = [
  {
    years: "2024 — NOW",
    role: "Product Designer & Front-End Engineer",
    company: "Freelance",
  },
  { years: "2022 — 2024", role: "Senior UX Designer", company: "Loyalty Co." },
  { years: "2020 — 2022", role: "UI/UX Designer", company: "Tech Studio" },
];

const competencies = [
  {
    title: "Design Systems",
    desc: "Modular foundations for scalable products.",
  },
  { title: "Technical UX", desc: "Bridging pixels and production code." },
  { title: "Interaction", desc: "Motion design with purpose." },
];

export default function AboutPage() {
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const imgCardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  const [isHoveredWork, setIsHoveredWork] = useState(false);

  useEffect(() => {
    // 1. Initial Hero Animations (Identical to HeroLight)
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to("nav", { opacity: 1, y: 0, duration: 0.8, startAt: { y: -20 } }, 0.1);
    tl.to("#hero-signature", { opacity: 1, duration: 0.8 }, 0.4);
    tl.to(
      headingRef.current,
      { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20 } },
      "-=0.6",
    );
    tl.to(
      descRef.current,
      { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20 } },
      "-=0.65",
    );
    tl.to(
      skillsRef.current,
      { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20 } },
      "-=0.7",
    );
    tl.to(
      btnsRef.current,
      { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20 } },
      "-=0.7",
    );
    tl.to(
      "#hero-logos",
      { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20 } },
      "-=0.7",
    );
    tl.to(
      imgCardRef.current,
      { opacity: 1, y: 0, duration: 0.9, startAt: { y: 40 } },
      "-=0.8",
    );
    tl.to(
      badgeRef.current,
      { opacity: 1, scale: 1, duration: 0.6, startAt: { scale: 0.5 } },
      "-=0.4",
    );
    tl.to("#glow-1", { opacity: 1, duration: 3, ease: "power2.out" }, 0.5);

    // 2. Smooth Scroll to About Content
    const scrollTimeout = setTimeout(() => {
      if (scrollSectionRef.current) {
        window.scrollTo({
          top: scrollSectionRef.current.offsetTop - 80,
          behavior: "smooth",
        });
      }
    }, 1500); // Wait for hero animation to breathe

    // 3. Reveal Animations for About Content
    const reveals = gsap.utils.toArray<HTMLElement>(".reveal");
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    });

    return () => clearTimeout(scrollTimeout);
  }, []);

  return (
    <div className="bg-white text-[#111] selection:bg-[#ff4d00] selection:text-white font-inter overflow-x-hidden min-h-screen">
      <NavbarLight />

      {/* IDENTICAL HERO SECTION */}
      <section className="w-full bg-[#fff] mt-20 lg:pt-6 flex flex-col relative overflow-hidden">
        <div
          className="absolute top-[-5%] left-[-10%] w-[450px] h-[450px] bg-[#0000001a] blur-[180px] rounded-full z-0 opacity-0 animate-[pulse_15s_ease-in-out_infinite]"
          id="glow-1"
        />
        <div className="container-custom pt-[80px] pb-40 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-14 lg:gap-16 items-center w-full">
            <div className="flex flex-col lg:pt-10 z-10 min-w-0 order-2 md:order-1">
              <h6
                className="text-[#111] text-[22px] md:text-[26px] font-['Caveat'] font-bold opacity-0 -rotate-1"
                id="hero-signature"
              >
                <SignatureTypewriter text="Hazem Anwar" delay={0.7} />
              </h6>
              <h1
                ref={headingRef}
                className="font-bricolage font-extrabold mt-4 text-[clamp(2.5rem,6vw,44px)] leading-[1.1] tracking-[-0.03em] text-[#111] opacity-0"
              >
                Design-Driven <br /> Front-End Engineer
                <span className="text-[#ff4d00]">.</span>
              </h1>
              <p
                ref={descRef}
                className="mt-4 md:mt-6 text-[#888] leading-[1.6] text-[14px] md:text-[15px] opacity-0 max-w-[450px]"
              >
                Front-end Engineer & UX/UI Designer crafting scalable,
                high-performance interfaces with a strong focus on UX, detail,
                and bridging design with development.
              </p>
              <div
                ref={btnsRef}
                className="md:mt-8 mt-4 flex flex-row flex-wrap items-center gap-3 md:gap-4 opacity-0 text-[12px] uppercase tracking-widest font-bold"
              >
                {/* Re-using buttons but focusing on the scroll effect */}
                <button
                  onMouseEnter={() => setIsHoveredWork(true)}
                  onMouseLeave={() => setIsHoveredWork(false)}
                  className="group bg-[#111] text-white px-8 py-3 rounded-full transition-all flex items-center gap-2 overflow-hidden min-w-[160px]"
                >
                  <TypewriterText text="View Work" active={isHoveredWork} />
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="transition-transform group-hover:rotate-45"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </button>
              </div>
              <div
                ref={skillsRef}
                className="mt-8 text-[13px] md:text-[15px] text-[#555] font-medium opacity-0"
              >
                React • Next.js • UX/UI • Performance
              </div>
            </div>
            <div className="relative flex justify-center md:pe-10 order-1 md:order-2 pt-12 md:pt-0">
              <div
                ref={imgCardRef}
                className="w-[220px] h-[280px] md:w-[300px] md:h-[400px] shadow-lg rounded-[24px] bg-[#eee] overflow-hidden relative opacity-0"
              >
                <Image
                  src="/images/about/portrait.png"
                  alt="Hazem Anwar"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div
                ref={badgeRef}
                className="absolute md:-bottom-6 -bottom-10 md:-right-6 right-2 md:w-[120px] md:h-[120px] w-[100px] h-[100px] bg-white rounded-full shadow-2xl flex items-center justify-center z-20 opacity-0 scale-50"
              >
                <span className="text-2xl font-extrabold text-[#111]">6+</span>
              </div>
            </div>
          </div>
          <div className="mt-20 opacity-0" id="hero-logos">
            <LogoSlider />
          </div>
        </div>
      </section>

      {/* COMPACT ABOUT CONTENT - SCROLL TARGET */}
      <main
        ref={scrollSectionRef}
        className="max-w-[1100px] mx-auto px-6 md:px-12 pt-10 pb-10"
      >
        <section className="reveal mb-16 md:mb-24 pt-12 border-t-2 border-[#111]/5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-10 md:gap-20 items-start">
            <div className="flex flex-col gap-10">
              <div>
                <span className="block font-mono text-[10px] tracking-[0.3em] uppercase text-[#ff4d00] mb-6">
                  GENERAL / ABOUT ME
                </span>
                <p className="text-[20px] md:text-[24px] leading-[1.5] text-[#111] font-medium max-w-[650px]">
                  I’m Hazem, Product Designer & Front-End Engineer with over 6
                  years of experience. I build scalable product systems and
                  high-logic interfaces, prioritizing functional logic over
                  decoration. Currently shaping high-stakes infrastructure and
                  complex financial flows.
                </p>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer border-b-2 border-[#111] w-max pb-1">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  className="font-bricolage font-extrabold text-[20px]"
                >
                  Resume.PDF
                </a>
                <span className="font-mono text-[11px] text-[#ff4d00]">
                  ← Preview
                </span>
              </div>
            </div>
            <div className="hidden md:block pt-10">
              <div className="p-6 bg-[#fafafa] rounded-[24px] border border-[#eee]">
                <span className="block font-mono text-[9px] tracking-widest text-[#888] mb-4 uppercase">
                  Currently Based
                </span>
                <p className="font-bold text-[15px]">
                  EMEA Region / Available Worldwide
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPACT TIMELINE */}
        <section className="reveal mb-16 md:mb-24 pt-12 border-t border-[#eee]">
          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-8">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#888]">
              TIMELINE
            </span>
            <div className="flex flex-col gap-6">
              {timelineData.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-10 pb-6 border-b border-[#f5f5f5] last:border-0 hover:ps-2 transition-all"
                >
                  <h3 className="font-bricolage font-bold text-[18px] md:text-[20px]">
                    {item.role}
                  </h3>
                  <div className="flex items-center gap-4 text-[13px] font-mono text-[#888]">
                    <span className="font-bold text-[#111]">
                      {item.company}
                    </span>
                    <span className="w-1 h-1 bg-[#ff4d00] rounded-full"></span>
                    <span>{item.years}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERTISE */}
        <section className="reveal mb-20 md:mb-32 pt-12 border-t border-[#eee]">
          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-8">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#888]">
              EXPERTISE
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {competencies.map((item, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <h4 className="font-bricolage font-bold text-[16px] uppercase tracking-tight text-[#ff4d00]">
                    {item.title}
                  </h4>
                  <p className="text-[14px] text-[#555] leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MINI CONTACT */}
        <section className="reveal text-center py-12 md:py-24 bg-[#111] text-white rounded-[40px] mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff4d00] blur-[150px] opacity-20"></div>
          <h2 className="font-bricolage font-extrabold text-[32px] md:text-[56px] tracking-tight mb-10 relative z-10">
            Let&apos;s build something <br /> unconventional
            <span className="text-[#ff4d00]">.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-10 font-mono text-[11px] font-bold uppercase tracking-[0.2em] relative z-10">
            <a
              href="mailto:hazem.amrainana98@gmail.com"
              className="hover:text-[#ff4d00] transition-colors"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/hazem-anwar98/"
              target="_blank"
              className="hover:text-[#ff4d00] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://behance.net/hazem-anwar"
              target="_blank"
              className="hover:text-[#ff4d00] transition-colors"
            >
              Behance
            </a>
          </div>
        </section>
      </main>

      <LineFooter />
    </div>
  );
}
