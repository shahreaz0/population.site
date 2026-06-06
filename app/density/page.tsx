import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { DensityTable } from "./_components/density-table"

export const metadata: Metadata = {
  title: "Population Density by Country 2026 - Global Land Area Ratios",
  description:
    "Explore the rankings of countries by population density. View land-to-population ratios, densest nations (like Singapore, Bangladesh), and sparsest enclaves.",
}

export default async function DensityPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      {/* Page Header */}
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Population Density Rankings
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Detailed comparison of global land ratios. Density is calculated by
          dividing a country's total population by its land area in square
          kilometers.
        </p>
      </div>

      {/* AdSense Block */}
      <AdSenseBlock slot="density-top" format="horizontal" />

      {/* Information Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border border-emerald-500/20 bg-emerald-500/1">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="font-bold text-emerald-600 text-xs uppercase tracking-wider dark:text-emerald-400">
              High Density Enclaves
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-muted-foreground text-xs leading-relaxed">
            Nations like Singapore, Monaco, and Bangladesh represent some of the
            highest human concentrations on Earth. Monaco tops density
            statistics with over 19,000 people per square kilometer, followed by
            Singapore with over 8,000. These high-density figures reflect highly
            urbanized, city-state economies.
          </CardContent>
        </Card>

        <Card className="border border-blue-500/20 bg-blue-500/1">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="font-bold text-blue-600 text-xs uppercase tracking-wider dark:text-blue-400">
              Sparsely Populated Territories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-muted-foreground text-xs leading-relaxed">
            In contrast, countries like Mongolia, Australia, and Canada have
            vast landmasses with small populations, leading to densities below 4
            people per square kilometer. In these nations, the population is
            heavily concentrated in specific urban zones, leaving the vast
            majority of the interior territory empty.
          </CardContent>
        </Card>
      </div>

      {/* Table Component */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        <DensityTable countries={countries} />
      </Suspense>

      {/* AdSense Block */}
      <AdSenseBlock slot="density-bottom" format="horizontal" />
    </div>
  )
}
