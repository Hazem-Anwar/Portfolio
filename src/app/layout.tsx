import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Grain from "@/components/Grain";
import LoaderProvider from "@/components/LoaderProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://hazemanwar.com"),
  title: {
    default: "Hazem Anwar — Frontend Engineer & Product Designer",
    template: "%s | Hazem Anwar",
  },
  description:
    "Portfolio of Hazem Anwar — Frontend Engineer and Product Designer based in Cairo, Egypt specializing in Next.js, React, TypeScript, GSAP, and Three.js.",
  keywords: [
    "Hazem Anwar",
    "Frontend Engineer",
    "Product Designer",
    "Cairo",
    "Egypt",
    "Next.js",
    "React",
    "TypeScript",
    "GSAP",
    "Three.js",
    "UI/UX Design",
    "Web Development",
  ],
  authors: [{ name: "Hazem Anwar" }],
  creator: "Hazem Anwar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hazemanwar.com",
    title: "Hazem Anwar — Frontend Engineer & Product Designer",
    description:
      "Portfolio of Hazem Anwar — Frontend Engineer and Product Designer based in Cairo, Egypt specializing in Next.js, React, TypeScript, GSAP, and Three.js.",
    siteName: "Hazem Anwar Portfolio",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hazem Anwar — Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hazem Anwar — Frontend Engineer & Product Designer",
    description:
      "Portfolio of Hazem Anwar — Frontend Engineer and Product Designer based in Cairo, Egypt specializing in Next.js, React, TypeScript, GSAP, and Three.js.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import NavbarLight from "@/components/NavbarLight";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hazem Anwar",
  jobTitle: ["Frontend Engineer", "Product Designer"],
  url: "https://hazemanwar.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cairo",
    addressCountry: "Egypt"
  },
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "GSAP",
    "Three.js",
    "UI/UX Design",
    "Web Development"
  ]
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-bg">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Bebas+Neue&family=Epilogue:ital,wght@0,100..900;1,100..900&family=Caveat:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LoaderProvider>
          <Grain />
          <NavbarLight />
          {children}
          <Analytics />
        </LoaderProvider>
      </body>
    </html>
  );
}
