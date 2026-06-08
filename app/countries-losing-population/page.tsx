import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { RankingsTable } from "../rankings/_components/rankings-table"

export const metadata: Metadata = {
  title: "Countries Losing Population 2026 - Declining Demographics",
  description:
    "View the list of countries with declining growth rates. Explore nations experiencing population shrinkage, aging demographics, and negative growth patterns.",
}

export default async function CountriesLosingPopulationPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Countries Losing Population
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Nations experiencing negative demographic growth, sorted by speed of
          headcount contraction (fastest population loss at the top).
        </p>
      </div>

      <AdSenseBlock slot="losing-seo-top" format="horizontal" />

      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <RankingsTable
          countries={countries}
          defaultSort="growth"
          filterLosingOnly={true}
        />
      </Suspense>

      <AdSenseBlock slot="losing-seo-bottom" format="horizontal" />
    </div>
  )
}
