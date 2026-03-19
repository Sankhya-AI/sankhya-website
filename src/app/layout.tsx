import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteMeta } from "@/content/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.title,
    template: `%s · ${siteMeta.title}`,
  },
  description: siteMeta.description,
  applicationName: siteMeta.name,
  keywords: siteMeta.keywords,
  category: "education",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    url: siteMeta.url,
    siteName: siteMeta.name,
    images: [
      {
        url: "/brand/sankhya-logo.png",
        width: 500,
        height: 500,
        alt: "Sankhya AI Labs",
      },
    ],
    locale: siteMeta.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
    images: ["/brand/sankhya-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteMeta.name,
    url: siteMeta.url,
    logo: `${siteMeta.url}/brand/sankhya-logo.png`,
    sameAs: [
      "https://www.sensai.co.in",
      "https://engram.sensai.co.in",
      "https://github.com/Sankhya-AI/Dhee",
    ],
    description: siteMeta.description,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMeta.name,
    url: siteMeta.url,
    description: siteMeta.description,
    inLanguage: siteMeta.locale,
    publisher: {
      "@type": "Organization",
      name: siteMeta.name,
    },
  };

  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        <Script
          id="sankhya-org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="sankhya-website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <div className="relative min-h-screen">
          <div className="page-glow" />
          <div className="page-pattern" />
          <div className="relative z-10 flex min-h-screen flex-col">
            <SiteHeader />
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-48 pb-8 sm:px-6 sm:pt-44 md:px-10 md:pt-48 md:pb-12 lg:px-12 lg:pt-32">
              {children}
            </main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
