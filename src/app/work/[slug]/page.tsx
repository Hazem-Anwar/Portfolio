"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/all";
import { cases } from "@/data/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);
}



export default function CaseStudy({ params }: { params: { slug: string } }) {
  const c = cases.find((item) => item.slug === params.slug);
  if (!c) notFound();

  // Gallery Data
  const allProjectImages = [c.image, ...(c.images || [])].filter(
    (img): img is string => !!img,
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, { type: "lines" });
      gsap.fromTo(
        split.lines,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        },
      );
    }
  }, []);

  useEffect(() => {
    if (selectedIndex !== null && sliderRef.current) {
      gsap.to(sliderRef.current, {
        x: -selectedIndex * 100 + "%",
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== null && sliderRef.current) {
      const d = Draggable.create(sliderRef.current, {
        type: "x",
        onDragEnd: function () {
          const threshold = window.innerWidth / 4;
          const diff = this.x - -selectedIndex * window.innerWidth;
          if (diff > threshold)
            setSelectedIndex((p) =>
              p! > 0 ? p! - 1 : allProjectImages.length - 1,
            );
          else if (diff < -threshold)
            setSelectedIndex((p) =>
              p! < allProjectImages.length - 1 ? p! + 1 : 0,
            );
          else
            gsap.to(sliderRef.current, {
              x: -selectedIndex! * 100 + "%",
              duration: 0.4,
            });
        },
      });
      return () => {
        if (d[0]) d[0].kill();
      };
    }
  }, [selectedIndex, allProjectImages.length]);

  useEffect(() => {
    if (selectedIndex !== null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [selectedIndex]);

  useEffect(() => {
    let rafId: number;
    let scrollers: HTMLElement[] = [];

    const updateScrollers = () => {
      scrollers = Array.from(
        document.querySelectorAll('[data-auto-scroll="true"]'),
      );
    };

    const step = () => {
      if (scrollers.length === 0) updateScrollers();

      scrollers.forEach((s) => {
        const isHovered = s.matches(":hover");
        if (!isHovered) {
          s.scrollTop += 0.7; // Ultra smooth slow scan
          if (s.scrollTop + s.clientHeight >= s.scrollHeight - 2) {
            s.scrollTop = 0;
          }
        }
      });
      rafId = requestAnimationFrame(step);
    };

    // Initial check and periodic refresh in case of dynamic renders
    updateScrollers();
    const interval = setInterval(updateScrollers, 2000);

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowLeft")
        setSelectedIndex((p) =>
          p! > 0 ? p! - 1 : allProjectImages.length - 1,
        );
      if (e.key === "ArrowRight")
        setSelectedIndex((p) =>
          p! < allProjectImages.length - 1 ? p! + 1 : 0,
        );
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, allProjectImages.length]);

  return (
    <main className="bg-white min-h-screen font-inter text-[#111] selection:bg-[#111] selection:text-white pb-32 relative">
      {/* FIXED BACK BUTTON */}
      <div className="fixed top-12 left-12 z-[1000]">
        <Link
          href="/work"
          className="w-12 h-12 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] flex items-center justify-center transition-colors shadow-sm"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      <div className="max-w-[720px] mx-auto px-6 space-y-12">
          {/* HEADER */}
        <section className="pt-40 space-y-8">
          <div className="space-y-4">
            <h1
              ref={titleRef}
              className="text-[32px] md:text-[44px] font-bold leading-[1.1] tracking-tight uppercase text-[#111]"
            >
              {c.title}
            </h1>
            {c.subtitle && (
              <p className="text-[18px] md:text-[24px] font-bold text-[#111]  uppercase  mt-4">
                {c.subtitle}
              </p>
            )}
            <p className="text-[16px] text-[#555] leading-[1.6] max-w-[640px]">
              {c.description}
            </p>
          </div>

          {/* PROJECT META: HIGH-FIDELITY BRANDED BAR (OFFICIAL SVG PATHS) */}
          {!c.hideStack && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-10 border-y border-black/5">
              {/* ECOSYSTEM */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#aaa]">
                  Ecosystem
                </span>
                <div className="flex items-center gap-6">
                  {/* iOS */}
                  <div className="flex items-center gap-2 group cursor-default">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 384 512"
                      fill="currentColor"
                    >
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                    <span className="text-[12px] font-bold text-[#111]">iOS</span>
                  </div>
                  {/* Android */}
                  <div className="flex items-center gap-2 group cursor-default">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#3DDC84"
                    >
                      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9997.9993-.9997c.5511 0 .9993.4486.9993.9997.0001.5511-.4482.9997-.9993.9997zM6.477 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9997.9993-.9997c.5511 0 .9993.4486.9993.9997.0001.5511-.4482.9997-.9993.9997zM17.885 10.587l1.733-3.0022a.498.498 0 00-.099-.6897.498.498 0 00-.6897.099l-1.751 3.0336c-1.482-.6769-3.136-1.0543-4.897-1.0543s-3.415.3774-4.897 1.0543L5.5343 6.9941a.498.498 0 00-.6897-.099.498.498 0 00-.099.6897l1.733 3.0022c-2.923 1.4801-4.975 4.417-5.321 7.89H19.337v-.001c-.347-3.473-2.399-6.411-5.321-7.89z" />
                    </svg>
                    <span className="text-[12px] font-bold text-[#111]">
                      Android
                    </span>
                  </div>
                  {/* Web Platform */}
                  <div className="flex items-center gap-2 group cursor-default">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4285F4"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18"
                      />
                    </svg>
                    <span className="text-[12px] font-bold text-[#111]">
                      Web Site
                    </span>
                  </div>
                </div>
              </div>

              {/* VERTICAL DIVIDER */}
              <div className="hidden md:block w-px h-12 bg-black/5" />

              {/* DESIGN STACK */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#aaa]">
                  Design Stack
                </span>
                <div className="flex items-center gap-6">
                  {/* FIGMA (PERFECT FIDELITY) */}
                  <div className="flex items-center gap-2">
                    <svg
                      width="15"
                      height="22"
                      viewBox="0 0 38 57"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 0H9.5C4.2533 0 0 4.2533 0 9.5C0 14.7467 4.2533 19 9.5 19H19V0Z"
                        fill="#F24E1E"
                      />
                      <path
                        d="M38 9.5C38 4.2533 33.7467 0 28.5 0H19V19H28.5C33.7467 19 38 14.7467 38 9.5Z"
                        fill="#FF7262"
                      />
                      <path
                        d="M19 19H9.5C4.2533 19 0 23.2533 0 28.5C0 33.7467 4.2533 38 9.5 38H19V19Z"
                        fill="#A259FF"
                      />
                      <path
                        d="M19 19H28.5C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38H19V19Z"
                        fill="#1ABCFE"
                      />
                      <path
                        d="M19 38H9.5C4.2533 38 0 42.2533 0 47.5C0 52.7467 4.2533 57 9.5 57C14.7467 57 19 52.7467 19 47.5V38Z"
                        fill="#0ACF83"
                      />
                    </svg>
                    <span className="text-[12px] font-bold text-[#111]">
                      Figma
                    </span>
                  </div>
                  {/* PHOTOSHOP (REAL TILE) */}
                  <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] bg-[#001E36] rounded-[2px] flex items-center justify-center border border-white/5 shadow-sm">
                      <span className="text-[#31A8FF] font-black text-[7px] tracking-tighter">
                        Ps
                      </span>
                    </div>
                    <span className="text-[12px] font-bold text-[#111]">
                      Photoshop
                    </span>
                  </div>
                  {/* ILLUSTRATOR (REAL TILE) */}
                  <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] bg-[#330000] rounded-[2px] flex items-center justify-center border border-white/10 shadow-sm">
                      <span className="text-[#FF9A00] font-black text-[7px] tracking-tighter">
                        Ai
                      </span>
                    </div>
                    <span className="text-[12px] font-bold text-[#111]">
                      Illustrator
                    </span>
                  </div>
                </div>
              </div>

              {/* VERTICAL DIVIDER */}
              {(c.link || c.bgColor) && (
                <div className="hidden md:block w-px h-12 bg-black/5" />
              )}

              {/* LIVE CTA */}
              <div className="flex items-center">
                {c.link && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-end gap-1 text-[#111] hover:text-[#FF5C00] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-black uppercase tracking-wider">
                        Live View
                      </span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                    <div className="h-[2.5px] w-0 group-hover:w-full bg-[#FF5C00] transition-all duration-300" />
                  </a>
                )}
              </div>
            </div>
          )}
        </section>

        {/* CORE STORYTELLING */}
        <section className="space-y-12">
          {c.detailedSections ? (
            c.detailedSections.map((section, index: number) => (
              <div
                key={index}
                className="space-y-8 pb-12 border-b border-black/5 last:border-0 last:pb-0"
              >
                <div
                  onClick={() => {
                    const imgIndex = allProjectImages.indexOf(section.image);
                    if (imgIndex !== -1) setSelectedIndex(imgIndex);
                  }}
                  className={`w-full rounded-2xl overflow-hidden cursor-zoom-in group border border-black/5 ${section.title.includes("Data Visualization") ? "bg-[#f1f1f1] mb-4" : "bg-[#f7f7f7]"}`}
                >
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                    className={`${section.title.includes("Data Visualization") ? "rounded-lg shadow-2xl" : "group-hover:scale-[1.02] transition-transform duration-700"}`}
                  />
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h2 className="text-[16px] font-bold uppercase tracking-wider text-[#111]">
                      {section.title}
                    </h2>
                    {section.subTitle && (
                      <p className="text-[14px] font-medium text-[#888] leading-tight">
                        {section.subTitle}
                      </p>
                    )}
                  </div>
                  <div className="text-[16px] text-[#555] leading-[1.7] whitespace-pre-line">
                    {section.content}
                  </div>
                </div>

                {/* LANDING PREVIEW WRAPPER (ELITE #F1F1F1 ZONE) */}
                {section.title.includes("Smart Stay") &&
                  (c.slug === "places" || c.slug === "althowre") && (
                    <div className="mt-12 bg-[#f1f1f1] p-8 md:p-4 lg:p-6 rounded-[16px] border border-black/5">
                      <div className="space-y-8">
                        <div className="space-y-3 max-w-[500px]">
                          <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#888]">
                            Experience Loop
                          </span>
                          <h3 className="text-[16px] md:text-[20px] font-black text-[#111] leading-tight">
                            Full HomePage Scroll.
                          </h3>
                        </div>
                        <div className="relative group w-full h-[45vh] md:h-[65vh] rounded-xl bg-white border border-black/5 overflow-hidden shadow-sm">
                          {/* THE SCROLLING ENGINE (NEW INTERACTIVE AUTO-SCROLL) */}
                          <div
                            data-auto-scroll="true"
                            className="absolute inset-0 overflow-y-auto scrollbar-hide flex flex-col items-center cursor-ns-resize scroll-smooth"
                          >
                            <div className="w-full relative">
                              <Image
                                src="/images/Projects/places/landing.png"
                                alt="Landing Full"
                                width={1400}
                                height={10000}
                                className="w-full h-auto"
                                priority
                              />
                            </div>
                          </div>
                          {/* SUBTLE INDICATOR */}
                          <div className="absolute bottom-6 left-6 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity">
                            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5 shadow-sm scale-90">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#111]">
                                Interactive Preview
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ))
          ) : (
            <>
              {/* IMAGE 01: HERO COVER */}
              <div
                onClick={() => setSelectedIndex(0)}
                className="w-full rounded-2xl overflow-hidden bg-[#f7f7f7] cursor-zoom-in group border border-black/5"
              >
                <Image
                  src={c.image || ""}
                  alt={c.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                  className="group-hover:scale-[1.02] transition-transform duration-700"
                  priority
                />
              </div>

              {/* TEXT 01: RESEARCH */}
              <div className="space-y-2">
                <h2 className="text-[16px] font-bold uppercase tracking-wider">
                  Research & Discovery
                </h2>
                <div className="text-[16px] text-[#555] leading-[1.8] space-y-4">
                  <p>{c.approach}</p>
                </div>
              </div>

              {/* IMAGE 02: ARCHITECTURE VIEW */}
              {c.images?.[1] && (
                <div
                  onClick={() => setSelectedIndex(1)}
                  className="w-full rounded-2xl overflow-hidden bg-[#fafafa] cursor-zoom-in border border-black/5"
                >
                  <Image
                    src={c.images?.[1]}
                    alt="Architecture"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              )}

              {/* TEXT 02: THE CHALLENGE */}
              <div className="space-y-2">
                <h2 className="text-[16px] font-bold uppercase tracking-wider">
                  The Problem
                </h2>
                <div className="text-[16px] text-[#555] leading-[1.8]">
                  <p>{c.problem}</p>
                </div>
              </div>

              {/* IMAGE 03: PROBLEM GRID */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setSelectedIndex(2)}
                  className="w-full rounded-xl overflow-hidden bg-[#f7f7f7] cursor-zoom-in border border-black/5"
                >
                  <Image
                    src={c.images?.[2] || c.image}
                    alt="Detail A"
                    width={0}
                    height={0}
                    sizes="50vw"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <div
                  onClick={() => setSelectedIndex(3)}
                  className="w-full rounded-xl overflow-hidden bg-[#f7f7f7] cursor-zoom-in border border-black/5"
                >
                  <Image
                    src={c.images?.[3] || c.image}
                    alt="Detail B"
                    width={0}
                    height={0}
                    sizes="50vw"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </div>

              {/* TEXT 03: ARCHITECTURE LOGIC */}
              <div className="space-y-2">
                <h2 className="text-[16px] font-bold uppercase tracking-wider">
                  Product Architecture
                </h2>
                <div className="text-[16px] text-[#555] leading-[1.8]">
                  <p>{c.architecture}</p>
                </div>
              </div>
            </>
          )}

          {/* MINIMAL DESIGN SYSTEM BOARD (Restored First Version) */}
          {c.designSystem && (
            <div className="bg-[#f9f9f9] p-8 md:p-14 rounded-2xl space-y-12 border border-black/5 mt-12">
              <div className="space-y-4">
                <h2 className="text-[16px] font-bold uppercase tracking-wider text-[#111]">
                  Design System.
                </h2>
                <p className="text-[16px] text-[#555] leading-relaxed">
                  {c.designSystem}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <span className="text-[11px] font-bold uppercase text-[#aaa] tracking-[0.2em] block">
                    Typography Scale
                  </span>
                  <div className="space-y-4">
                    <div className="text-[28px] font-black leading-none uppercase">
                      Headline Bold
                    </div>
                    <div className="text-[20px] font-bold leading-none capitalize">
                      Subhead Regular
                    </div>
                    <div className="text-[16px] font-medium leading-none">
                      Body Sans Serif
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                  <div className="text-[64px] font-black leading-none tracking-tighter">
                    Aa.
                  </div>
                  <span className="text-[11px] text-[#aaa] font-mono mt-4 uppercase tracking-widest">
                    Inter System
                  </span>
                </div>
              </div>
              <div className="pt-10 border-t border-black/5 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(
                    c.colors || [
                      { hex: "#FF5C00", name: "Primary" },
                      { hex: "#333333", name: "Secondary" },
                      { hex: "#888888", name: "Muted" },
                      { hex: "#E5E5E5", name: "Surface" },
                    ]
                  ).map((col, i: number) => (
                    <div key={i} className="space-y-3">
                      <div
                        className="aspect-square rounded-lg border border-black/5 shadow-sm"
                        style={{ background: col.hex }}
                      />
                      <div className="space-y-1">
                        <span className="block text-[11px] font-bold uppercase">
                          {col.name}
                        </span>
                        <span className="block text-[10px] font-mono text-[#aaa]">
                          {col.hex}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK CONTENT RE-JOIN (Original Logic) */}
          {!c.detailedSections && (
            <div className="space-y-20 mt-20">
              {/* IMAGE 04: PROTOTYPING VIEW */}
              <div
                onClick={() => setSelectedIndex(2)}
                className="w-full rounded-3xl overflow-hidden bg-[#fafafa] cursor-zoom-in border border-black/5"
              >
                <Image
                  src={c.images?.[2] || c.image}
                  alt="Prototyping"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              {/* TEXT 04: PROTOTYPING NARRATIVE */}
              <div className="space-y-2">
                <h2 className="text-[16px] font-bold uppercase tracking-wider text-[#111]">
                  Interactive Prototyping
                </h2>
                <div className="text-[16px] text-[#555] leading-[1.8]">
                  <p>{c.prototyping || "Prototyping essential user paths."}</p>
                </div>
              </div>

              {/* IMAGE 05: TESTING VIEW */}
              <div
                onClick={() => setSelectedIndex(3)}
                className="w-full rounded-2xl overflow-hidden bg-[#fafafa] cursor-zoom-in border border-black/5"
              >
                <Image
                  src={c.images?.[3] || c.image}
                  alt="Testing"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              {/* TEXT 05: TESTING NARRATIVE */}
              <div className="space-y-2">
                <h2 className="text-[16px] font-bold uppercase tracking-wider text-[#111]">
                  Refined Quality & Testing
                </h2>
                <div className="text-[16px] text-[#555] leading-[1.8]">
                  <p>
                    {c.testing ||
                      "Rigorous QA cycles for cross-platform fidelity."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Grid (2 per row for better impact) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20">
            {c.stats.map((stat, i) => (
              <div
                key={i}
                className="bg-[#f9f9f9] p-8 md:p-12 rounded-2xl space-y-4 border border-black/5 shadow-sm group hover:border-[#FF5C00]/20 transition-all duration-500"
              >
                <div className="text-[32px] md:text-[48px] font-black tracking-tight text-[#111] leading-none">
                  {stat.value}
                </div>
                <div className="text-[14px] font-bold uppercase text-[#111] tracking-widest leading-relaxed">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* KEY TAKEAWAYS (STANDARDIZED NARRATIVE) */}
          {c.keyTakeaways && (
            <div className="mt-20 space-y-2">
              <h2 className="text-[16px] font-bold uppercase tracking-wider text-[#111]">
                Key Takeaways
              </h2>
              <div className="text-[16px] text-[#555] leading-[1.8]">
                <p>{c.keyTakeaways.map((t) => t.content).join(" ")}</p>
              </div>
            </div>
          )}

          {/* FINAL WORD (STANDARDIZED NARRATIVE) */}
          <div className="space-y-2 mt-20">
            <h2 className="text-[16px] font-bold uppercase tracking-wider text-[#111]">
              Final Word
            </h2>
            <div className="text-[16px] text-[#555] leading-[1.8]">
              <p>{c.outcome}</p>
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="pt-24 pb-12 border-t border-black/5 flex flex-col items-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#aaa] mb-10">
            Case Study Complete
          </span>
          <Link
            href="/work"
            className="group flex flex-col items-center gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-[#111] group-hover:border-[#111] transition-all duration-500">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="group-hover:text-white transition-colors"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-[16px] font-bold tracking-tight uppercase">
              Return to Collection
            </span>
          </Link>
        </section>
      </div>

      {/* GALLERY LIGHTBOX */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[2000] bg-white/95 backdrop-blur-2xl flex flex-col overflow-hidden select-none"
          onClick={() => setSelectedIndex(null)}
        >
          <div className="flex justify-between items-center p-8 md:p-12 z-50">
            <div className="font-mono text-[11px] tracking-widest text-[#aaa] uppercase">
              {selectedIndex + 1} / {allProjectImages.length}
            </div>
            <button
              className="text-black hover:opacity-50 transition-all p-2"
              onClick={() => setSelectedIndex(null)}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-start overflow-visible cursor-grab active:cursor-grabbing">
            <div
              ref={sliderRef}
              className="flex items-center absolute left-0 h-full w-full"
            >
              {allProjectImages.map((img, i) => (
                <div
                  key={i}
                  onClick={(e) => e.stopPropagation()}
                  className={`relative flex-shrink-0 w-screen h-[70vh] flex items-center justify-center transition-opacity duration-500 ${selectedIndex === i ? "opacity-100" : "opacity-10"}`}
                >
                  <div className="relative w-[85vw] h-full pointer-events-none">
                    <Image
                      src={img}
                      alt={`Img ${i + 1}`}
                      fill
                      className="object-contain rounded-xl"
                      priority
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="flex items-center justify-between p-8 md:p-12 z-50 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#aaa]">
                Navigate
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setSelectedIndex((p) =>
                      p! > 0 ? p! - 1 : allProjectImages.length - 1,
                    )
                  }
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#111] hover:text-white transition-all"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setSelectedIndex((p) =>
                      p! < allProjectImages.length - 1 ? p! + 1 : 0,
                    )
                  }
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#111] hover:text-white transition-all"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[#aaa] font-bold text-[11px] uppercase tracking-[0.2em]">
              <span>Exit full screen</span>
              <div className="px-3 py-1.5 border border-black/10 rounded-md text-[9px] font-mono uppercase">
                Esc
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
