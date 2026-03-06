import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cannabi - Cannabis Dispensery Management System",
  description: "Comprehensive cannabis dispensery management system with POS, inventory, AI accounting, and compliance tracking for cannabis retailers.",
  keywords: ["cannabi", "cannabis", "dispensary", "POS", "inventory", "compliance", "accounting", "delivery", "QR authentication"],
  authors: [{ name: "Cannabi Team" }],
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  metadataBase: new URL('https://cannabi.vercel.app'),
  alternates: {
    canonical: 'https://cannabi.vercel.app'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cannabi",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Cannabi - Cannabis Dispensery Management System",
    description: "Complete cannabis dispensery management with POS, inventory, AI accounting, and compliance tracking",
    type: "website",
    url: 'https://cannabi.vercel.app',
    siteName: 'Cannabi',
  },
  twitter: {
    card: "summary_large_image",
    title: "Cannabi - Cannabis Dispensery Management System",
    description: "Complete cannabis dispensery management with POS, inventory, AI accounting, and compliance tracking",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#16a34a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cannabi" />
        <meta name="application-name" content="Cannabi" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="canonical" href="https://cannabi.vercel.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}