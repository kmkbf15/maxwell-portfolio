import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PaletteProvider } from "@/components/providers/palette-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navbar } from "@/components/nav/navbar";
import { ScrollProgress } from "@/components/nav/scroll-progress";
import "./globals.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Display font is only used for big headlines/name — drop the lighter weights
// to cut roughly half the font payload.
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maxwell Gilbert Gunawan — Frontend Developer",
  description:
    "Junior frontend developer crafting interfaces that feel alive.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${display.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PaletteProvider>
            <SmoothScroll />
            <ScrollProgress />
            <Navbar />
            <div id="top">{children}</div>
          </PaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
