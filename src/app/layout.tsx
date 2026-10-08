import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Bodoni_Moda,
  DM_Sans,
  Geist,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Schibsted_Grotesk,
} from "next/font/google";

import { SpeedInsights } from "@vercel/speed-insights/next";

import { ReferralCapture } from "@/components/referral-capture";
import { LocaleProvider } from "@/components/locale-provider";
import { NetworkStatusBanner } from "@/components/network-status-banner";
import { ThemeProvider } from "@/components/theme-provider";
import { TimezoneProvider } from "@/components/timezone-provider";
import { ToastProvider } from "@/components/toast";
import { Analytics } from "@vercel/analytics/next";
import { LOCALE_INIT_SCRIPT } from "@/i18n/locale";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

import "./globals.css";

/* ============================================================================
   FONT SYSTEM
============================================================================ */

/**
 * Primary UI / body font.
 * Good readability across dashboard, forms and product UI.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

/**
 * Premium display font used for stronger headings / landing sections.
 */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

/**
 * Monospace font for technical / metadata / portfolio details.
 */
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

/**
 * Editorial serif for premium / cinematic typography.
 */
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

/**
 * Clean product/UI font.
 */
const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  display: "swap",
});

/**
 * High-contrast display serif.
 * Useful for premium landing-page moments.
 */
const display = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

/**
 * Geist for modern product/dashboard surfaces.
 */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Secondary modern text/display system.
 */
const text = Schibsted_Grotesk({
  variable: "--font-text",
  subsets: ["latin"],
  display: "swap",
});

/* ============================================================================
   SITE METADATA
============================================================================ */

export const metadata: Metadata = {
  metadataBase: new URL("https://www.orixaai.me"),

  applicationName: "OrixaAI",

  title: {
    default: "OrixaAI — Portfolios that build and think with you",
    template: "%s · OrixaAI",
  },

  description:
    "OrixaAI is an AI-powered portfolio builder for developers, designers, students and freelancers. Build a distinctive portfolio, publish it instantly and let your work speak for itself.",
  verification: {
    google: "rRpCWIehy1C11-YIpYXkiB5Uc1VNuTyTuZ9NKTFS4Ns",
  },
  keywords: [
    "OrixaAI",
    "AI portfolio builder",
    "portfolio builder",
    "developer portfolio",
    "designer portfolio",
    "student portfolio",
    "freelancer portfolio",
    "AI powered portfolio",
    "personal portfolio",
    "online portfolio",
  ],

  authors: [
    {
      name: "OrixaAI",
      url: "https://www.orixaai.me",
    },
  ],

  creator: "OrixaAI",
  publisher: "OrixaAI",

  category: "technology",

  referrer: "origin-when-cross-origin",

  icons: {
    icon: [
      {
        url: "/justLogoWihoutText.png",
        type: "image/png",
      },
      {
        url: "/justLogo-removebg-preview.png",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/justLogoWihoutText.png",
        type: "image/png",
      },
    ],

    shortcut: ["/justLogoWihoutText.png"],
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.orixaai.me",
    siteName: "OrixaAI",

    title: "OrixaAI — Portfolios that build and think with you",

    description:
      "Build a premium portfolio with OrixaAI. Bring your projects, experience and resume together into a portfolio designed to help your career move forward.",

    images: [
      {
        url: "/logowithBGandText.png",
        alt: "OrixaAI",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "OrixaAI — Portfolios that build and think with you",

    description:
      "Build a premium, AI-powered portfolio with OrixaAI and turn your work into a career-ready presence.",

    images: ["/logowithBGandText.png"],
  },

  /**
   * Keep the root layout crawl-friendly.
   *
   * Private dashboard/auth pages should define their own robots metadata
   * so they can explicitly use noindex where appropriate.
   */
};

/* ============================================================================
   VIEWPORT
============================================================================ */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,

  themeColor: [
    {
      media: "(prefers-color-scheme: dark)",
      color: "#08090c",
    },
    {
      media: "(prefers-color-scheme: light)",
      color: "#fbfbfc",
    },
  ],

  colorScheme: "light dark",
};

/* ============================================================================
   ROOT LAYOUT
============================================================================ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${inter.variable}
        ${dmSans.variable}
        ${bricolage.variable}
        ${jetbrainsMono.variable}
        ${display.variable}
        ${text.variable}
        ${instrument.variable}
        ${geist.variable}
        h-full
        antialiased
      `}
    >
      <head>
        {/*
          Prevent theme / locale flash before React hydrates.

          Both initialization scripts are intentionally kept together
          because they must execute as early as possible.
        */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `${THEME_INIT_SCRIPT}${LOCALE_INIT_SCRIPT}`,
          }}
        />
      </head>

      <body
        className="
          min-h-full
          flex
          flex-col
          bg-background
          text-foreground
          font-sans
          antialiased
          selection:bg-primary/20
          selection:text-foreground
        "
      >
        {/* Vercel performance monitoring */}
        <SpeedInsights />

        <ThemeProvider>
          <LocaleProvider>
            <TimezoneProvider>
              {/* Referral attribution / referral capture */}
              <ReferralCapture />

              {/* Network/offline state feedback */}
              <NetworkStatusBanner />

              {/* Application content */}
              {children}
              <Analytics />
              {/* Global toast system */}
            </TimezoneProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
