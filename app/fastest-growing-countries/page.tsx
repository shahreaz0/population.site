import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { RankingsTable } from "../rankings/_components/rankings-table"

export const metadata: Metadata = {
  title: "Fastest Growing Countries 2026 - Population Growth Rates",
  description:
    "Discover which countries are expanding the fastest. View the rankings of global nations by annual growth rates, birth/death statistics, and demographic changes.",
}

export default async function FastestGrowingCountriesPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Fastest Growing Countries
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Nations ranked by their annual population growth rate. High growth
          rates are typical of expanding developing economies.
        </p>
      </div>

      <AdSenseBlock slot="growth-seo-top" format="horizontal" />

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

      <AdSenseBlock slot="growth-seo-bottom" format="horizontal" />
    </div>
  )
}
