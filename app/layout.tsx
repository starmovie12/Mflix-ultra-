import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WatchlistProvider } from "../context/WatchlistContext";
import { ToastProvider }     from "../context/ToastContext";
import { NetworkStatus }     from "../components/NetworkStatus";

export const viewport: Viewport = {
  themeColor: '#03060f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "MFLIX — Cinema. Redefined.",
  description: "Premium HD streaming. Better than Netflix, Prime & Hotstar.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'MFLIX' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <WatchlistProvider>
          <ToastProvider>
            <NetworkStatus />
            {children}
          </ToastProvider>
        </WatchlistProvider>
      </body>
    </html>
  );
}
