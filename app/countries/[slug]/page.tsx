import {
  IconAward,
  IconBuildingBridge,
  IconBuildingCommunity,
  IconChartScatter,
  IconChevronRight,
  IconGitCompare,
  IconMaximize,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AdSenseBlock } from "@/components/adsense-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  generateAISummary,
  getAllCountries,
  getCountryBySlug,
} from "@/lib/data/countries"
import { CountryChart } from "./_components/country-chart"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Pre-render all country paths
export async function generateStaticParams() {
  const countries = await getAllCountries()
  return countries.map((c) => ({
    slug: c.slug,
  }))
}

// Generate meta dynamically
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const country = await getCountryBySlug(slug)
  if (!country) return { title: "Country Not Found" }

  return {
    title: `${country.name} Population 2026 - Stats, Density & Growth Rate`,
    description: `View the latest estimated population of ${country.name} in 2026, including world rankings, historical growth trends, land area density, birth/death rates, and projections.`,
  }
}

export default async function CountryDetailPage({ params }: PageProps) {
  const { slug } = await params
  const country = await getCountryBySlug(slug)

  if (!country) {
    notFound()
  }

  const allCountries = await getAllCountries()

  // Calculate rankings
  const populationRank =
    allCountries.findIndex((c) => c.slug === country.slug) + 1
  const density = country.population2026 / country.area

  // AI-generated summary
  const summaryHtml = await generateAISummary(country)

  // Related Countries (same continent, excluding current)
  const relatedCountries = allCountries
    .filter((c) => c.continent === country.continent && c.slug !== country.slug)
    .slice(0, 4)

  // Comparison suggestions (curated vs. default suggestions)
  const comparisonSuggestions = allCountries
    .filter((c) => c.slug !== country.slug)
    .slice(0, 3) // Top global countries

  const statsItems = [
    {
      title: "Total Population",
      value: country.population2026.toLocaleString(),
      description: "2026 live estimate",
      icon: IconUsers,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "World Ranking",
      value: `#${populationRank}`,
      description: "Of 240+ countries",
      icon: IconAward,
      color: "text-indigo-500 bg-indigo-500/10",
    },
    {
      title: "Population Density",
      value: `${Math.round(density).toLocaleString()} / km²`,
      description: "Land to population ratio",
      icon: IconChartScatter,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Annual Growth Rate",
      value: `${country.growthRate > 0 ? "+" : ""}${country.growthRate.toFixed(2)}%`,
      description: "Yearly growth percentage",
      icon: IconTrendingUp,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      title: "Land Surface Area",
      value: `${country.area.toLocaleString()} km²`,
      description: "Habitable land boundary",
      icon: IconMaximize,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      title: "Capital City",
      value: country.capital,
      description: "Administrative center",
      icon: IconBuildingCommunity,
      color: "text-pink-500 bg-pink-500/10",
    },
  ]

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      {/* Title Header */}
      <div className="flex items-center gap-4 border-border/40 border-b pb-6">
        <span
          className="select-none text-5xl leading-none sm:text-6xl"
          role="img"
        >
          {country.flag}
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="flex items-center gap-2 font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
            {country.name} Population 2026
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {country.continent} • Capital: <strong>{country.capital}</strong> •
            ISO Code: <strong>{country.code3}</strong>
          </p>
        </div>
      </div>

      {/* AdSense Block */}
      <AdSenseBlock slot="country-top" format="horizontal" />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {statsItems.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.title}
              className="border border-border/40 bg-card/50 p-4 backdrop-blur-sm"
            >
              <div className="mb-2 flex items-start justify-between">
                <span className="max-w-[90%] truncate font-bold text-[9px] text-muted-foreground uppercase tracking-wider">
                  {item.title}
                </span>
                <div className={`rounded-none p-1.5 ${item.color} shrink-0`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="truncate font-bold font-mono text-foreground text-sm sm:text-base">
                  {item.value}
                </span>
                <span className="truncate text-[9px] text-muted-foreground">
                  {item.description}
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Analysis grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Left column: Chart and Brief */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <CountryChart countryName={country.name} data={country.historical} />

          {/* AI Brief Card */}
          <Card className="border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-2 p-0 pb-4 text-primary">
              <IconBuildingBridge className="h-5 w-5" />
              <CardTitle className="font-bold text-sm uppercase tracking-wider">
                Demographic Brief
              </CardTitle>
            </CardHeader>
            <div
              className="p-0 text-sm leading-relaxed"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: template-generated demographic brief HTML
              dangerouslySetInnerHTML={{ __html: summaryHtml }}
            />
          </Card>
        </div>

        {/* Right column: Comparison Suggestions & Related Countries */}
        <div className="flex flex-col gap-6">
          {/* Comparison suggestions */}
          <Card className="border border-border/40 bg-card/50 p-5 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-2 border-border/40 border-b p-0 pb-4 text-muted-foreground">
              <IconGitCompare className="h-4 w-4 text-primary" />
              <CardTitle className="font-bold text-xs uppercase tracking-wider">
                Comparison Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-0 pt-4">
              {comparisonSuggestions.map((c) => (
                <Link
                  key={c.slug}
                  href={`/compare?countryA=${country.slug}&countryB=${c.slug}`}
                  className="flex items-center justify-between rounded-none border border-border/40 px-3 py-2 font-medium text-xs transition-all hover:bg-muted/50"
                >
                  <span className="flex items-center gap-2">
                    <span>
                      {country.flag} VS {c.flag}
                    </span>
                    <span>
                      {country.name} vs {c.name}
                    </span>
                  </span>
                  <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Related Countries */}
          <Card className="border border-border/40 bg-card/50 p-5 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-2 border-border/40 border-b p-0 pb-4 text-muted-foreground">
              <IconUsers className="h-4 w-4 text-emerald-500" />
              <CardTitle className="font-bold text-xs uppercase tracking-wider">
                Nations in {country.continent}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-0 pt-4">
              {relatedCountries.map((c) => (
                <Link
                  key={c.slug}
                  href={`/countries/${c.slug}`}
                  className="group flex items-center gap-3 rounded-none p-2 transition-colors hover:bg-muted/40"
                >
                  <span className="select-none text-2xl leading-none">
                    {c.flag}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-xs transition-colors group-hover:text-primary">
                      {c.name}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {c.population2026.toLocaleString()} pop •{" "}
                      {Math.round(c.population2026 / c.area)}/km²
                    </span>
                  </div>
                  <IconChevronRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AdSense Block */}
      <AdSenseBlock slot="country-bottom" format="horizontal" />
    </div>
  )
}
