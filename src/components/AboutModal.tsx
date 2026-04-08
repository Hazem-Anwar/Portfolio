"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { getLenis } from "@/lib/lenis";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const timelineData = [
  {
    years: "2023 — NOW",
    role: "Front-End Web Developer",
    company: "DaleelStore",
    desc: "Spearheading the front-end architecture and user experience for the region's leading gaming and digital cards marketplace.",
    image: "/images/exps/daleel.svg",
  },
  {
    years: "2022 — 2023",
    role: "Product Designer",
    company: "DROPIFY",
    desc: "Crafting scalable e-commerce solutions and design systems.",
    image: "/images/exps/dropify.svg",
  },
  {
    years: "2020 — 2022",
    role: "Product Designer & Front-End Developer",
    company: "Optimal Pass",
    desc: "Developed responsive web applications with a focus on performance and UX.",
    image: "/images/exps/otimal.svg",
  },
  {
    years: "2017 — 2020",
    role: "Product Designer & Front-End Developer",
    company: "Al-Wisata Real Estate",
    desc: "Built modern interfaces for the real estate market in Saudi Arabia.",
    image: "/images/exps/wsata.svg",
  },
];

const skills = [
  {
    category: "DESIGN",
    items: [
      "UI/UX Strategy",
      "Design Systems Architecture",
      "Advanced Prototyping",
      "Information Architecture",
      "User Research & Testing",
      "Visual Identity",
      "Accessibility (WCAG)",
    ],
  },
  {
    category: "FRONTEND",
    items: [
      "React / Next.js",
      "TypeScript",
      "Tailwind CSS",
      "GSAP / Framer Motion",
      "WebGL / Three.js",
      "Performance Optimization",
      "Git / CI/CD",
    ],
  },
];

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = getLenis();
    const isMobile = window.innerWidth < 768;
    let tl: gsap.core.Timeline | null = null;

    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      lenis?.stop();

      // FIXING GLITCH: Precise entrance sequence for backdrop and modal
      gsap.to(backdropRef.current, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      if (isMobile) {
        tl.fromTo(
          modalRef.current,
          { y: "100%", opacity: 1 },
          { y: "0%", opacity: 1, duration: 0.8 },
        );
      } else {
        tl.fromTo(
          modalRef.current,
          { scale: 0.96, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8 },
        );
      }

      tl.fromTo(
        ".animate-el",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, clearProps: "all" },
        "-=0.55",
      );
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      lenis?.start();

      if (isMobile) {
        gsap.to(modalRef.current, {
          y: "100%",
          duration: 0.45,
          ease: "power2.in",
        });
      } else {
        gsap.to(modalRef.current, {
          scale: 0.96,
          opacity: 0,
          y: 40,
          duration: 0.35,
          ease: "power2.in",
        });
      }
      gsap.to(backdropRef.current, {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.in",
      });
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      lenis?.start();
      tl?.kill();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        .modal-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .modal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb {
          background: #eee;
          border-radius: 10px;
        }
      `}</style>

      <div
        ref={backdropRef}
        className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-md invisible opacity-0"
        onClick={onClose}
      >
        <div
          ref={modalRef}
          className="bg-white w-full md:max-w-[780px] h-[90vh] md:h-auto md:max-h-[85vh] rounded-t-[32px] md:rounded-[24px] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.12)] relative flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER — CLEAN WHITE */}
          <div className="px-6 md:px-10 py-6 md:py-8 border-b border-[#f0f0f0] flex flex-row items-start justify-between gap-4 bg-white z-10 shrink-0 relative animate-el">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                <h1 className="font-bricolage font-extrabold text-[20px] md:text-[26px] text-[#111] leading-none tracking-tight shrink-0">
                  Hazem Anwar<span className="text-[#ff4d00]">.</span>
                </h1>
                <div className="flex md:hidden items-center translate-y-[-1px] shrink-0">
                  <Image
                    src="/images/about/verified.png"
                    alt="Verified"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-[9px] md:text-[10px] font-bold tracking-[0.1em] text-[#888] uppercase max-w-[200px] md:max-w-none">
                  Senior Frontend Engineer & Product Designer
                </p>
                <div className="hidden md:flex items-center translate-y-[-1px] shrink-0">
                  <Image
                    src="/images/about/verified.png"
                    alt="Verified"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 md:w-9 md:h-9 bg-[#f5f5f5] hover:bg-[#111] hover:text-white rounded-full flex items-center justify-center transition-all shrink-0"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* SCROLLABLE BODY — LIGHT MODE */}
          <div
            className="flex-1 overflow-y-auto modal-scrollbar p-8 md:p-10 flex flex-col gap-10 bg-white text-[#111]"
            data-lenis-prevent
          >
            {/* 01: SUMMARY */}
            <section className="animate-el">
              <span className="block font-mono text-[10px] font-bold text-[#2c2c2c] uppercase tracking-[0.1em] mb-4">
                Summary
              </span>
              <p className="text-[14px] md:text-[15.5px] text-[#111] leading-relaxed font-medium max-w-[580px]">
                I specialize in bridging the gap between design and production.
                By focusing on scalable systems and interface logic, I build
                products that function as beautifully as they look 🚀.
              </p>
            </section>

            {/* 02: EXPERIENCE LISTING */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0] animate-el">
                <span className="font-mono text-[10px] font-bold text-[#2c2c2c] uppercase tracking-[0.1em]">
                  Experience
                </span>
                <span className="font-mono text-[8px] text-[#ccc] hidden md:block select-none">
                  / 02
                </span>
              </div>

              <div className="flex flex-col">
                {timelineData.map((item, i) => (
                  <div
                    key={i}
                    className="group py-6 border-b border-[#f5f5f5] last:border-0 -mx-6 px-6 md:-mx-10 md:px-10 hover:bg-[#fafafa] transition-colors rounded-xl animate-el"
                  >
                    <div className="flex flex-col items-start md:flex-row md:items-start gap-5 md:gap-8">
                      <div className="shrink-0 w-8 md:w-10 pt-1 flex md:justify-center">
                        <Image
                          src={item.image}
                          alt={item.company}
                          width={28}
                          height={28}
                          className="object-contain opacity-100"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                          <div className="flex flex-col gap-1.5">
                            <h4 className="font-bricolage font-extrabold text-[15px] md:text-[16px] text-[#111] leading-tight">
                              {item.role}
                            </h4>
                            <span className="text-[#888] font-bold text-[10px] md:text-[11px] uppercase tracking-widest leading-none">
                              {item.company}
                            </span>
                          </div>
                          <span className="inline-flex font-mono text-[10px] font-extrabold text-[#111] bg-[#f5f5f5] px-2.5 py-1 rounded border border-[#eee] w-fit uppercase tracking-tighter self-start transition-colors group-hover:bg-white group-hover:border-[#111]">
                            {item.years}
                          </span>
                        </div>
                        <p className="text-[13.5px] md:text-[14px] text-[#666] leading-relaxed max-w-[550px] font-medium transition-opacity">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 03: EXPERTISE SECTION */}
            <div className="flex flex-col gap-6 pb-8">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0] animate-el">
                <span className="font-mono text-[10px] font-bold text-[#2c2c2c] uppercase tracking-[0.1em]">
                  Expertise
                </span>
                <span className="font-mono text-[8px] text-[#ccc] hidden md:block select-none">
                  / 03
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
                {skills.map((s, i) => (
                  <div key={i} className="flex flex-col gap-4 animate-el">
                    <h5 className="font-mono text-[10px] font-bold text-[#111] uppercase tracking-widest">
                      {i === 0 ? "🏛️ " : "💻 "}
                      {s.category}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {s.items.map((item, j) => (
                        <span
                          key={j}
                          className="px-3 py-1 bg-[#f8f8f8] text-[#777] text-[11px] font-bold rounded-md border border-[#eee] hover:border-[#111] hover:bg-white hover:text-[#111] transition-all duration-300 cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                      <div className="relative group/counter">
                        <span className="px-3 py-1 bg-[#ededed] text-[#555] text-[11px] font-black rounded-md border border-[#eee] hover:border-[#111] hover:bg-white hover:text-[#111] transition-all duration-300 cursor-help active:bg-[#111] active:text-white">
                          {s.category === "DESIGN" ? "+ 15 More" : "+ 24 More"}
                        </span>
                        <div className="fixed md:absolute bottom-6 md:bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-5 py-4 bg-[#111] text-white rounded-2xl shadow-2xl opacity-0 invisible translate-y-2 group-hover/counter:opacity-100 group-hover/counter:visible group-hover/counter:translate-y-0 group-active/counter:opacity-100 group-active/counter:visible group-active/counter:translate-y-0 transition-all duration-500 z-[300] w-[min(320px,85vw)] pointer-events-none border border-white/10">
                          <div className="flex flex-col gap-3">
                            <span className="text-[9px] font-mono font-bold text-[#666] uppercase tracking-[0.2em] border-b border-white/10 pb-2">
                              Full Expertise Registry
                            </span>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                              {(s.category === "DESIGN"
                                ? [
                                    "Figma Adv.",
                                    "Adobe PS",
                                    "Adobe AI",
                                    "Principle",
                                    "Lottie",
                                    "Color Theory",
                                    "Typography",
                                    "User Testing",
                                    "A/B Testing",
                                    "Aesthetic Str.",
                                    "Wireframing",
                                    "Handoff Logic",
                                    "Style Guides",
                                    "Micro-int.",
                                    "Design Psych.",
                                  ]
                                : [
                                    "Redux",
                                    "Zustand",
                                    "Storybook",
                                    "Unit Testing",
                                    "E2E Testing",
                                    "Vite",
                                    "TurboRepo",
                                    "Web Vitals",
                                    "Sanity CMS",
                                    "Headless UI",
                                    "Shadcn UI",
                                    "Framer Motion",
                                    "Three.js",
                                    "GLSL",
                                    "APIs",
                                    "Axios",
                                    "GraphQL",
                                    "SWR",
                                    "React Query",
                                    "Hooks",
                                    "PWA",
                                    "SEO Core",
                                    "A11y",
                                    "Audit",
                                  ]
                              ).map((h, k) => (
                                <div
                                  key={k}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                  <span className="text-[10px] font-bold text-white/70 whitespace-nowrap">
                                    {h}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111] rotate-45 border-r border-b border-white/10"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER — REFINED OFF-WHITE */}
          <div className="px-8 md:px-10 py-5 md:py-6 border-t border-[#f0f0f0] flex flex-col sm:flex-row items-center justify-between bg-[#f9f9f9] shrink-0 z-10 gap-4 sm:gap-0 animate-el">
            <a
              href="https://drive.google.com/file/d/1uUFMJ2NaeOPF3ufMFYJr4aET6Q4CH37F/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 bg-white hover:bg-[#111] hover:text-white text-[#111] px-4 py-2 rounded-full transition-all duration-300 shadow-sm border border-[#eee]"
            >
              <div className="w-6 h-6 bg-[#ff4d00] rounded-[4px] flex items-center justify-center shrink-0 transition-colors">
                <span className="text-white text-[10px] font-black tracking-tighter leading-none">
                  PDF
                </span>
              </div>
              <span className="font-bricolage font-extrabold text-[13.5px] tracking-tight text-[#111] group-hover:text-white transition-colors">
                Resume.PDF
              </span>
              <div className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center transition-all group-hover:bg-white/10 ml-1">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </a>
            <div className="flex items-center gap-5 md:gap-7 font-mono text-[9px] font-bold uppercase tracking-widest text-[#888]">
              <a
                href="mailto:hazem.amrainana98@gmail.com"
                className="flex items-center gap-2 transition-opacity hover:opacity-70 group/social"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#111]"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 18h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7.5" />
                  <path d="M3 6l9 6l9 -6" />
                  <path d="M15 18h6" />
                  <path d="M18 15l3 3l-3 3" />
                </svg>
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/hazem-anwar98/"
                target="_blank"
                className="flex items-center gap-2 transition-opacity hover:opacity-70 group/social"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#0077B5]"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 11v5" />
                  <path d="M8 8v.01" />
                  <path d="M12 16v-5" />
                  <path d="M16 16v-3a2 2 0 1 0 -4 0" />
                  <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10" />
                </svg>
                LinkedIn
              </a>
              <a
                href="https://wa.me/972567370003"
                target="_blank"
                className="flex items-center gap-2 transition-opacity hover:opacity-70 group/social"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#25D366]"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                  <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
