"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import LogoSlider from "@/components/LogoSlider";

// --- SKILL ICONS ---
const NextjsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"
      fill="#111"
    />
  </svg>
);

const TailwindIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M64.004 25.602c-17.067 0-27.73 8.53-32 25.597 6.398-8.531 13.867-11.73 22.398-9.597 4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602-6.399 8.536-13.867 11.735-22.399 9.602-4.87-1.215-8.347-4.746-12.207-8.66-6.27-6.367-13.53-13.738-29.394-13.738zM32.004 64c-17.066 0-27.73 8.531-32 25.602C6.402 81.066 13.87 77.867 22.402 80c4.871 1.215 8.352 4.746 12.207 8.66 6.274 6.367 13.536 13.738 29.395 13.738 17.066 0 27.73-8.53 32-25.597-6.399 8.531-13.867 11.73-22.399 9.597-4.87-1.214-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64zm0 0"
      fill="#38bdf8"
    />
  </svg>
);

const FigmaIcon = () => (
  <svg
    width="14"
    height="18"
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#0acf83"
      d="M45.5 129c11.9 0 21.5-9.6 21.5-21.5V86H45.5C33.6 86 24 95.6 24 107.5S33.6 129 45.5 129zm0 0"
    />
    <path
      fill="#a259ff"
      d="M24 64.5C24 52.6 33.6 43 45.5 43H67v43H45.5C33.6 86 24 76.4 24 64.5zm0 0"
    />
    <path
      fill="#f24e1e"
      d="M24 21.5C24 9.6 33.6 0 45.5 0H67v43H45.5C33.6 43 24 33.4 24 21.5zm0 0"
    />
    <path
      fill="#ff7262"
      d="M67 0h21.5C100.4 0 110 9.6 110 21.5S100.4 43 88.5 43H67zm0 0"
    />
    <path
      fill="#1abcfe"
      d="M110 64.5c0 11.9-9.6 21.5-21.5 21.5S67 76.4 67 64.5 76.6 43 88.5 43 110 52.6 110 64.5zm0 0"
    />
  </svg>
);

const PerformanceIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13 2L3 14H12V22L22 10H13V2Z" fill="#ff4d00" />
  </svg>
);

const TSIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="22.67" y="47" width="99.67" height="73.67" fill="#fff" />
    <path
      fill="#007acc"
      d="M1.5 63.91v62.5h125v-125H1.5zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1 23 23 0 01-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73L82 101l3.59-2.08.75 1.11a16.78 16.78 0 00-4.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.26H28.88v-5a49.19 49.19 0 01.12-5.17C29.08 59 39 59 51 59h21.83z"
    />
  </svg>
);

const ReactIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="-11.5 -10.23174 23 20.46348"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
    <g stroke="#61dafb" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const AgileIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="agile-grad-a"
        gradientUnits="userSpaceOnUse"
        x1="22.034"
        y1="9.773"
        x2="17.118"
        y2="14.842"
        gradientTransform="scale(4)"
      >
        <stop offset=".176" stopColor="#0052cc" />
        <stop offset="1" stopColor="#2684ff" />
      </linearGradient>
      <linearGradient
        id="agile-grad-b"
        gradientUnits="userSpaceOnUse"
        x1="16.641"
        y1="15.564"
        x2="10.957"
        y2="21.094"
        gradientTransform="scale(4)"
      >
        <stop offset=".176" stopColor="#0052cc" />
        <stop offset="1" stopColor="#2684ff" />
      </linearGradient>
    </defs>
    <path
      d="M108.023 16H61.805c0 11.52 9.324 20.848 20.847 20.848h8.5v8.226c0 11.52 9.328 20.848 20.848 20.848V19.977A3.98 3.98 0 00108.023 16zm0 0"
      fill="#2684ff"
    />
    <path
      d="M85.121 39.04H38.902c0 11.519 9.325 20.847 20.844 20.847h8.504v8.226c0 11.52 9.328 20.848 20.848 20.848V43.016a3.983 3.983 0 00-3.977-3.977zm0 0"
      fill="url(#agile-grad-a)"
    />
    <path
      d="M62.219 62.078H16c0 11.524 9.324 20.848 20.848 20.848h8.5v8.23c0 11.52 9.328 20.844 20.847 20.844V66.059a3.984 3.984 0 00-3.976-3.98zm0 0"
      fill="url(#agile-grad-b)"
    />
  </svg>
);

const FramerIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.5 0h83v41.5l-41.5 41.5H22.5l41.5-41.5L22.5 0zm0 83h41.5L107 124.5H22.5V83z"
      fill="black"
    />
  </svg>
);

const ClaudeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50.2869 170.192L100.606 141.956L101.448 139.495L100.606 138.135H98.1452L89.7263 137.617L60.9725 136.84L36.0395 135.804L11.8837 134.508L5.79613 133.213L0.097168 125.701L0.680016 121.945L5.79613 118.513L13.1141 119.16L29.3044 120.261L53.5897 121.945L71.2047 122.981L97.3033 125.701H101.448L102.031 124.017L100.606 122.981L99.5052 121.945L74.378 104.913L47.1784 86.9092L32.931 76.5474L25.2244 71.3018L21.3388 66.38L19.655 55.6297L26.6492 47.9231L36.0395 48.5707L38.4356 49.2183L47.9555 56.5363L68.2904 72.2732L94.8424 91.831L98.7281 95.0691L100.282 93.9681L100.477 93.191L100.282 93.9681L100.477 93.191L98.7281 90.2768L84.2864 64.1781L68.8733 37.6261L62.0086 26.6167L60.1953 20.0111C59.5477 17.2912 59.0944 15.0245 59.0944 12.2398L67.06 1.42474L71.4637 0L82.0845 1.42474L86.553 5.3104L93.1586 20.3997L103.844 44.167L120.423 76.4827L125.28 86.0673L127.871 94.9395L128.842 97.6595H130.526V96.1052L131.886 77.9074L134.411 55.5649L136.872 26.811L137.714 18.7159L141.729 9.00177L149.695 3.75613L155.912 6.73514L161.028 14.0531L160.316 18.7807L157.272 38.5328L151.314 69.4885L147.428 90.212H149.695L152.285 87.6216L162.777 73.698L180.392 51.6792L188.163 42.9365L197.229 33.2871L203.058 28.6891H214.067L222.162 40.7346L218.536 53.1687L207.203 67.5457L197.812 79.7207L184.342 97.8538L175.923 112.36L176.7 113.526L178.708 113.332L209.145 106.856L225.595 103.877L245.217 100.509L254.09 104.654L255.061 108.863L251.564 117.476L230.581 122.657L205.972 127.579L169.318 136.257L168.864 136.581L169.382 137.228L185.896 138.783L192.955 139.171H210.246L242.433 141.567L250.852 147.137L255.903 153.937L255.061 159.118L242.109 165.723L224.623 161.579L183.824 151.864L169.836 148.367H167.893V149.533L179.55 160.931L200.921 180.23L227.667 205.098L229.027 211.25L225.595 216.107L221.968 215.589L198.46 197.909L189.393 189.944L168.864 172.653H167.504V174.466L172.232 181.395L197.229 218.957L198.525 230.484L196.711 234.24L190.235 236.507L183.112 235.212L168.476 214.683L153.386 191.563L141.211 170.839L139.722 171.681L132.533 249.071L129.166 253.021L121.394 256L114.918 251.078L111.486 243.113L114.918 227.376L119.063 206.846L122.431 190.527L125.474 170.257L127.288 163.521L127.158 163.068L125.669 163.262L110.385 184.245L87.1359 215.654L68.7438 235.341L64.34 237.09L56.6982 233.139L57.4106 226.08L61.6848 219.799L87.1359 187.418L102.484 167.342L112.393 155.75L112.328 154.066H111.745L44.1346 197.974L32.0891 199.528L26.9082 194.671L27.5558 186.706L30.0167 184.115L50.3517 170.127L50.2869 170.192Z"
      fill="#D97757"
    />
  </svg>
);

const PlaywrightIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M43.662 70.898c-4.124 1.17-6.829 3.222-8.611 5.272 1.707-1.494 3.993-2.865 7.077-3.739 3.155-.894 5.846-.888 8.069-.459v-1.739c-1.897-.173-4.072-.035-6.536.664ZM34.863 56.28l-15.314 4.035s.279.394.796.92l12.984-3.421s-.184 2.371-1.782 4.492c3.022-2.287 3.316-6.025 3.316-6.025Zm12.819 35.991C26.131 98.076 14.729 73.1 11.277 60.137 9.682 54.153 8.986 49.621 8.8 46.697a4.955 4.955 0 0 1 .011-.794c-1.118.068-1.653.649-1.544 2.328.186 2.923.882 7.454 2.477 13.44 3.45 12.961 14.854 37.937 36.405 32.132 4.691-1.264 8.215-3.565 10.86-6.504-2.438 2.202-5.49 3.937-9.327 4.972Zm4.05-51.276v1.534h8.453c-.173-.543-.348-1.032-.522-1.534h-7.932Z"
      fill="#2D4552"
    />
    <path
      d="M62.074 53.627c3.802 1.08 5.812 3.745 6.875 6.104l4.239 1.204s-.578-8.255-8.045-10.376c-6.985-1.985-11.284 3.881-11.807 4.64 2.032-1.448 4.999-2.633 8.738-1.572Zm33.741 6.142c-6.992-1.994-11.289 3.884-11.804 4.633 2.034-1.446 4.999-2.632 8.737-1.566 3.796 1.081 5.804 3.743 6.87 6.104l4.245 1.208s-.588-8.257-8.048-10.379Zm-4.211 21.766-35.261-9.858s.382 1.935 1.846 4.441l29.688 8.3c2.444-1.414 3.726-2.883 3.726-2.883Zm-24.446 21.218c-27.92-7.485-24.544-43.059-20.027-59.916 1.86-6.947 3.772-12.11 5.358-15.572-.946-.195-1.73.304-2.504 1.878-1.684 3.415-3.837 8.976-5.921 16.76-4.516 16.857-7.892 52.429 20.027 59.914 13.159 3.525 23.411-1.833 31.053-10.247-7.254 6.57-16.515 10.253-27.986 7.182Z"
      fill="#2D4552"
    />
    <path
      d="M51.732 83.935v-7.179l-19.945 5.656s1.474-8.563 11.876-11.514c3.155-.894 5.846-.888 8.069-.459V40.995h9.987c-1.087-3.36-2.139-5.947-3.023-7.744-1.461-2.975-2.96-1.003-6.361 1.842-2.396 2.001-8.45 6.271-17.561 8.726-9.111 2.457-16.476 1.805-19.55 1.273-4.357-.752-6.636-1.708-6.422 1.605.186 2.923.882 7.455 2.477 13.44 3.45 12.962 14.854 37.937 36.405 32.132 5.629-1.517 9.603-4.515 12.357-8.336h-8.309v.002Zm-32.185-23.62 15.316-4.035s-.446 5.892-6.188 7.405c-5.743 1.512-9.128-3.371-9.128-3.371Z"
      fill="#E2574C"
    />
    <path
      d="M109.372 41.336c-3.981.698-13.532 1.567-25.336-1.596-11.807-3.162-19.64-8.692-22.744-11.292-4.4-3.685-6.335-6.246-8.24-2.372-1.684 3.417-3.837 8.977-5.921 16.762-4.516 16.857-7.892 52.429 20.027 59.914 27.912 7.479 42.772-25.017 47.289-41.875 2.084-7.783 2.998-13.676 3.25-17.476.287-4.305-2.67-3.055-8.324-2.064ZM53.28 55.282s4.4-6.843 11.862-4.722c7.467 2.121 8.045 10.376 8.045 10.376L53.28 55.282Zm18.215 30.706c-13.125-3.845-15.15-14.311-15.15-14.311l35.259 9.858c0-.002-7.117 8.25-20.109 4.453Zm12.466-21.51s4.394-6.838 11.854-4.711c7.46 2.124 8.048 10.379 8.048 10.379l-19.902-5.668Z"
      fill="#2EAD33"
    />
    <path
      d="M44.762 78.733 31.787 82.41s1.41-8.029 10.968-11.212l-7.347-27.573-.635.193c-9.111 2.457-16.476 1.805-19.55 1.273-4.357-.751-6.636-1.708-6.422 1.606.186 2.923.882 7.454 2.477 13.44 3.45 12.961 14.854 37.937 36.405 32.132l.635-.199-3.555-13.337ZM19.548 60.315l15.316-4.035s-.446 5.892-6.188 7.405c-5.743 1.512-9.128-3.371-9.128-3.371Z"
      fill="#D65348"
    />
    <path
      d="m72.086 86.132-.594-.144c-13.125-3.844-15.15-14.311-15.15-14.311l18.182 5.082L84.15 39.77l-.116-.031c-11.807-3.162-19.64-8.692-22.744-11.292-4.4-3.685-6.335-6.246-8.24-2.372-1.682 3.417-3.836 8.977-5.92 16.762-4.516 16.857-7.892 52.429 20.027 59.914l.572.129 4.357-16.748Zm-18.807-30.85s4.4-6.843 11.862-4.722c7.467 2.121 8.045 10.376 8.045 10.376l-19.907-5.654Z"
      fill="#1D8D22"
    />
    <path
      d="m45.423 78.544-3.48.988c.822 4.634 2.271 9.082 4.545 13.011.396-.087.788-.163 1.192-.273a25.224 25.224 0 0 0 2.98-1.023c-2.541-3.771-4.222-8.114-5.237-12.702Zm-1.359-32.64c-1.788 6.674-3.388 16.28-2.948 25.915a20.061 20.061 0 0 1 2.546-.923l.644-.144c-.785-10.292.912-20.78 2.825-27.915a139.404 139.404 0 0 1 1.455-5.05 45.171 45.171 0 0 1-2.578 1.53 132.234 132.234 0 0 0-1.944 6.587Z"
      fill="#C04B41"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.011-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      fill="#111"
    />
  </svg>
);

