import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DevJourney — Build. Learn. Grow.",
    template: "%s | DevJourney",
  },
  description:
    "DevJourney is the unified developer productivity platform for CCC, AKGEC. Submit tasks, track your progress, and grow as a developer.",
  keywords: ["DevJourney", "CCC", "AKGEC", "developer", "tasks", "learning"],
  authors: [{ name: "Cloud Computing Cell, AKGEC" }],
  openGraph: {
    title: "DevJourney — Build. Learn. Grow.",
    description: "The unified developer productivity platform for CCC, AKGEC.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-bg-canvas text-text-primary antialiased font-sans">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
              document.addEventListener('selectstart', function(e) { e.preventDefault(); });
            `
          }}
        />
        <div className="fixed top-0 left-0 w-full h-[5px] bg-[var(--top-strip)] z-[9999]" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
