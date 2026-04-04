"use client";

import { useEffect } from "react";
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
import { useLoader } from "@/components/LoaderProvider";

const MinecraftRoom = dynamic(() => import("@/sections/MinecraftRoom"), { ssr: false });

export default function Home() {
  const { loading } = useLoader();

  useEffect(() => {
    // Initialize Lenis on mount
    const initScroll = async () => {
      const { initLenis } = await import("@/lib/lenis");
      initLenis();
    };
    initScroll();
  }, []);

  // Recalculate ScrollTrigger positions after initial animations mount.
  useEffect(() => {
    if (loading) return;
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);
    return () => window.clearTimeout(t);
  }, [loading]);

  return (
    <main>
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
      <Work />  
     

      <StatementSection 
        number="02"
        title="p / Statement 02"
        text={`From robust structures to flawless interactions,\nmy approach merges technical depth with relentless\ncreative vision to bring your ideas to life.`}
        isEditing={false}
        animate3D={false}
      />
      
      <MinecraftRoom />
      <Contact />
    </main>
  );
}
