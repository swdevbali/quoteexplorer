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
  title: {
    default: "Quote Explorer",
    template: "%s | Quote Explorer"
  },
  description: "Discover and share inspiring quotes from famous authors, thinkers, and personalities. Create your personal collection and explore wisdom from around the world.",
  keywords: ["quotes", "inspiration", "wisdom", "famous quotes", "motivational quotes", "life quotes"],
  authors: [{ name: "Remote Worker Indonesia", url: "https://remoteworker.id" }],
  creator: "Remote Worker Indonesia",
  publisher: "Remote Worker Indonesia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Quote Explorer",
    description: "Discover and share inspiring quotes from famous authors, thinkers, and personalities.",
    url: '/',
    siteName: "Quote Explorer",
    images: [
      {
        url: '/api/og?quote=Discover and share inspiring quotes from famous authors, thinkers, and personalities&author=Quote Explorer',
        width: 1200,
        height: 630,
        alt: 'Quote Explorer - Discover and share inspiring quotes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Quote Explorer",
    description: "Discover and share inspiring quotes from famous authors, thinkers, and personalities.",
    images: ['/api/og?quote=Discover and share inspiring quotes from famous authors, thinkers, and personalities&author=Quote Explorer'],
    creator: '@remoteworkerid',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png?v=2" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
