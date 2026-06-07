import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { RankingsTable } from "../rankings/_components/rankings-table"

export const revalidate = 86400 // Revalidate once per day (ISR)

export const metadata: Metadata = {
  title: "Rural Population by Country 2026 - Rural Demographics",
  description:
    "Explore global rural demographic statistics. View the list of countries sorted by rural population percentage, calculated from urbanization indicators.",
}

export default async function RuralPopulationByCountryPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Rural Population by Country
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Nations ranked by rural ratio, showing the percentage of the total
          headcount residing in rural communities outside major cities
          (calculated as 100% minus the urban ratio).
        </p>
      </div>

      <AdSenseBlock slot="rural-seo-top" format="horizontal" />

      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <RankingsTable countries={countries} defaultSort="rural" />
      </Suspense>

      <AdSenseBlock slot="rural-seo-bottom" format="horizontal" />
    </div>
  )
}
