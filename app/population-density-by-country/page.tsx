import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { RankingsTable } from "../rankings/_components/rankings-table"

export const metadata: Metadata = {
  title: "Population Density by Country 2026 - Global Density Stats",
  description:
    "View the latest rankings of countries by population density. Compare land area to headcount ratios, highlighting high-density and low-density nations.",
}

export default async function PopulationDensityByCountryPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Population Density by Country
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Demographic leaderboard of countries and territories sorted by
          population density (people per square kilometer of land area).
        </p>
      </div>

      <AdSenseBlock slot="density-seo-top" format="horizontal" />

      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <RankingsTable countries={countries} defaultSort="density" />
      </Suspense>

      <AdSenseBlock slot="density-seo-bottom" format="horizontal" />
    </div>
  )
}
