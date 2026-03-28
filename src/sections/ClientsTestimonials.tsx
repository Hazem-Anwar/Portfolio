"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const clients = [
  "ClientOne",
  "ClientTwo",
  "ClientThree",
  "ClientFour",
  "ClientFive",
  "ClientSix",
];

const testimonials = [
  {
    quote:
      "Hazem delivered a design system that our entire team actually uses. His ability to translate complex requirements into clean, scalable UI is remarkable.",
    name: "Alex Thompson",
    role: "Head of Product, Booking Platform",
    initials: "AT",
  },
  {
    quote:
      "Working with Hazem felt like having a senior designer and frontend engineer in one. The attention to interaction detail is unmatched.",
    name: "Sarah Khalil",
    role: "CTO, Loyalty SaaS",
    initials: "SK",
  },
  {
    quote:
      "The redesign Hazem led doubled our search engagement metrics within a month. He understands both user psychology and technical constraints.",
    name: "Omar Hassan",
    role: "Product Manager, PropTech",
    initials: "OH",
  },
];

function TestimonialCard({
  t,
  index,
}: {
  t: (typeof testimonials)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: index * 0.15,
        scrollTrigger: { trigger: cardRef.current, start: "top 85%", once: true },
      }
    );
  }, [index]);

  return (
    <div ref={cardRef} className="card-gradient p-8 flex flex-col justify-between">
      <p className="font-body text-sm text-muted leading-relaxed mb-8">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="font-mono text-xs text-accent">{t.initials}</span>
        </div>
        <div>
          <div className="font-body text-sm text-text font-semibold">{t.name}</div>
          <div className="font-mono text-xs text-muted">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function ClientsAndTestimonials() {
  const clientsHeadingRef = useRef<HTMLHeadingElement>(null);
  const testimonialsHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    [clientsHeadingRef, testimonialsHeadingRef].forEach((ref) => {
      if (!ref.current) return;
      const split = new SplitText(ref.current, { type: "chars" });
      gsap.fromTo(split.chars, { y: "100%", opacity: 0 }, {
        y: "0%", opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.03,
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
      });
    });
  }, []);

  return (
    <>
      {/* Clients */}
      <section id="clients" className="section-pad bg-bg">
        <div className="container-custom">
          <div className="overflow-hidden mb-12">
            <h2
              ref={clientsHeadingRef}
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-none text-text"
            >
              CLIENTS
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border">
            {clients.map((client, i) => (
              <div
                key={i}
                className="bg-bg flex items-center justify-center py-10 px-6 group cursor-none"
              >
                <div className="font-display text-lg text-muted group-hover:text-text transition-all duration-300">
                  {client}
                </div>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-muted/40 tracking-widest text-center mt-6">
            — Placeholder logos —
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-pad bg-bg">
        <div className="container-custom">
          <div className="overflow-hidden mb-12">
            <h2
              ref={testimonialsHeadingRef}
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-none text-text"
            >
              KIND WORDS
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
