import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { RankingsTable } from "../rankings/_components/rankings-table"

export const revalidate = 86400 // Revalidate once per day (ISR)

export const metadata: Metadata = {
  title: "Population Growth Rate by Country 2026 - Demographic Stats",
  description:
    "Explore annual growth rate statistics. View the list of countries sorted by population growth rate, detailing national expansion speeds.",
}

export default async function PopulationGrowthRateByCountryPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Population Growth Rate by Country
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Sovereign nations and territories ranked by their annual demographic
          growth rate, representing births, deaths, and migration changes.
        </p>
      </div>

      <AdSenseBlock slot="growth-rate-seo-top" format="horizontal" />

      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <RankingsTable countries={countries} defaultSort="growth" />
      </Suspense>

      <AdSenseBlock slot="growth-rate-seo-bottom" format="horizontal" />
    </div>
  )
}
