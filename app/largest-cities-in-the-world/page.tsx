import { IconGlobe, IconMap } from "@tabler/icons-react"
import type { Metadata } from "next"
import Link from "next/link"
import { AdSenseBlock } from "@/components/adsense-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getLargestCities } from "@/lib/data/countries"

export const revalidate = 86400 // Revalidate once per day (ISR)

export const metadata: Metadata = {
  title: "Largest Cities in the World 2026 - Population Rankings",
  description:
    "View the list of the largest cities in the world by population. Explore estimated populations, country locations, and global urban statistics.",
}

export default async function LargestCitiesPage() {
  const cities = await getLargestCities()

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 text-center">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight sm:text-4xl">
          Largest Cities in the World
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Leaderboard of the world's most populous metropolitan areas and
          city-states, ordered by estimated 2026 populations.
        </p>
      </div>

      <AdSenseBlock slot="cities-seo-top" format="horizontal" />

      {/* Information Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border border-blue-500/20 bg-blue-500/[0.01]">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="font-bold text-blue-600 text-xs uppercase tracking-wider dark:text-blue-400">
              Urban Agglomeration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-muted-foreground text-xs leading-relaxed">
            Metropolitan population figures often include surrounding commuter
            belts and urban sprawl rather than strict administrative city
            boundaries. For example, Greater Tokyo stands as the world's largest
            urban agglomeration, hosting over 37 million residents across its
            integrated prefectures.
          </CardContent>
        </Card>

        <Card className="border border-amber-500/20 bg-amber-500/[0.01]">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="font-bold text-amber-600 text-xs uppercase tracking-wider dark:text-amber-400">
              The Rise of Megacities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-muted-foreground text-xs leading-relaxed">
            Megacities (cities with populations exceeding 10 million) have
            multiplied rapidly. Developing regions in Asia and Africa represent
            the fastest expanding urban clusters. Cities like Delhi, Dhaka, and
            Kinshasa are experiencing historic growth due to rural-to-urban
            migration and industrial consolidation.
          </CardContent>
        </Card>
      </div>

      {/* Cities Table */}
      <Card className="border border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-border/40 border-b p-5">
          <CardTitle className="flex items-center gap-1.5 font-bold text-muted-foreground text-sm uppercase tracking-tight">
            <IconGlobe className="h-4 w-4 text-primary" />
            Megacity Directory ({cities.length} cities ranked)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="w-12 text-center font-semibold text-xs">
                  Rank
                </TableHead>
                <TableHead className="font-semibold text-xs">
                  City Name
                </TableHead>
                <TableHead className="font-semibold text-xs">Country</TableHead>
                <TableHead className="hidden font-semibold text-xs md:table-cell">
                  Continent
                </TableHead>
                <TableHead className="text-right font-semibold text-xs">
                  Metropolitan Population
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.map((city) => (
                <TableRow
                  key={city.name}
                  className="group border-border/40 hover:bg-muted/30"
                >
                  <TableCell className="text-center font-bold font-mono text-muted-foreground/80 text-xs">
                    {city.rank}
                  </TableCell>
                  <TableCell className="py-3.5 font-semibold text-foreground text-xs">
                    {city.name}
                  </TableCell>
                  <TableCell className="py-3.5 font-semibold text-xs">
                    <Link
                      href={`/countries/${city.countrySlug}`}
                      className="flex items-center gap-2 text-foreground transition-colors hover:text-primary hover:underline"
                    >
                      <span className="text-base leading-none" role="img">
                        {city.flag}
                      </span>
                      <span>{city.country}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden py-4 text-muted-foreground text-xs md:table-cell">
                    <div className="flex items-center gap-1">
                      <IconMap className="h-3 w-3 text-muted-foreground/60" />
                      {city.continent}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold font-mono text-foreground text-xs">
                    {city.population2026.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AdSenseBlock slot="cities-seo-bottom" format="horizontal" />
    </div>
  )
}
