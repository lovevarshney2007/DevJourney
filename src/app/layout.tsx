import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-bg text-text-primary antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
