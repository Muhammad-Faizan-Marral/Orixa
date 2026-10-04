import type { Metadata, Viewport } from "next";
import { ReferralCapture } from "@/components/referral-capture";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { Bodoni_Moda, Schibsted_Grotesk } from "next/font/google";
import { Instrument_Serif,Geist } from "next/font/google";


import { ThemeProvider } from "@/components/theme-provider";
import { LocaleProvider } from "@/components/locale-provider";
import { TimezoneProvider } from "@/components/timezone-provider";
import { NetworkStatusBanner } from "@/components/network-status-banner";
import { ToastProvider } from "@/components/toast";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { LOCALE_INIT_SCRIPT } from "@/i18n/locale";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    "monospace",
  ],
});
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});
const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  display: "swap",
});
const display = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});
const text = Schibsted_Grotesk({
  variable: "--font-text",
  subsets: ["latin"],
  display: "swap",
});

//Our Desired google Fonts implement here and use
export const metadata: Metadata = {
  title: {
    default: "Orixa AI — Portfolios that build and think with you",
    template: "%s · Orixa AI",
  },
  description:
    "Orixa AI is an AI-powered portfolio builder for developers, designers and students.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090c" },
    { media: "(prefers-color-scheme: light)", color: "#fbfbfc" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${dmSans.variable} ${bricolage.variable} ${jetbrainsMono.variable} ${display.variable} ${text.variable} ${instrument.variable} ${geist.variable} h-full antialiased`}
    >
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `${THEME_INIT_SCRIPT}${LOCALE_INIT_SCRIPT}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <SpeedInsights />
        <ThemeProvider>
          <LocaleProvider>
            <TimezoneProvider>
              <ReferralCapture />
              {children}
            </TimezoneProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
