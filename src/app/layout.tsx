import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AeroEdit",
  description:
    "AeroEdit is a powerful team design collaboration app and image editor. With plans for businesses of all sizes, streamline your workflow with real-time collaboration, advanced editing tools, and seamless project management.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} min-h-full dark`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
