"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroLight from "@/sections/HeroLight";
import SelectedProjects from "@/sections/SelectedProjects";
import Contact from "@/sections/Contact";
import FAQ from "@/sections/FAQ";
import LineFooter from "@/components/LineFooter";
import Tools from "@/components/Toolkit";
import { useLoader } from "@/components/LoaderProvider";

export default function Home() {
  const { loading } = useLoader();

  // Force Light Mode on this page
  useEffect(() => {
    document.documentElement.classList.add("light-mode");
    return () => {
      document.documentElement.classList.remove("light-mode");
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const initScroll = async () => {
      const { initLenis } = await import("@/lib/lenis");
      initLenis();
    };
    initScroll();
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);
    return () => window.clearTimeout(t);
  }, [loading]);

  return (
    <main className="font-inter bg-[#fff] min-h-screen text-[#111]">
      <HeroLight startAnimations={!loading} />
      
      {/* Project Section */}
      <div id="work">
        <SelectedProjects />
      </div>

      <Tools />

      {/* FAQ Section */}
      <FAQ />
      
      {/* Contact Section */}
      <div id="contact">
        <Contact />
      </div>

      {/* Line Footer */}
      <LineFooter />
    </main>
  );
}
