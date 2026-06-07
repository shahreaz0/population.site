import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { RankingsTable } from "../rankings/_components/rankings-table"

export const revalidate = 86400 // Revalidate once per day (ISR)

export const metadata: Metadata = {
  title: "Median Age by Country 2026 - Age Demographic Profiles",
  description:
    "Analyze age demographic statistics. Browse the list of countries sorted by median age, highlighting the oldest and youngest societies.",
}

export default async function MedianAgeByCountryPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Median Age by Country
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Nations ranked by median age. Higher values reflect mature or aging
          societies, while lower numbers highlight exceptionally young
          demographics.
        </p>
      </div>

      <AdSenseBlock slot="age-seo-top" format="horizontal" />

      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <RankingsTable countries={countries} defaultSort="age" />
      </Suspense>

      <AdSenseBlock slot="age-seo-bottom" format="horizontal" />
    </div>
  )
}
