import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import "./globals.css"
import { BottomNav } from "@/components/bottom-nav"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SearchDialog } from "@/components/search-dialog"
import { ThemeProvider } from "@/components/theme-provider"
import { getAllCountries } from "@/lib/data/countries"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Population.site — World Population Database 2026",
    template: "%s | Population.site",
  },
  description:
    "Search live population data, rankings, densities, and growth rates for 240+ countries. The world's real-time population search engine.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const countries = await getAllCountries()
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <NuqsAdapter>
            <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <Footer />
              <SearchDialog countries={countries} />
              <BottomNav />
            </div>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}
