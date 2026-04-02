"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="w-full bg-[#fff] py-40 font-inter text-center">
      <div className="container-custom flex flex-col items-center">
        <h2 className="text-[40px] md:text-[64px] font-bold leading-[1.05] tracking-tight uppercase text-[#111] mb-8">
          LET&apos;S BUILD <span className="text-outline-accent">SOMETHING</span> EXTRAORDINARY<span className="text-[#FF4D00]">.</span>
        </h2>
        <p className="text-[#666] text-lg mb-10 max-w-[500px]">
          Ready to turn your ideas into a fully functioning, high-performance digital reality? Let&apos;s talk about your next project.
        </p>
        <Link href="#contact">
          <button className="bg-[#111] text-white px-10 py-4 rounded-full font-medium text-[15px] shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-300">
            START A CONVERSATION
          </button>
        </Link>
      </div>
    </section>
  );
}
