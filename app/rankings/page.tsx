import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { SEOLinksGrid } from "@/components/seo-links-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { RankingsTable } from "./_components/rankings-table"

export const metadata: Metadata = {
  title: "Population Rankings 2026 - Global Country Directory",
  description:
    "Filter, search, and sort all countries by population size, growth rate, land area, population density, median age, and urban ratios.",
}

export default async function RankingsPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      {/* Page Header */}
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Global Demographic Rankings
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Explore comprehensive listings of the world's populations. Filter by
          continent, search by name, or sort by density, growth, birth rates,
          and aging profiles.
        </p>
      </div>

      {/* AdSense Block */}
      <AdSenseBlock slot="rankings-top" format="horizontal" />

      {/* Suspense wrapper for Client Component reading searchParams */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <RankingsTable countries={countries} />
      </Suspense>

      {/* Dynamic SEO Directories */}
      <SEOLinksGrid />

      {/* AdSense Block */}
      <AdSenseBlock slot="rankings-bottom" format="horizontal" />
    </div>
  )
}
