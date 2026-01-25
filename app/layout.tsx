import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://facet-one.vercel.app'),
  title: {
    default: 'Facet - Curate Your GitHub Portfolio',
    template: '%s | Facet'
  },
  description: 'Transform your GitHub repositories into a beautiful, organized portfolio. Showcase your best work, add context to projects, and share your developer journey with recruiters and collaborators.',
  keywords: [
    'GitHub portfolio',
    'developer portfolio',
    'GitHub showcase',
    'repository organizer',
    'GitHub profile',
    'project curation',
    'developer projects',
    'GitHub collections',
    'portfolio builder',
    'code portfolio'
  ],
  authors: [{ name: 'Facet Team' }],
  creator: 'Facet',
  publisher: 'Facet',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://facet-one.vercel.app',
    siteName: 'Facet',
    title: 'Facet - Curate Your GitHub Portfolio',
    description: 'Transform your GitHub repositories into a beautiful, organized portfolio. Showcase your best work and share your developer journey.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Facet - GitHub Portfolio Curation Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facet - Curate Your GitHub Portfolio',
    description: 'Transform your GitHub repositories into a beautiful, organized portfolio.',
    images: ['/twitter-image.png'],
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
  verification: {
    google: 'CjsNpMkzKVq7XwbqLEdNLVqli2oVLgM-1tuo0R4oy4E',
    me: ["sigdelvishal123@gmail.com"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Facet',
    description: 'Curate your GitHub portfolio with style',
    url: 'https://facet-one.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://facet-one.vercel.app/{search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Facet',
    applicationCategory: 'DeveloperApplication',
    description: 'Transform your GitHub repositories into a beautiful, organized portfolio',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    operatingSystem: 'Web Browser'
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}

