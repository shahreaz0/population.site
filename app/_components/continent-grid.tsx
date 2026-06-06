import { IconMap } from "@tabler/icons-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getContinentStats } from "@/lib/data/countries"

export async function ContinentGrid() {
  const continents = await getContinentStats()

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center md:text-left">
        <h2 className="font-bold text-2xl text-foreground tracking-tight">
          Population by Continent
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Explore total population statistics and regional shares across major
          geographic zones.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {continents.map((c) => (
          <Link
            key={c.slug}
            href={`/continents/${c.slug}`}
            className="group block"
          >
            <Card className="h-full border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:shadow-sm group-hover:translate-y-[-1px]">
              <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2 text-muted-foreground transition-colors group-hover:text-primary">
                <IconMap className="h-4 w-4 shrink-0" />
                <CardTitle className="truncate font-bold text-xs tracking-tight">
                  {c.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 p-4 pt-1">
                <span className="font-bold font-mono text-base text-foreground">
                  {c.population >= 1_000_000_000
                    ? `${(c.population / 1_000_000_000).toFixed(2)}B`
                    : `${Math.round(c.population / 1_000_000)}M`}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {c.sharePercent.toFixed(1)}% of world • {c.countriesCount}{" "}
                  nations
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
