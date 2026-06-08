import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { RankingsTable } from "../rankings/_components/rankings-table"

export const metadata: Metadata = {
  title: "Urban Population by Country 2026 - Urbanization Rates",
  description:
    "Explore urbanization statistics. View the list of countries sorted by urban population percentage, highlighting mega-cities and metropolitan expansion.",
}

export default async function UrbanPopulationByCountryPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Urban Population by Country
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Nations ranked by urbanization rate, showing the percentage of the
          total headcount residing in major urban metropolitan areas.
        </p>
      </div>

      <AdSenseBlock slot="urban-seo-top" format="horizontal" />

      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <RankingsTable countries={countries} defaultSort="urban" />
      </Suspense>

      <AdSenseBlock slot="urban-seo-bottom" format="horizontal" />
    </div>
  )
}
