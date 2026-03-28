"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const cases: Record<string, {
  title: string;
  category: string;
  year: string;
  role: string;
  duration: string;
  color: string;
  stats: { label: string; value: string }[];
  problem: string;
  approach: string;
  outcome: string;
}> = {
  "booking-platform": {
    title: "Building Trust From Zero",
    category: "Booking Platform",
    year: "2023",
    role: "Lead Product Designer",
    duration: "4 months",
    color: "#2563eb",
    stats: [
      { label: "Drop-off Reduction", value: "40%" },
      { label: "Conversion Rate", value: "3×" },
      { label: "User Satisfaction", value: "92%" },
      { label: "Time to Book", value: "-60%" },
    ],
    problem:
      "The platform had a 68% checkout abandonment rate. Users didn't trust the service, couldn't find key information, and the booking flow had seven unnecessary steps before confirmation.",
    approach:
      "Starting with 20+ user interviews and a comprehensive UX audit, I mapped every friction point. I redesigned the booking flow from scratch — reducing it from 7 to 3 steps, surfacing trust signals at key decision moments, and introducing a transparent pricing breakdown.",
    outcome:
      "Within 6 weeks of launch, drop-off fell by 40% and conversion tripled. The redesigned trust layer (reviews, guarantees, real-time availability) became the product team's north star for subsequent features.",
  },
  "loyalty-platform": {
    title: "Designing For Complex State",
    category: "Loyalty Platform",
    year: "2024",
    role: "Designer & Frontend Engineer",
    duration: "6 months",
    color: "#7c3aed",
    stats: [
      { label: "Engagement Lift", value: "85%" },
      { label: "Design System", value: "1 unified" },
      { label: "Components Built", value: "42" },
      { label: "Dev Handoff Time", value: "-70%" },
    ],
    problem:
      "A loyalty SaaS with 15 different products had no shared design language. Every team was building in isolation, creating inconsistent UX and wasting months of design-dev sync time.",
    approach:
      "I audited every product, extracted pattern primitives, and built a token-based design system from scratch in Figma. I then implemented it in React with Storybook, creating 42 components across 8 categories that any team could drop in.",
    outcome:
      "User engagement jumped 85% as the experience became coherent. Dev handoff time dropped 70%. The system is now used by 6 product teams across the organization.",
  },
  "real-estate-platform": {
    title: "Property Search Redesigned",
    category: "Real Estate Platform",
    year: "2024",
    role: "UX Designer & QA Engineer",
    duration: "3 months",
    color: "#059669",
    stats: [
      { label: "Search Efficiency", value: "2×" },
      { label: "Onboarding Speed", value: "+60%" },
      { label: "Mobile Bounce Rate", value: "-45%" },
      { label: "Filter Usage", value: "+120%" },
    ],
    problem:
      "Property search was buried under 40 redundant filters, a non-responsive map view, and a listing page with no visual hierarchy. Users were leaving within 30 seconds on mobile.",
    approach:
      "Consolidated filters from 40 to 12 with smart grouping. Rebuilt the map/list toggle as a true split-screen with real-time synchronization. Redesigned listing cards with scannable hierarchy — price, key specs, and CTA always above the fold.",
    outcome:
      "Search efficiency doubled, filter usage tripled, and mobile bounce dropped 45%. The new onboarding flow — guided first search — got new users to their first saved property 60% faster.",
  },
};

export default function CaseStudy({ params }: { params: { slug: string } }) {
  const c = cases[params.slug];
  if (!c) notFound();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, { type: "lines" });
      gsap.fromTo(split.lines, { y: "100%", opacity: 0 }, {
        y: "0%", opacity: 1, duration: 1, ease: "power4.out", stagger: 0.12, delay: 0.3,
      });
    }
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1, delay: 0.7,
      });
    }
  }, []);

  return (
    <main className="bg-bg min-h-screen">
      {/* Back link */}
      <div className="fixed top-6 left-8 z-50">
        <Link
          href="/#work"
          className="font-mono text-xs text-muted hover:text-text tracking-widest uppercase flex items-center gap-2 group"
        >
          <svg
            className="group-hover:-translate-x-1 transition-transform duration-300"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Hero */}
      <section
        className="min-h-[60vh] flex flex-col justify-end pb-16 pt-32 px-8 md:px-16 border-b border-border"
        style={{
          background: `linear-gradient(135deg, ${c.color}10 0%, transparent 60%)`,
        }}
      >
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-6">
            <span className="tag-pill">{c.category}</span>
            <span className="font-mono text-xs text-muted">{c.year}</span>
          </div>
          <div className="overflow-hidden mb-8">
            <h1
              ref={titleRef}
              className="font-display leading-none text-text"
              style={{ fontSize: "clamp(3rem, 8vw, 9rem)" }}
            >
              {c.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="font-mono text-xs text-muted mb-1">Role</div>
              <div className="font-body text-sm text-text">{c.role}</div>
            </div>
            <div>
              <div className="font-mono text-xs text-muted mb-1">Duration</div>
              <div className="font-body text-sm text-text">{c.duration}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="border-b border-border">
        <div ref={statsRef} className="container-custom grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {c.stats.map((stat) => (
            <div key={stat.label} className="py-10 px-8">
              <div
                className="font-display text-4xl md:text-5xl mb-2"
                style={{ color: c.color }}
              >
                {stat.value}
              </div>
              <div className="font-mono text-xs text-muted tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="section-pad">
        <div className="container-custom max-w-3xl">
          {[
            { label: "Problem", content: c.problem },
            { label: "Approach", content: c.approach },
            { label: "Outcome", content: c.outcome },
          ].map((section) => (
            <div key={section.label} className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                <span className="font-mono text-xs text-accent tracking-widest uppercase">
                  {section.label}
                </span>
              </div>
              <p className="font-body text-base md:text-lg text-muted leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}

          <div className="pt-8 border-t border-border">
            <Link href="/#work" className="btn-ghost inline-flex">
              ← View All Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
