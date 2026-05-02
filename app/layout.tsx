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

// Runs before paint — applies the saved palette from localStorage so the
// accent color doesn't flash orange (default) → picked color on refresh.
const paletteInitScript = `(function(){try{var p=localStorage.getItem('portfolio-palette');var c=localStorage.getItem('portfolio-custom-accent');var h=document.documentElement;if(p==='custom'&&c){h.style.setProperty('--accent',c);var x=c.replace('#','');if(x.length===6){var r=parseInt(x.slice(0,2),16),g=parseInt(x.slice(2,4),16),b=parseInt(x.slice(4,6),16);var l=(0.2126*r+0.7152*g+0.0722*b)/255;h.style.setProperty('--accent-foreground',l>0.6?'#0a0a0a':'#ffffff');}}else if(p&&p!=='default'){h.setAttribute('data-palette',p);}}catch(e){}})();`;

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
      <head>
        {/* Runs synchronously during HTML parse, before any paint — applies
            saved palette so the lamp glow doesn't flash orange on refresh.
            React 19 may warn about a script in a component; safe to ignore
            since this is a once-on-load script that doesn't need to re-run. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: paletteInitScript }}
        />
      </head>
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
