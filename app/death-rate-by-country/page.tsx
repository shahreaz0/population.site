import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { RankingsTable } from "../rankings/_components/rankings-table"

export const revalidate = 86400 // Revalidate once per day (ISR)

export const metadata: Metadata = {
  title: "Death Rate by Country 2026 - Global Demographic Rankings",
  description:
    "Explore global death rate statistics. Browse the list of countries sorted by crude death rates per 1,000 people per year.",
}

export default async function DeathRateByCountryPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Death Rate by Country
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Nations ranked by their crude death rate, representing the annual
          number of deaths per 1,000 residents.
        </p>
      </div>

      <AdSenseBlock slot="death-seo-top" format="horizontal" />

      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <RankingsTable countries={countries} defaultSort="death" />
      </Suspense>

      <AdSenseBlock slot="death-seo-bottom" format="horizontal" />
    </div>
  )
}
