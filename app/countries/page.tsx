import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { CountriesDirectory } from "./_components/countries-directory"

export const metadata: Metadata = {
  title: "List of Countries by Population 2026 - Global Directory",
  description:
    "Browse the complete list of countries and territories in the world. Filter alphabetically or search by name to view populations, density, and growth stats.",
}

export default async function CountriesDirectoryPage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      {/* Page Header */}
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          World Country Index
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Comprehensive directory of all 240+ countries and territories. Search
          by name or filter alphabetically to access census statistics.
        </p>
      </div>

      {/* AdSense Block */}
      <AdSenseBlock slot="countries-top" format="horizontal" />

      {/* Directory Component */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        }
      >
        <CountriesDirectory countries={countries} />
      </Suspense>

      {/* AdSense Block */}
      <AdSenseBlock slot="countries-bottom" format="horizontal" />
    </div>
  )
}
