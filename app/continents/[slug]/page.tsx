import {
  IconChartScatter,
  IconChevronRight,
  IconMaximize,
  IconMedal,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AdSenseBlock } from "@/components/adsense-block"
import { buttonVariants } from "@/components/ui/button"
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
  getSlug,
} from "@/lib/data/countries"
import { cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400 // Revalidate once per day (ISR)

// Generate static routes at build time
export async function generateStaticParams() {
  const stats = await getContinentStats()
  return stats.map((s) => ({
    slug: s.slug,
  }))
}

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const stats = await getContinentStats(slug)
  if (!stats || stats.length === 0) return { title: "Continent Not Found" }
  const continentName = stats[0].name

  return {
    title: `${continentName} Population 2026 - Country Statistics & Rankings`,
    description: `Explore ${continentName} population statistics. View total headcount, land area density, country rankings, and demographic indicators.`,
  }
}

export default async function ContinentDetailPage({ params }: PageProps) {
  const { slug } = await params
  const allStats = await getContinentStats(slug)

  if (!allStats || allStats.length === 0) {
    notFound()
  }

  const stats = allStats[0]
  const countries = await getAllCountries()

  // Filter countries in this continent and sort by population descending
  const continentCountries = countries
    .filter((c) => getSlug(c.continent) === slug)
    .sort((a, b) => b.population2026 - a.population2026)

  if (continentCountries.length === 0) {
    notFound()
  }

  // Highlights
  const mostPopulated = continentCountries[0]

  const densest = [...continentCountries].sort(
    (a, b) => b.population2026 / b.area - a.population2026 / a.area
  )[0]

  const fastestGrowing = [...continentCountries].sort(
    (a, b) => b.growthRate - a.growthRate
  )[0]

  const statItems = [
    {
      title: "Total Population",
      value: stats.population.toLocaleString(),
      description: `${stats.sharePercent.toFixed(1)}% of world population`,
      icon: IconUsers,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Land Area",
      value: `${Math.round(stats.area).toLocaleString()} km²`,
      description: "Total continental surface",
      icon: IconMaximize,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      title: "Average Density",
      value: `${stats.averageDensity.toFixed(1)} / km²`,
      description: "Average people per square km",
      icon: IconChartScatter,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Average Growth Rate",
      value: `${stats.averageGrowthRate > 0 ? "+" : ""}${stats.averageGrowthRate.toFixed(2)}%`,
      description: "Continent growth trajectory",
      icon: IconTrendingUp,
      color: "text-purple-500 bg-purple-500/10",
    },
  ]

  const highlightItems = [
    {
      role: "Most Populated",
      country: mostPopulated,
      value: mostPopulated.population2026.toLocaleString(),
      label: "inhabitants",
    },
    {
      role: "Highest Density",
      country: densest,
      value: `${Math.round(densest.population2026 / densest.area).toLocaleString()} / km²`,
      label: "density",
    },
    {
      role: "Fastest Growing",
      country: fastestGrowing,
      value: `${fastestGrowing.growthRate > 0 ? "+" : ""}${fastestGrowing.growthRate.toFixed(2)}%`,
      label: "growth p.a.",
    },
  ]

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      {/* Page Header */}
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          {stats.name} Population Stats
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Demographic profiles, indicators, and rankings for all{" "}
          {continentCountries.length} countries and territories in {stats.name}.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.title}
              className="border border-border/40 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
                <CardTitle className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
                  {item.title}
                </CardTitle>
                <div className={`rounded-none p-2 ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 p-5 pt-0">
                <span className="font-extrabold font-mono text-foreground text-xl sm:text-2xl">
                  {item.value}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {item.description}
                </span>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AdSense Block */}
      <AdSenseBlock slot="continent-detail-top" format="horizontal" />

      {/* Highlights Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {highlightItems.map((hl) => (
          <Card
            key={hl.role}
            className="flex flex-col gap-3 border border-border/40 bg-card/50 p-5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconMedal className="h-4 w-4 text-primary" />
              <span className="font-bold text-[10px] uppercase tracking-wider">
                {hl.role}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{hl.country.flag}</span>
              <div className="flex flex-col">
                <Link
                  href={`/countries/${hl.country.slug}`}
                  className="font-bold text-foreground text-sm transition-colors hover:text-primary hover:underline"
                >
                  {hl.country.name}
                </Link>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {hl.value} {hl.label}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Countries list Table */}
      <Card className="border border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-6">
          <CardTitle className="font-bold text-base text-foreground">
            Countries in {stats.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="w-12 text-center font-semibold text-xs">
                    Rank
                  </TableHead>
                  <TableHead className="font-semibold text-xs">
                    Country
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs">
                    Population
                  </TableHead>
                  <TableHead className="hidden text-right font-semibold text-xs md:table-cell">
                    Share of Continent
                  </TableHead>
                  <TableHead className="hidden text-right font-semibold text-xs sm:table-cell">
                    Land Area
                  </TableHead>
                  <TableHead className="hidden text-right font-semibold text-xs sm:table-cell">
                    Density
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs">
                    Growth Rate
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {continentCountries.map((c, index) => {
                  const share = (
                    (c.population2026 / stats.population) *
                    100
                  ).toFixed(2)
                  const dens = c.population2026 / c.area

                  return (
                    <TableRow
                      key={c.slug}
                      className="group border-border/40 hover:bg-muted/30"
                    >
                      <TableCell className="text-center font-bold font-mono text-muted-foreground/80 text-xs">
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-3.5 font-semibold text-xs">
                        <Link
                          href={`/countries/${c.slug}`}
                          className="flex items-center gap-2 text-foreground transition-colors hover:text-primary hover:underline"
                        >
                          <span className="text-base leading-none" role="img">
                            {c.flag}
                          </span>
                          <span>{c.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-foreground text-xs">
                        {c.population2026.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden text-right font-mono text-muted-foreground text-xs md:table-cell">
                        {share}%
                      </TableCell>
                      <TableCell className="hidden text-right font-mono text-muted-foreground text-xs sm:table-cell">
                        {c.area.toLocaleString()} km²
                      </TableCell>
                      <TableCell className="hidden text-right font-mono text-muted-foreground text-xs sm:table-cell">
                        {Math.round(dens).toLocaleString()} / km²
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-foreground text-xs">
                        {c.growthRate > 0 ? "+" : ""}
                        {c.growthRate.toFixed(2)}%
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Link
                          href={`/countries/${c.slug}`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                          )}
                        >
                          <IconChevronRight className="h-4 w-4" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AdSense Block */}
      <AdSenseBlock slot="continent-detail-bottom" format="horizontal" />
    </div>
  )
}
