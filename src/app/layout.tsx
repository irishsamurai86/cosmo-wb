import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL("https://wb.cosmosalonstudios.com"),
  title: "West Bloomfield Private Salon Suites | Cosmo Salon Studios",
  description:
    "Elite private salon suites in West Bloomfield. No commission. No ceiling. Upgrade your beauty brand and book a private tour today.",
  keywords: [
    "West Bloomfield salon suites",
    "private salon studio rental",
    "beauty studio lease",
    "Cosmo Salon Studios",
    "Michigan salon suites",
  ],
  openGraph: {
    title: "West Bloomfield Private Salon Suites | Cosmo",
    description:
      "Upgrade to an elite private salon studio in West Bloomfield. Limited suites available.",
    url: "https://wb.cosmosalonstudios.com",
    siteName: "Cosmo Salon Studios",
    images: [
      {
        url: "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a3-1024x882.jpg",
        width: 1200,
        height: 630,
        alt: "Cosmo Salon Studios West Bloomfield",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "West Bloomfield Private Salon Suites",
    description:
      "Elite private salon suites. No commission. Book your private tour.",
    images: [
      "https://cosmosalonstudios.com/wp-content/uploads/2024/04/Gallery-2-a3-1024x882.jpg",
    ],
  },
  alternates: {
    canonical: "https://wb.cosmosalonstudios.com",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
