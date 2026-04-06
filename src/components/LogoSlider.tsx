"use client";

import Image from "next/image";

const partners = [
  { name: "Partner 1", src: "/images/partners/1.png" },
  { name: "Partner 2", src: "/images/partners/2.png" },
  { name: "Partner 3", src: "/images/partners/3.png" },
  { name: "Partner 5", src: "/images/partners/5.svg" },
    { name: "Partner 5", src: "/images/partners/6.svg" },

  { name: "Partner 7", src: "/images/partners/7.svg" },
  { name: "Partner 8", src: "/images/partners/8.svg" },
  { name: "Partner 9", src: "/images/partners/9.svg" },
  { name: "Partner 10", src: "/images/partners/10.svg" },
  { name: "Partner 11", src: "/images/partners/11.svg" },
  { name: "Partner 12", src: "/images/partners/12.svg" },
];

export default function LogoSlider() {
  return (
    <div className="w-full overflow-hidden opacity-0" id="hero-logos">
     
      <div className="flex w-full overflow-hidden relative py-4">
        <div className="absolute top-0 left-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        
        <div 
          className="flex items-center gap-8 md:gap-16 w-max hover:[animation-play-state:paused] shrink-0 will-change-transform" 
          style={{ 
            animation: "marquee 60s linear infinite",
            backfaceVisibility: "hidden",
            perspective: "1000px",
            transform: "translateZ(0)"
          }}
        >
          {[...partners, ...partners, ...partners, ...partners].map((partner, i) => (
            <div 
              key={i} 
              className="px-4 flex items-center justify-center transition-all duration-500 h-12"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={120}
                height={50}
                className="object-contain h-7 md:h-9 w-auto grayscale-0 opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