const ALL_SKILLS = [
  { name: "Next.js", icon: <NextjsIcon /> },
  { name: "Tailwind", icon: <TailwindIcon /> },
  { name: "Figma", icon: <FigmaIcon /> },
  { name: "Performance", icon: <PerformanceIcon /> },
  { name: "TypeScript", icon: <TSIcon /> },
  { name: "React", icon: <ReactIcon /> },
  {
    name: "Laravel",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M121.3 28.1L70.4 2v20.4L42.5 35 15.6 48.6 0 60.3l13.6 7.4 28.1 15.4 25.1 13.8 52.7-26V28.1zM28.1 59.4L13.8 50.8l14.3-7.4 14.4 7.4 14.4 8.6-28.8-7.4zm28.1 31.5l-14.4-7.4 14.4-7.4 14.4 7.4-14.4 7.4zm61.1-34l-14.3 7.4-14.4-7.4V40.2l14.4-7.4 14.3 7.4v16.7z"
          fill="#FF2D20"
        />
      </svg>
    ),
  },
  { name: "Agile", icon: <AgileIcon /> },
  { name: "Animations", icon: <FramerIcon /> },
  { name: "Claude AI", icon: <ClaudeIcon /> },
  { name: "Testing", icon: <PlaywrightIcon /> },
  { name: "GitHub", icon: <GitHubIcon /> },
];

function TypewriterText({ text, active }: { text: string; active: boolean }) {
  const [displayText, setDisplayText] = useState(text);

  const type = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index <= iteration) return text[index];
            return "";
          })
          .join(""),
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1;
    }, 35);
    return interval;
  }, [text]);

  useEffect(() => {
    if (active) {
      const interval = type();
      return () => clearInterval(interval);
    } else {
      setDisplayText(text);
    }
  }, [active, text, type]);

  return <>{displayText}</>;
}

function SignatureTypewriter({
  text,
  delay = 0.5,
}: {
  text: string;
  delay?: number;
}) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const tl = gsap.timeline({ delay });

    // Smooth reveal using clipPath
    tl.fromTo(
      textRef.current,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: text.length * 0.05,
        ease: "none",
      },
    );
  }, [text, delay]);

  return (
    <span className="relative inline-flex items-center min-h-[1.2em]">
      <span className="relative">
        <span
          ref={textRef}
          className="relative block whitespace-nowrap pr-1"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          {text}
        </span>
      </span>
    </span>
  );
}

