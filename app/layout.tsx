import { Geist_Mono, Inter } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import "./globals.css"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SearchDialog } from "@/components/search-dialog"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

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
              <main className="flex-1">{children}</main>
              <Footer />
              <SearchDialog />
            </div>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}
