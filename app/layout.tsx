import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Geist, Geist_Mono } from "next/font/google";
import { PageBackdrop } from "@/components/PageBackdrop";
import { site } from "@/lib/content";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

const display = Space_Grotesk({ weight: ["500", "700"], subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Geist({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const siteUrl = getSiteUrl();
// Without SITE_URL, social-image links fall back to localhost, so never ship that to production.
if (!siteUrl && process.env.VERCEL_ENV === "production") {
  throw new Error("SITE_URL must be set to the public https origin for production builds.");
}

export const metadata: Metadata = {
  ...(siteUrl && { metadataBase: siteUrl, alternates: { canonical: "/" } }),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    ...(siteUrl && { url: "/" }),
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#A8B5E8",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <PageBackdrop />
        {children}
      </body>
    </html>
  );
}
