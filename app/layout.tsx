import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Year Progress Wallpaper Generator",
  description: "Create customizable year-progress wallpapers for your iPhone. Track days passed with a beautiful circle grid visualization.",
  keywords: ["wallpaper", "year progress", "iPhone", "iOS", "calendar", "productivity"],
  authors: [{ name: "Year Progress" }],
  openGraph: {
    title: "Year Progress Wallpaper Generator",
    description: "Create customizable year-progress wallpapers for your iPhone",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Year Progress Wallpaper Generator",
    description: "Create customizable year-progress wallpapers for your iPhone",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
