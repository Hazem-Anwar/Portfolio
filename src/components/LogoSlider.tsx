"use client";

import Image from "next/image";

const partners = [
  { name: "Partner 1", src: "/images/partners/1.png" },
  { name: "Partner 2", src: "/images/partners/2.png" },
  { name: "Partner 3", src: "/images/partners/3.png" },
  { name: "Partner 4", src: "/images/partners/4.png" },
  { name: "Partner 5", src: "/images/partners/5.png" },
  { name: "Partner 6", src: "/images/partners/6.png" },
  { name: "Partner 7", src: "/images/partners/7.png" },
  { name: "Partner 8", src: "/images/partners/8.png" },
  { name: "Partner 9", src: "/images/partners/9.png" },
];

export default function LogoSlider() {
  return (
    <div className="w-full overflow-hidden opacity-0" id="hero-logos">
     
      <div className="flex w-full overflow-hidden relative">
        <div className="absolute top-0 left-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        <div 
          className="flex items-center gap-12 min-w-full hover:[animation-play-state:paused] shrink-0" 
          style={{ animation: "marquee 45s linear infinite" }}
        >
          {[...partners, ...partners].map((partner, i) => (
            <div 
              key={i} 
              className="px-2 flex items-center justify-center  hover:opacity-100 transition-all duration-500 h-10 w-auto"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={140}
                height={48}
                className="object-contain h-8 max-h-10 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
