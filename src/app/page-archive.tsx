"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import HeroV3 from "@/sections/HeroV3";
import StatementSection from "@/sections/StatementSection";
import Marquee from "@/sections/Marquee";
import Work from "@/sections/Work";
import Services from "@/sections/Services";
// import Process from "@/sections/Process";
import About from "@/sections/About";
// import Stack from "@/sections/Stack";
// import ClientsTestimonials from "@/sections/ClientsTestimonials";
// import Thoughts from "@/sections/Thoughts";
import Contact from "@/sections/Contact";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AllInOne from "@/sections/AllInOne";

// const SplineFrame = dynamic(() => import("@/sections/SplineFrame"), { ssr: false });
// const AhmedsRoomSection = dynamic(() => import("@/sections/Ahmed"), { ssr: false });
const MinecraftRoom = dynamic(() => import("@/sections/MinecraftRoom"), { ssr: false });
const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Lenis on mount
    const initScroll = async () => {
      const { initLenis } = await import("@/lib/lenis");
      initLenis();
    };
    initScroll();
  }, []);

  // Recalculate ScrollTrigger positions after initial animations mount.
  // This prevents pinning from causing sections to overlap/jump.
  useEffect(() => {
    if (loading) return;
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);
    return () => window.clearTimeout(t);
  }, [loading]);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <main style={{ opacity: loading ? 0 : 1, transition: "opacity 0.3s ease" }}>
        <Nav />
        <HeroV3 isLoaded={!loading} />
        <AllInOne /> 
         <StatementSection 
          number="01"
          title="p / Statement 01"
          text={`I design for those who refuse to blend in.\nI craft digital experiences that are bold, memorable,\nand engineered to leave a lasting impact.`}
          isEditing={true}
          animate3D={true}
        />
        <Services />
        {/* Intro Bio Sections */}
        <Work />  
       

        <StatementSection 
          number="02"
          title="p / Statement 02"
          text={`From robust structures to flawless interactions,\nmy approach merges technical depth with relentless\ncreative vision to bring your ideas to life.`}
          isEditing={false}
          animate3D={false}
        />

        {/* <Marquee /> */}
       
       
        
        {/* <Process /> */}
        
        <MinecraftRoom />
        <Contact />
      </main>
    </>
  );
}
