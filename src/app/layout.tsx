import type { Metadata } from "next";
import "./globals.css";
import Grain from "@/components/Grain";
import LoaderProvider from "@/components/LoaderProvider";

export const metadata: Metadata = {
  title: "Hazem Anwar — Product Designer & Frontend Engineer",
  description:
    "Portfolio of Hazem Anwar — Product Designer and Frontend Engineer specializing in product design, design systems, and high-performance web experiences.",
  keywords: [
    "Hazem Anwar",
    "Product Designer",
    "Frontend Engineer",
    "Design Systems",
    "UX Design",
    "React",
    "Next.js",
  ],
  openGraph: {
    title: "Hazem Anwar — Product Designer & Frontend Engineer",
    description: "Portfolio of Hazem Anwar — bridging design and code.",
    type: "website",
  },
};

import NavbarLight from "@/components/NavbarLight";

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
        <LoaderProvider>
          <Grain />
          <NavbarLight />
          {children}
        </LoaderProvider>
      </body>
    </html>
  );
}
