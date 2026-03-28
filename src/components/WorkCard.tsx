"use client";

import Link from "next/link";
import Image from "next/image";

interface Stat {
  label: string;
  value: string;
}

interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  type: string;
  stats: Stat[];
  link?: string;
  image?: string;
}

const PROJECT_IMAGE = "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2670&auto=format&fit=crop";

export default function WorkCard({ project }: { project: Project }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl p-8 md:p-16 lg:p-20 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full max-w-7xl h-full lg:h-auto">
      {/* Project Details */}
      <div className="flex flex-col gap-6 md:gap-10">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span
              className={`px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded-full border ${
                project.type === "Front-end"
                  ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                  : "border-white/20 text-white bg-white/5"
              }`}
            >
              {project.type}
            </span>
            <span className="font-mono text-[10px] text-muted tracking-[0.3em] uppercase block">
              {project.category}
            </span>
          </div>
          <h3 className="font-display text-4xl md:text-6xl lg:text-[5.5rem] text-text leading-[0.9] tracking-tighter uppercase whitespace-pre-line">
            {project.title.split(", ").join("\n")}
          </h3>
        </div>

        <p className="text-muted/70 text-base md:text-lg leading-relaxed max-w-md hidden md:block">
          {project.description}
        </p>

        <div className="grid grid-cols-2 gap-8 md:gap-14">
          {project.stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <span className="font-bebas text-4xl md:text-5xl text-text leading-none">
                {stat.value}
              </span>
              <span className="font-mono text-[9px] text-muted tracking-[0.2em] leading-tight uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6 mt-4 flex-wrap">
          <Link
            href={`/work/${project.slug}`}
            className="group flex items-center gap-4 w-fit"
          >
            <div className="flex flex-col overflow-hidden">
              <span className="font-display text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-500 font-bold">
                VIEW CASE STUDY
              </span>
              <div className="h-px bg-text w-0 group-hover:w-full transition-all duration-500" />
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-hover:translate-x-3 transition-transform duration-500"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {project.type === "Front-end" && project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 w-fit text-blue-400 hover:text-blue-300"
            >
              <div className="flex flex-col overflow-hidden">
                <span className="font-display text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-500 font-bold">
                  VISIT SITE
                </span>
                <div className="h-px bg-blue-400 w-0 group-hover:w-full transition-all duration-500" />
              </div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-500"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Project Visual */}
      <div className="relative aspect-[4/5] lg:aspect-[10/12] w-full rounded-sm overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl h-full lg:h-auto flex items-start justify-center">
        <div
          className={`project-image-inner absolute ${
            project.type === "Front-end"
              ? "inset-0 w-full h-[150%] top-0 left-0" // Taller for vertical scroll
              : "inset-0 w-[140%] h-full left-[-20%] top-0" // Wider for horizontal scroll
          }`}
          data-type={project.type}
        >
          <Image
            src={project.image || PROJECT_IMAGE}
            alt={project.title}
            fill
            className={`object-cover opacity-80 ${project.type === "Front-end" ? "object-top" : "object-center"}`}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-50 z-10" />
        </div>
      </div>
    </div>
  );
}
