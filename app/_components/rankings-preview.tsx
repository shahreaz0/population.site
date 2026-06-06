import { IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CountryData } from "@/lib/data/countries"
import { getRankings } from "@/lib/data/countries"
import { cn } from "@/lib/utils"

export async function RankingsPreview() {
  const topPopulated = (await getRankings("population")).slice(0, 5)
  const topDensity = (await getRankings("density")).slice(0, 5)
  const topGrowth = (await getRankings("growth")).slice(0, 5)

  const sections = [
    {
      title: "Most Populated Countries",
      data: topPopulated,
      valueLabel: "Population",
      formatValue: (val: number) => {
        if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(2)}B`
        return `${(val / 1_000_000).toFixed(1)}M`
      },
      getValue: (c: CountryData) => c.population2026,
      link: "/rankings?sortBy=population",
      accent: "border-indigo-500/20 bg-indigo-500/[0.01]",
    },
    {
      title: "Highest Density Rankings",
      data: topDensity,
      valueLabel: "Density",
      formatValue: (val: number) => `${Math.round(val).toLocaleString()} / km²`,
      getValue: (c: CountryData) => c.population2026 / c.area,
      link: "/density",
      accent: "border-emerald-500/20 bg-emerald-500/[0.01]",
    },
    {
      title: "Fastest Growing Rankings",
      data: topGrowth,
      valueLabel: "Growth Rate",
      formatValue: (val: number) => `${val > 0 ? "+" : ""}${val.toFixed(2)}%`,
      getValue: (c: CountryData) => c.growthRate,
      link: "/rankings?sortBy=growth",
      accent: "border-amber-500/20 bg-amber-500/[0.01]",
    },
  ]

  return (
    <section className="container mx-auto border-border/40 border-y bg-muted/10 px-4 py-12">
      <div className="mb-8 text-center md:text-left">
        <h2 className="font-bold text-2xl text-foreground tracking-tight">
          Global Rankings Leaderboards
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          A snapshot of the world's most populous nations, densest territories,
          and fastest growing areas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <Card
            key={section.title}
            className={`border border-border/40 transition-colors hover:border-border ${section.accent}`}
          >
            <CardHeader className="p-5">
              <CardTitle className="font-bold text-muted-foreground text-sm uppercase tracking-tight">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-5 pt-0">
              <div className="flex flex-col gap-2">
                {section.data.map((country, idx) => {
                  const val = section.getValue(country)
                  return (
                    <div
                      key={country.slug}
                      className="flex items-center justify-between rounded-none px-3 py-2 text-xs transition-colors hover:bg-muted/40"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-4 font-semibold text-muted-foreground/60">
                          {idx + 1}
                        </span>
                        <span className="text-base leading-none">
                          {country.flag}
                        </span>
                        <Link
                          href={`/countries/${country.slug}`}
                          className="font-medium text-foreground transition-colors hover:text-primary hover:underline"
                        >
                          {country.name}
                        </Link>
                      </div>
                      <span className="font-mono font-semibold text-foreground">
                        {section.formatValue(val)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <Link
                href={section.link}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "mt-2 w-full justify-between rounded-none font-semibold text-xs"
                )}
              >
                View Full Rankings
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
