"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AllInOne() {
  const number = "01";
  const title = "WHO WE ARE";
  const phrases = ["Designer", "Engineer", "One Person"];

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      const chars = sectionRef.current.querySelectorAll('.typing-char');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          // يبدأ عند الوصول لمنتصف الشاشة وينتهي بعد مسافة سكرول 
          start: "center center",
          end: "+=200%",      // زيادة مسافة السكرول بشكل كبير لتبطئة الحركة
          pin: true,           
          scrub: 1.5,          
          refreshPriority: 1, 
        }
      });

      // إضافة حركة الحروف (تأثير الكتابة) لجميع الكلمات
      tl.to(chars, {
        opacity: 1,
        stagger: 0.1, // تباعد بسيط ليعطي شعور "الكتابة" الواضحة
        ease: "none",
      })
      // وقت انتظار في النهاية لتثبيت النتيجة
      .to({}, { duration: 0.5 });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full h-screen z-10 relative overflow-hidden bg-bg" style={{ transform: "translateZ(0)" }}>
      <div className="w-full h-full flex items-center justify-center">
        <div ref={containerRef} className="container-custom max-w-5xl relative w-full px-6 text-center">
          
          {/* Index & Title */}
          <div className="flex flex-col items-center mb-16">
              <span className="text-[rgba(228,254,154,1)] font-mono text-xs tracking-widest mb-2">{number}</span>
              <span className="text-muted font-mono text-[10px] tracking-[0.3em] uppercase">{title}</span>
          </div>

          <div className="flex flex-col gap-y-10 md:gap-y-14 text-center">
            {phrases.map((phrase, i) => (
              <div key={i} className="overflow-hidden">
                <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] font-display font-medium leading-[1] tracking-[0.05em] uppercase inline-flex flex-wrap justify-center">
                  {phrase.split("").map((char, index) => (
                    <span 
                      key={index} 
                      className={`typing-char opacity-0 ${i === 2 ? 'text-outline' : 'text-text'}`}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </h2>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
