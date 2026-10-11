import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { DemoLink } from "./(routes)/_components/DemoLink";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kopi — Desk d'impression",
  description:
    "Kopi: gestion des travaux d'impression pour imprimeries et cybercafé-imprimeries de Kinshasa. Rapide, hors ligne, PWA.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Kopi" },
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <Providers>
          <header className="sticky top-0 z-40 border-b border-line/70 bg-surface/75 backdrop-blur-xl pt-safe">
            <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2">
                <img src="/brand/logo.svg" alt="Kopi" className="h-8 w-auto" />
              </Link>
              <DemoLink />
            </div>
          </header>
          <main className="mx-auto w-full max-w-screen-sm flex-1 px-4 pb-tabbar pt-4">
            {children}
          </main>
          <FooterNav />
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }`,
          }}
        />
      </body>
    </html>
  );
}

async function FooterNav() {
  const { BottomNav } = await import("./(routes)/_components/BottomNav");
  return <BottomNav />;
}
