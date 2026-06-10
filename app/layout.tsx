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

const siteDescription =
  "Track every opportunity in one place. Stay organized throughout your job search with applications, interviews, and follow-ups in one dashboard.";

export const metadata: Metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : new URL("http://localhost:3000"),
  title: {
    default: "CareerFlow",
    template: "%s | CareerFlow",
  },
  description: siteDescription,
  applicationName: "CareerFlow",
  openGraph: {
    title: "CareerFlow",
    description: siteDescription,
    siteName: "CareerFlow",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "CareerFlow",
    description: siteDescription,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
