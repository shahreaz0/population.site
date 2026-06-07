import type { Metadata } from "next"
import Link from "next/link"
import { AdSenseBlock } from "@/components/adsense-block"
import { SEOLinksGrid } from "@/components/seo-links-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getAllCountries,
  getContinentStats,
  getWorldStats,
} from "@/lib/data/countries"
import { WorldChart } from "./_components/world-chart"
import { WorldStatsCards } from "./_components/world-stats-cards"

export const revalidate = 86400 // Revalidate once per day (ISR)

export const metadata: Metadata = {
  title: "World Population 2026 - Live Counter & Statistics",
  description:
    "View the live world population counter, historical demographic charts, continent breakdowns, and core statistics on global population growth.",
}

export default async function WorldPopulationPage() {
  const countries = await getAllCountries()
  const worldStats = await getWorldStats()
  const continentStats = await getContinentStats()

  // Aggregate historical records across all countries
  const historicalMap: Record<number, number> = {}
  for (const c of countries) {
    for (const hist of c.historical) {
      historicalMap[hist.year] =
        (historicalMap[hist.year] || 0) + hist.population
    }
  }

  // Convert map to array sorted by year
  const worldHistoricalData = Object.entries(historicalMap)
    .map(([year, population]) => ({
      year: parseInt(year, 10),
      population,
    }))
    .sort((a, b) => a.year - b.year)

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-8">
      {/* Page Header */}
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          World Population Statistics
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Comprehensive overview of global headcount, growth rate trajectories,
          land area, and density metrics across continents and nations.
        </p>
      </div>

      {/* World Indicators Grid */}
      <WorldStatsCards
        population={worldStats.population2026}
        growthRate={worldStats.growthRate}
        landArea={worldStats.landArea}
        density={worldStats.averageDensity}
      />

      {/* AdSense block */}
      <AdSenseBlock slot="world-top" format="horizontal" />

      {/* Chart Section */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WorldChart data={worldHistoricalData} />
        </div>

        {/* Fact Card */}
        <Card className="h-full border border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="font-bold text-muted-foreground text-sm uppercase tracking-tight">
              Demographic Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-5 pt-0 text-muted-foreground text-xs leading-relaxed">
            <p>
              The global human population represents an unprecedented milestone.
              Over the last century, global growth rates peaked in the late
              1960s at over 2% per year and have since slowed to approximately{" "}
              <strong>0.91%</strong> in 2026.
            </p>
            <p>
              This cooling trajectory is caused by a decline in average global
              fertility rates. However, due to demographic momentum and high
              growth rates in specific regions (particularly Sub-Saharan Africa
              and South Asia), the world population is projected to continue
              expanding, reaching over 8.5 billion by 2030.
            </p>
            <p>
              Currently, Asia remains by far the most populated continent,
              hosting roughly <strong>59%</strong> of all humans, followed by
              Africa with <strong>18%</strong>.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continent breakdown table */}
      <Card className="border border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6">
          <CardTitle className="font-bold text-base text-foreground">
            Population by Continent
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40">
                  <TableHead className="font-semibold text-muted-foreground text-xs">
                    Continent
                  </TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground text-xs">
                    Population
                  </TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground text-xs">
                    World Share
                  </TableHead>
                  <TableHead className="hidden text-right font-semibold text-muted-foreground text-xs sm:table-cell">
                    Land Area
                  </TableHead>
                  <TableHead className="hidden text-right font-semibold text-muted-foreground text-xs sm:table-cell">
                    Density
                  </TableHead>
                  <TableHead className="hidden text-right font-semibold text-muted-foreground text-xs sm:table-cell">
                    Nations
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {continentStats.map((c) => (
                  <TableRow
                    key={c.slug}
                    className="border-border/40 hover:bg-muted/30"
                  >
                    <TableCell className="font-semibold text-xs">
                      <Link
                        href={`/continents/${c.slug}`}
                        className="text-foreground transition-colors hover:text-primary hover:underline"
                      >
                        {c.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-xs">
                      {c.population.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {c.sharePercent.toFixed(2)}%
                    </TableCell>
                    <TableCell className="hidden text-right font-mono text-xs sm:table-cell">
                      {Math.round(c.area).toLocaleString()} km²
                    </TableCell>
                    <TableCell className="hidden text-right font-mono text-xs sm:table-cell">
                      {c.averageDensity.toFixed(1)} / km²
                    </TableCell>
                    <TableCell className="hidden text-right font-mono text-xs sm:table-cell">
                      {c.countriesCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic SEO Directories */}
      <SEOLinksGrid />

      {/* Bottom AdSense slot */}
      <AdSenseBlock slot="world-bottom" format="horizontal" />
    </div>
  )
}
