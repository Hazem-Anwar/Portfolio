import type { Metadata } from "next";
import "./globals.css";
import Grain from "@/components/Grain";
import Cursor from "@/components/Cursor";

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
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Epilogue:ital,wght@0,100..900;1,100..900&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-text antialiased">
        <Grain />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
