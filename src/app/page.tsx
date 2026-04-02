"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

import HeroLight from "@/sections/HeroLight";
import FeaturedWork from "@/sections/FeaturedWork";
import SelectedProjects from "@/sections/SelectedProjects";
import Contact from "@/sections/Contact";
import FAQ from "@/sections/FAQ";
import CTA from "@/sections/CTA";
import LineFooter from "@/components/LineFooter";
import AllInOne from "@/sections/AllInOne";
import Tools from "@/components/Toolkit";
import Loader from "@/components/Loader";

export default function Home() {
  const [loading, setLoading] = useState(false);

  // Force Light Mode on this page
  useEffect(() => {
    document.documentElement.classList.add("light-mode");
    return () => {
      document.documentElement.classList.remove("light-mode");
    };
  }, []);

  useEffect(() => {
    const initScroll = async () => {
      const { initLenis } = await import("@/lib/lenis");
      initLenis();
    };
    initScroll();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <main 
        className="font-inter bg-[#fff] min-h-screen text-[#111]"
        style={{ opacity: 1 }}
      >
        <HeroLight />
        
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

        

      

        {/* CTA Section */}
        {/* <CTA /> */}

        {/* Line Footer */}
        <LineFooter />
      </main>
    </>
  );
}
