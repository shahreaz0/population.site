import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { RankingsTable } from "../rankings/_components/rankings-table"

export const revalidate = 86400 // Revalidate once per day (ISR)

export const metadata: Metadata = {
  title: "List of Countries by Population 2026 - Demographic Stats",
  description:
    "Explore global population rankings. Browse the complete list of countries and territories sorted by estimated population size in 2026.",
}

export default async function CountriesByPopulationPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          List of Countries by Population
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Comprehensive demographics directory of countries and sovereign
          territories sorted by total population size in 2026.
        </p>
      </div>

      <AdSenseBlock slot="countries-pop-top" format="horizontal" />

      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <RankingsTable countries={countries} defaultSort="population" />
      </Suspense>

      <AdSenseBlock slot="countries-pop-bottom" format="horizontal" />
    </div>
  )
}
