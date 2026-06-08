import {
  IconChartScatter,
  IconChevronRight,
  IconMap,
  IconMaximize,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react"
import type { Metadata } from "next"
import Link from "next/link"
import { AdSenseBlock } from "@/components/adsense-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getContinentStats } from "@/lib/data/countries"

export const metadata: Metadata = {
  title: "Population by Continent 2026 - Regional Stats",
  description:
    "Analyze population statistics by continent. View total headcount shares, density metrics, average growth rates, and continent breakdowns.",
}

export default async function PopulationByContinentPage() {
  const continents = await getContinentStats()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Population by Continent
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Comprehensive regional breakdown of headcount, density ratios, and
          growth rates across the world's major continents.
        </p>
      </div>

      <AdSenseBlock slot="continent-seo-top" format="horizontal" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {continents.map((c) => {
          const continentColors: Record<string, string> = {
            asia: "border-blue-500/20 hover:border-blue-500/50 bg-blue-500/[0.01]",
            africa:
              "border-emerald-500/20 hover:border-emerald-500/50 bg-emerald-500/[0.01]",
            europe:
              "border-purple-500/20 hover:border-purple-500/50 bg-purple-500/[0.01]",
            "north-america":
              "border-orange-500/20 hover:border-orange-500/50 bg-orange-500/[0.01]",
            "south-america":
              "border-amber-500/20 hover:border-amber-500/50 bg-amber-500/[0.01]",
            oceania:
              "border-pink-500/20 hover:border-pink-500/50 bg-pink-500/[0.01]",
          }

          return (
            <Card
              key={c.slug}
              className={`flex flex-col justify-between border transition-all duration-300 hover:shadow-md ${continentColors[c.slug] || "border-border/40"}`}
            >
              <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                <div className="flex items-center gap-2">
                  <IconMap className="h-5 w-5 text-primary" />
                  <CardTitle className="font-bold text-base text-foreground">
                    {c.name}
                  </CardTitle>
                </div>
                <span className="rounded-none bg-primary/10 px-2 py-0.5 font-bold text-[10px] text-primary uppercase tracking-wider">
                  {c.countriesCount} Countries
                </span>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4 p-6 pt-3">
                <div className="flex flex-col gap-1 border-border/40 border-b pb-2">
                  <span className="flex items-center gap-1 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                    <IconUsers className="h-3.5 w-3.5" /> Total Population
                  </span>
                  <span className="font-bold font-mono text-foreground text-xl">
                    {c.population.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {c.sharePercent.toFixed(2)}% of the world's population
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-muted-foreground text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1">
                      <IconMaximize className="h-3.5 w-3.5" /> Land Area
                    </span>
                    <strong className="font-mono text-foreground">
                      {Math.round(c.area).toLocaleString()} km²
                    </strong>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1">
                      <IconChartScatter className="h-3.5 w-3.5" /> Density
                    </span>
                    <strong className="font-mono text-foreground">
                      {c.averageDensity.toFixed(1)} / km²
                    </strong>
                  </div>
                  <div className="col-span-2 flex flex-col gap-1">
                    <span className="flex items-center gap-1">
                      <IconTrendingUp className="h-3.5 w-3.5" /> Avg growth rate
                    </span>
                    <strong className="font-mono text-foreground">
                      {c.averageGrowthRate > 0 ? "+" : ""}
                      {c.averageGrowthRate.toFixed(2)}%
                    </strong>
                  </div>
                </div>

                <Link
                  href={`/continents/${c.slug}`}
                  className="mt-4 flex h-9 w-full items-center justify-between rounded-none border border-border/60 px-3 font-semibold text-foreground text-xs transition-all hover:bg-muted"
                >
                  View Continent Page
                  <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AdSenseBlock slot="continent-seo-bottom" format="horizontal" />
    </div>
  )
}
