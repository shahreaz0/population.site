import type { Metadata } from "next"
import { Suspense } from "react"
import { AdSenseBlock } from "@/components/adsense-block"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCountries } from "@/lib/data/countries"
import { ComparisonViewer } from "./_components/comparison-viewer"

export const metadata: Metadata = {
  title: "Compare Countries Population & Demographics",
  description:
    "Compare population growth curves, land densities, areas, capitals, and demographics of any two countries side-by-side.",
}

export default async function ComparePage() {
  const countries = await getAllCountries()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      {/* Page Header */}
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Country Comparison Engine
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Select any two nations or territories to run side-by-side analyses on
          populations, growth rates, densities, urbanizations, and historical
          developments.
        </p>
      </div>

      {/* AdSense Block */}
      <AdSenseBlock slot="compare-top" format="horizontal" />

      {/* Comparison Tool */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        }
      >
        <ComparisonViewer countries={countries} />
      </Suspense>

      {/* AdSense Block */}
      <AdSenseBlock slot="compare-bottom" format="horizontal" />
    </div>
  )
}
