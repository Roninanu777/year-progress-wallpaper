import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Live Calendar — Wallpaper Generator",
  description: "Create customizable year-progress wallpapers for your iPhone. Track days passed with a beautiful circle grid visualization.",
  keywords: ["wallpaper", "year progress", "iPhone", "iOS", "calendar", "productivity"],
  authors: [{ name: "Live Calendar" }],
  openGraph: {
    title: "Live Calendar — Wallpaper Generator",
    description: "Create customizable year-progress wallpapers for your iPhone",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Calendar — Wallpaper Generator",
    description: "Create customizable year-progress wallpapers for your iPhone",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
