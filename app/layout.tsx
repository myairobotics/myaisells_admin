import type { Metadata } from "next";
import { Rubik, Raleway, Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Atoms/Layout";

// Load the fonts from Google Fonts
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: "MYaiSells - Human-AI",
  description:
    "MYai is an advanced AI-powered platform designed to simplify complex tasks, enhance productivity, and provide intelligent solutions.",
  keywords: ["AI", "Productivity", "Automation", "MYai"],
  authors: [{ name: "VinJex" }],
  manifest: "/site.webmanifest",
  openGraph: {
    title: "MYaiSells - Human-AI",
    description:
      "MYai is an advanced AI-powered platform designed to simplify complex tasks, enhance productivity, and provide intelligent solutions.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    type: "website",
    images: [{ url: "/assets/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MYaiSells - Human-AI",
    description:
      "MYai is an advanced AI-powered platform designed to simplify complex tasks, enhance productivity, and provide intelligent solutions.",
    images: ["/assets/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${rubik.variable} ${raleway.variable} ${inter.variable} antialiased`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
