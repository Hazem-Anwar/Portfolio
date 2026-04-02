"use client";

import { useState } from "react";

const faqs = [
  { question: "WHAT IS YOUR ROLE?", answer: "I bridge the gap between design and development. My role spans from UX/UI design to frontend engineering, ensuring visually stunning and high-performance digital products." },
  { question: "HOW DO YOU USE USER FEEDBACK?", answer: "User feedback is the core driver of my iterations. I observe patterns, identify friction points, and refine the UX continuously to build intuitive experiences." },
  { question: "WHICH DESIGN TOOLS DO YOU USE?", answer: "I primarily rely on Figma for design systems and prototyping, complemented by tools like Zeplin and Spline for handoffs and 3D interactions." },
  { question: "HOW DO YOU COLLABORATE WITH TEAMS?", answer: "I believe in transparent and agile workflows. By maintaining clear communication, shared documentation, and tightly integrated feedback loops, I align with PMs and backend engineers seamlessly." },
  { question: "HOW DO YOU BALANCE INNOVATION AND CONSTRAINTS?", answer: "I aim for practical innovation—pushing creative boundaries while respecting technical feasibility, performance budgets, and business requirements." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#fff] py-24 md:py-32 font-inter text-[#111]">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-16">
        
        <div className="flex flex-col">
          <h2 className="text-[40px] md:text-[56px] font-bold leading-[1.1] tracking-tight uppercase">
            GOT <span className="text-[#888]">QUESTIONS?</span><br />
            I&apos;VE GOT ANSWERS<span className="text-[#FF4D00]">.</span>
          </h2>
          <p className="mt-6 text-[#666] text-lg max-w-[400px]">
            Got questions or need advice? Get clear insights to move forward.
          </p>
        </div>

        <div className="flex flex-col border-t border-[#e5e5e5]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-[#e5e5e5] py-5">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="font-bold text-[15px] uppercase tracking-wide group-hover:opacity-70 transition-opacity">
                    {faq.question}
                  </span>
                  <span className="text-[#FF4D00] text-2xl font-light transform transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>
                    +
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-[#666] leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
