import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./editorial.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jauhardecor.com";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Jauhar Decor | Architectural Glass & Aluminum", template: "%s | Jauhar Decor" },
  description: "Precision glass, aluminum and interior solutions for extraordinary spaces. Explore bespoke partitions, facades, windows, doors and furnishings by Jauhar Decor.",
  keywords: ["Jauhar Decor", "architectural glass", "aluminum fabrication", "glass partitions", "aluminum windows", "glass facades", "home furnishing"],
  alternates: { canonical: "/" },
  openGraph: { title: "Jauhar Decor | Precision in Every Pane", description: "Architectural glass and aluminum crafted to bring extraordinary spaces to life.", url: siteUrl, siteName: "Jauhar Decor", images: [{ url: "/images/hero-editorial.jpg", width: 1200, height: 1500, alt: "Jauhar Decor architectural glass interior" }], type: "website" },
  twitter: { card: "summary_large_image", title: "Jauhar Decor | Precision in Every Pane", images: ["/images/hero-editorial.jpg"] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
