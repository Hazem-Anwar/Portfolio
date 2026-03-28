"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const articles = [
  {
    tag: "Design Systems",
    title: "Why Design Tokens Are the Foundation of Scalable UI",
    date: "Coming Soon",
    slug: "#",
  },
  {
    tag: "Frontend",
    title: "GSAP vs Framer Motion: When to Use Which",
    date: "Coming Soon",
    slug: "#",
  },
  {
    tag: "UX",
    title: "The UX of Empty States: Turning Dead Ends Into Moments",
    date: "Coming Soon",
    slug: "#",
  },
];

function ArticleCard({ article, index }: { article: (typeof articles)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: index * 0.1,
        scrollTrigger: { trigger: cardRef.current, start: "top 85%", once: true },
      }
    );
  }, [index]);

  return (
    <div ref={cardRef} className="bg-bg p-8 group cursor-none">
      <div className="flex items-center justify-between mb-6">
        <span className="tag-pill">{article.tag}</span>
        <span className="font-mono text-xs text-muted">{article.date}</span>
      </div>
      <h3 className="font-display text-2xl md:text-3xl text-text leading-tight mb-6 group-hover:text-accent transition-colors duration-300">
        {article.title}
      </h3>
      <div className="flex items-center gap-2 text-muted group-hover:text-accent transition-colors duration-300">
        <span className="font-mono text-xs tracking-widest uppercase">Read</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

export default function Thoughts() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const split = new SplitText(headingRef.current, { type: "chars" });
    gsap.fromTo(split.chars, { y: "100%", opacity: 0 }, {
      y: "0%", opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.03,
      scrollTrigger: { trigger: headingRef.current, start: "top 80%", once: true },
    });
  }, []);

  return (
    <section id="thoughts" className="section-pad bg-bg">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-12">
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-none text-text"
            >
              THOUGHTS
            </h2>
          </div>
          <span className="font-mono text-xs text-muted tracking-widest hidden md:block">
            Articles & Essays
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {articles.map((article, i) => (
            <ArticleCard key={i} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