export default function HeroLight({
  startAnimations = true,
}: {
  startAnimations?: boolean;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const imgCardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const [isHoveredWork, setIsHoveredWork] = useState(false);
  const [showFixedMobileBtns, setShowFixedMobileBtns] = useState(false);

  const [skillsIndex, setSkillsIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1100);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const batchSize = isMobile ? 3 : 4;

  useEffect(() => {
    const timer = setInterval(() => {
      setSkillsIndex((prev) => (prev + batchSize) % ALL_SKILLS.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [batchSize]);

  const visibleSkills = ALL_SKILLS.slice(skillsIndex, skillsIndex + batchSize);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowFixedMobileBtns(true);
      } else {
        setShowFixedMobileBtns(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!startAnimations) return;

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    // 1. PORTRAIT & BADGE FIRST (The "Face" of the site)
    tl.to(
      imgCardRef.current,
      { opacity: 1, y: 0, duration: 1.2, startAt: { y: 40, opacity: 0 } },
      0.2,
    );
    tl.to(
      badgeRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        startAt: { scale: 0, opacity: 0 },
      },
      0.5,
    );

    // 2. NAVIGATION
    tl.to(
      "nav",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        startAt: { y: -20, opacity: 0 },
        clearProps: "y",
      },
      0.7,
    );

    // 3. NAME & SIGNATURE
    tl.to(
      "#hero-signature",
      { opacity: 1, duration: 0.8, startAt: { opacity: 0 } },
      1.0,
    );

    // 4. MAIN TITLES & CONTENT
    tl.to(
      headingRef.current,
      { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20, opacity: 0 } },
      1.2,
    );
    tl.to(
      descRef.current,
      { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20, opacity: 0 } },
      1.3,
    );
    tl.to(
      skillsRef.current,
      { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20, opacity: 0 } },
      1.4,
    );
    tl.to(
      btnsRef.current,
      { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20, opacity: 0 } },
      1.5,
    );
    tl.to(
      "#hero-logos",
      { opacity: 1, y: 0, duration: 0.8, startAt: { y: 20, opacity: 0 } },
      1.6,
    );

    // Background Glow
    tl.to("#glow-1", { opacity: 1, duration: 3, ease: "power2.out" }, 1.2);
  }, [startAnimations]);

  return (
    <>
      <section
        ref={heroRef}
        className="w-full bg-[#fff] lg:pt-6 flex flex-col font-inter selection:bg-[#ff4d00] selection:text-white overflow-x-hidden relative"
      >
        {/* Neutral Smoky Ambient Glow - Refined Luxury Treatment */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[450px] h-[450px] bg-[#0000001a] blur-[180px] rounded-full z-0 opacity-0 animate-[pulse_15s_ease-in-out_infinite] hidden md:block"
          style={{ animationDelay: "2s" }}
          id="glow-1"
        />

        <div className="container-custom md:pt-[120px] pt-16   flex-1 flex flex-col relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-14 lg:gap-16 items-center w-full">
            {/* Left Side Content - Now order-2 on mobile */}
            <div className="flex flex-col lg:pt-10 z-10 min-w-0 order-2 md:order-1">
              <h6
                className="text-[#111] text-[20px] md:text-[22px] font-epilogue font-semibold tracking-normal opacity-0"
                id="hero-signature"
              >
                <SignatureTypewriter text="Hazem Anwar" delay={0} />
              </h6>
              <h1
                ref={headingRef}
                className="font-bricolage font-extrabold mt-2 text-[24px]  md:text-[clamp(1.8rem,4vw,44px)] lg:text-[48px] leading-[1.1] tracking-[-0.02em] text-[#111] opacity-0"
              >
                Product Engineer <span className="text-[#ff4d00]">.</span>{" "}
                <br />
                <span className="text-[12px] md:text-[14px] font-epilogue font-bold block mt-4 text-[#111] opacity-0] tracking-[0.15em] uppercase">
                  Frontend • Product Design • QA
                </span>
              </h1>

              <p
                ref={descRef}
                className="mt-3 md:mt-4 text-[#888] leading-[1.6] mb-0 text-[14px] md:text-[15px] opacity-0 max-w-[450px]"
              >
                Front-end Engineer & UX/UI Designer crafting scalable,
                high-performance interfaces with a strong focus on UX, detail,
                and bridging design with development.
              </p>

              <div
                ref={btnsRef}
                className="md:mt-6 mt-4 flex flex-row flex-wrap items-center gap-3 md:gap-4 opacity-0"
              >
                <Link
                  href="/work"
                  onMouseEnter={() => setIsHoveredWork(true)}
                  onMouseLeave={() => setIsHoveredWork(false)}
                  className="group bg-[#111] text-white px-5 md:px-8 py-3 rounded-full font-medium text-[11px] md:text-[14px] transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#222] text-left flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2 overflow-hidden"
                >
                  <span className="min-w-[80px] md:min-w-[100px] inline-block transition-transform duration-300 group-hover:translate-x-[1px] text-center sm:text-left">
                    <TypewriterText
                      text="VIEW MY WORK"
                      active={isHoveredWork}
                    />
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:rotate-[45deg] group-hover:translate-x-[2px] hidden sm:block"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </Link>
                <a
                  href="https://drive.google.com/file/d/1uUFMJ2NaeOPF3ufMFYJr4aET6Q4CH37F/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-transparent text-[#111] px-5 md:px-8 py-3 rounded-full font-medium text-[11px] md:text-[14px] border border-[#ccc] hover:border-[#111] transition-all duration-300 uppercase tracking-wide text-left flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2 overflow-hidden whitespace-nowrap"
                >
                  <span className="min-w-[80px] md:min-w-[100px] inline-block transition-transform duration-300 group-hover:translate-x-[1px] text-center sm:text-left">
                    Download CV
                  </span>
                  <div className="relative overflow-hidden w-[16px] h-[16px] hidden sm:block">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-500 group-hover:translate-y-[20px]"
                    >
                      <path d="M12 3v13M7 11l5 5 5-5M5 21h14"></path>
                    </svg>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute top-[-20px] left-0 transition-all duration-500 group-hover:translate-y-[20px]"
                    >
                      <path d="M12 3v13M7 11l5 5 5-5M5 21h14"></path>
                    </svg>
                  </div>
                </a>
              </div>

              <div
                ref={skillsRef}
                className="mt-4 md:mt-6 flex flex-row items-center h-[24px] opacity-0"
              >
                <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-3">
                  <AnimatePresence mode="popLayout">
                    {visibleSkills.map((skill, i) => (
                      <div
                        key={skill.name}
                        className="flex items-center gap-x-4 overflow-hidden py-1"
                      >
                        <motion.div
                          initial={{ y: "100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: "-100%", opacity: 0 }}
                          transition={{
                            delay: i * 0.1,
                            duration: 0.7,
                            ease: [0.16, 1, 0.3, 1], // Expo Out
                          }}
                          className="flex items-center gap-2 group cursor-default"
                        >
                          <div className="w-5 h-5 flex items-center justify-center transition-all duration-300 group-hover:scale-125">
                            {skill.icon}
                          </div>
                          <span className="text-[13px] md:text-[14px] text-[#444] font-semibold whitespace-nowrap tracking-tight">
                            {skill.name}
                          </span>
                        </motion.div>

                        {i < batchSize - 1 && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ delay: i * 0.1 + 0.3 }}
                            className="text-[#eee] md:block hidden font-light"
                          >
                            /
                          </motion.span>
                        )}
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Side Image - Now order-1 on mobile */}
            <div className="relative flex justify-center md:justify-end md:pe-10 mb-12 md:mb-0 lg:pt-10 w-full min-w-0 order-1 md:order-2 pt-12 md:pt-0">
              <div
                ref={imgCardRef}
                className="w-[220px] h-[280px] md:w-[300px] md:h-[400px] aspect-[4/5] shadow-lg rounded-[24px] bg-[#eee] overflow-hidden relative opacity-0 hover:grayscale-0 transition-all duration-700 group will-change-transform"
              >
                <Image
                  src="/images/about/SS.png"
                  alt="Hazem Anwar Portrait"
                  fill
                  priority
                  quality={90}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Experience Badge */}
              <div
                ref={badgeRef}
                className="absolute md:-bottom-6 -bottom-10 md:-right-6 right-2 md:w-[120px] md:h-[120px] w-[100px] h-[100px] bg-white rounded-full shadow-2xl flex items-center justify-center z-20 opacity-0 scale-50"
              >
                <svg
                  className="absolute w-full h-full animate-[spin_20s_linear_infinite]"
                  viewBox="0 0 100 100"
                >
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[7.5px] font-bold uppercase tracking-[0.22em] fill-[#111]">
                    <textPath href="#circlePath" startOffset="0%">
                      FRONT-END ENGINEER ✧ PRODUCT DESIGNER ✧
                    </textPath>
                  </text>
                </svg>
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-[#111] leading-none">
                    6+
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#666] mt-1">
                    Years
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className=" mt-8 lg:mt-12">
            <LogoSlider />
          </div>
        </div>
      </section>

      {/* Mobile Fixed Bottom Buttons */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[150] flex flex-row items-center gap-3 transition-all rounded-t-md duration-500 ease-in-out p-1 pb-2 bg-white/60 backdrop-blur-xl border-t border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)]   ${
          showFixedMobileBtns
            ? "translate-y-0 opacity-100"
            : "translate-y-[150%] opacity-0 pointer-events-none"
        }`}
      >
        <Link
          href="/work"
          className="flex-1 bg-[#111] text-white py-2.5 rounded-full font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 text-center h-[42px] uppercase tracking-wider"
        >
          <span> works</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </Link>
        <a
          href="https://drive.google.com/file/d/1uUFMJ2NaeOPF3ufMFYJr4aET6Q4CH37F/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-white text-[#111] py-2.5 rounded-full font-bold text-[11px] shadow-sm border border-[#cdcdcd] flex items-center justify-center gap-1.5 whitespace-nowrap h-[42px] uppercase tracking-wider"
        >
          <span>Resume</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v13M7 11l5 5 5-5M5 21h14"></path>
          </svg>
        </a>
      </div>
    </>
  );
}
