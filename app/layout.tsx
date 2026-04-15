import { Inria_Sans, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

// Default metadata — applies to any page that doesn't export its own.
// The home page uses "use client" (for FillText) so it can't export metadata;
// this layout export covers it. Project pages override the title with their own export.
export const metadata: Metadata = {
  title: "Nicolas Holzapfel's portfolio",
  description:
    "Over a decade of turning big, messy tech into tools for humans. My thing: grappling with complexity, putting chaos to order, shipping quality fast.",
  openGraph: {
    description:
      "Over a decade of turning big, messy tech into tools for humans. My thing: grappling with complexity, putting chaos to order, shipping quality fast.",
  },
}

// Inria Sans — the font used on the original v1 site.
// weight: the three variants the v1 used; style: both roman and italic.
const inriaSans = Inria_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inriaSans.variable)}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
