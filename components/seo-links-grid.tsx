import {
  IconBabyCarriage,
  IconBuildingCommunity,
  IconChartScatter,
  IconGlobe,
  IconHistory,
  IconHourglassLow,
  IconListNumbers,
  IconMap,
  IconRipple,
  IconScale,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SEOLinksGrid() {
  const seoLinks = [
    {
      title: "Countries by Population",
      description: "Complete list of countries ranked by total headcount.",
      href: "/countries-by-population",
      icon: IconListNumbers,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Population Density Rankings",
      description: "Global land-to-population density leaderboards.",
      href: "/population-density-by-country",
      icon: IconChartScatter,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Fastest Growing Countries",
      description: "Nations expanding their populations the fastest.",
      href: "/fastest-growing-countries",
      icon: IconTrendingUp,
      color: "text-indigo-500 bg-indigo-500/10",
    },
    {
      title: "Countries Losing Population",
      description: "Societies facing population shrinkage and contraction.",
      href: "/countries-losing-population",
      icon: IconTrendingDown,
      color: "text-rose-500 bg-rose-500/10",
    },
    {
      title: "Population by Continent",
      description: "Demographic shares and growth rates across continents.",
      href: "/population-by-continent",
      icon: IconMap,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      title: "Largest Cities in the World",
      description: "Population estimates for global megacities.",
      href: "/largest-cities-in-the-world",
      icon: IconBuildingCommunity,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      title: "Birth Rate by Country",
      description: "Annual live births per 1,000 residents globally.",
      href: "/birth-rate-by-country",
      icon: IconBabyCarriage,
      color: "text-sky-500 bg-sky-500/10",
    },
    {
      title: "Death Rate by Country",
      description: "Annual mortality rates per 1,000 residents globally.",
      href: "/death-rate-by-country",
      icon: IconHourglassLow,
      color: "text-slate-500 bg-slate-500/10",
    },
    {
      title: "Urban Population Ratios",
      description: "Percentage of residents residing in metropolitan hubs.",
      href: "/urban-population-by-country",
      icon: IconRipple,
      color: "text-teal-500 bg-teal-500/10",
    },
    {
      title: "Rural Population Ratios",
      description: "Percentage of residents residing in rural zones.",
      href: "/rural-population-by-country",
      icon: IconHistory,
      color: "text-lime-500 bg-lime-500/10",
    },
    {
      title: "Median Age by Country",
      description: "The age profile and youth distribution globally.",
      href: "/median-age-by-country",
      icon: IconScale,
      color: "text-pink-500 bg-pink-500/10",
    },
    {
      title: "Population Growth Rate",
      description: "Projections and growth rates for all nations.",
      href: "/population-growth-rate-by-country",
      icon: IconGlobe,
      color: "text-cyan-500 bg-cyan-500/10",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center md:text-left">
        <h2 className="font-bold text-2xl text-foreground tracking-tight">
          Demographic Rankings & Directories
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Access specialized demographic reports and rankings for programmatic
          SEO indexing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {seoLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.href} href={link.href} className="group block">
              <Card className="h-full border border-border/40 bg-card/50 transition-all duration-200 hover:border-primary/40 hover:shadow-sm group-hover:-translate-y-px">
                <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
                  <div className={`shrink-0 rounded-none p-2 ${link.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="font-bold text-foreground text-xs transition-colors group-hover:text-primary">
                    {link.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {link.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
