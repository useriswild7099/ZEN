import type { Metadata } from "next";
import { Inter, Space_Grotesk, Courier_Prime } from "next/font/google";
import "./globals.css";
import { DYNAMIC_CLASSES } from '@/lib/safelist';
import { SmoothScroller } from "@/components/SmoothScroller";

// Ensure Tailwind sees these classes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _safelist = DYNAMIC_CLASSES;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZenGuard AI - Your Safe Space",
  description: "Anonymous, privacy-first mental health support. Express yourself freely - nothing is stored.",
  applicationName: "ZenGuard AI",
  keywords: ["mental health", "student wellness", "anonymous journaling", "stress relief", "privacy-first", "mindfulness"],
  authors: [{ name: "ZenGuard AI" }],
  openGraph: {
    title: "ZenGuard AI - Your Safe Space",
    description: "Express yourself freely. We analyze, support, and never store.",
    type: "website",
    siteName: "ZenGuard AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZenGuard AI - Your Safe Space",
    description: "Anonymous, privacy-first mental health support. Express yourself freely - nothing is stored.",
  },
  appleWebApp: {
    title: "ZenGuard AI",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${courierPrime.variable}`}>
      <body className="antialiased bg-[#F9F8F6] text-zinc-900 paper-textured-bg relative min-h-screen">
        {/* Universal Satisfying Tactile Paper Grain Overlay across entire application */}
        <div 
          className="fixed inset-0 pointer-events-none z-50 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: "url('/paper-texture-light.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "320px 320px"
          }}
          aria-hidden="true"
        />

        {/* Privacy Notice - Visible on desktop, hidden on mobile to avoid viewport clipping */}
        <div className="fixed bottom-4 left-4 z-40 hidden md:block">
          <div className="privacy-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>100% Private</span>
          </div>
        </div>
        
        {/* Main Content */}
        <SmoothScroller>
          <div className="min-h-screen relative z-10">
            {children}
          </div>
        </SmoothScroller>
        
        {/* Statutory Rights & Schemes Footer */}
        <footer className="text-center py-6 px-4 text-xs text-zinc-600 border-t border-zinc-300/50 bg-white/30 backdrop-blur-sm">
          <p className="font-medium text-zinc-700">Zero-Knowledge Offline Privacy · No chat transcripts or journal entries leave your device.</p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-zinc-600">
            <a href="https://telemanas.mohfw.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 underline underline-offset-2">
              Tele-MANAS (24/7 Helpline: 14416)
            </a>
            <span>•</span>
            <a href="https://nalsa.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 underline underline-offset-2">
              NALSA Free Legal Aid (15100)
            </a>
            <span>•</span>
            <a href="https://socialjustice.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 underline underline-offset-2">
              Sec 15A SC/ST PoA Witness Protection
            </a>
            <span>•</span>
            <a href="https://socialjustice.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 underline underline-offset-2">
              Rule 12(4) Rehabilitation Relief
            </a>
          </div>
        </footer>
      </body>
    </html>

  );
}
