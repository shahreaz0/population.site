"use client"

import {
  IconChartScatter,
  IconChevronRight,
  IconSearch,
} from "@tabler/icons-react"
import Link from "next/link"
import { useQueryState } from "nuqs"
import * as React from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CountryData } from "@/lib/data/countries"
import { cn } from "@/lib/utils"

interface DensityTableProps {
  countries: CountryData[]
}

export function DensityTable({ countries }: DensityTableProps) {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" })
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 25

  React.useEffect(() => {
    setCurrentPage(1)
  }, [])

  // World average density is ~60 people per sq km
  const WORLD_AVERAGE_DENSITY = 60.1

  // Filter and sort by density descending
  const sortedAndFiltered = React.useMemo(() => {
    const sorted = [...countries].sort((a, b) => {
      const densA = a.population2026 / a.area
      const densB = b.population2026 / b.area
      return densB - densA
    })

    return sorted.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code3.toLowerCase().includes(search.toLowerCase())
    )
  }, [countries, search])

  const paginated = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedAndFiltered.slice(start, start + itemsPerPage)
  }, [sortedAndFiltered, currentPage])

  const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage)

  // Density rating text and progress percentage
  const getDensityComparison = (density: number) => {
    const ratio = density / WORLD_AVERAGE_DENSITY
    if (ratio > 100)
      return {
        label: "Extremely Crowded (100x Avg)",
        color: "bg-red-500",
        pct: 100,
      }
    if (ratio > 10)
      return {
        label: "High Density (>10x Avg)",
        color: "bg-orange-500",
        pct: 80,
      }
    if (ratio > 1)
      return {
        label: "Above Average (>1x Avg)",
        color: "bg-amber-500",
        pct: 55,
      }
    if (ratio > 0.1)
      return {
        label: "Below Average (<1x Avg)",
        color: "bg-emerald-500",
        pct: 30,
      }
    return {
      label: "Sparsely Populated (<0.1x Avg)",
      color: "bg-blue-500",
      pct: 10,
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search Filter bar */}
      <Card className="border border-border/40 bg-card/50 p-4 backdrop-blur-sm">
        <div className="relative w-full md:max-w-md">
          <Input
            type="text"
            placeholder="Search by country name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 border-input/60 pl-9"
          />
          <IconSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </Card>

      {/* Density Rankings Card */}
      <Card className="border border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-border/40 border-b p-5">
          <CardTitle className="flex items-center gap-2 font-bold text-muted-foreground text-sm uppercase tracking-tight">
            <IconChartScatter className="h-4 w-4 text-emerald-500" />
            Global Population Density Index ({sortedAndFiltered.length}{" "}
            countries)
          </CardTitle>
          <span className="text-[10px] text-muted-foreground">
            Global Average:{" "}
            <strong className="text-foreground">60.1 / km²</strong>
          </span>
        </CardHeader>
        <CardContent className="p-0">
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
                  <TableHead className="hidden text-right font-semibold text-xs sm:table-cell">
                    Land Area
                  </TableHead>
                  <TableHead className="text-right font-semibold text-xs">
                    Density
                  </TableHead>
                  <TableHead className="hidden pl-6 font-semibold text-xs md:table-cell">
                    Density Rating vs. Global Avg
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((c) => {
                  const density = c.population2026 / c.area
                  const comparison = getDensityComparison(density)

                  // Absolute rank is the index in the full sorted array
                  const globalRank =
                    countries.findIndex((orig) => orig.slug === c.slug) + 1

                  return (
                    <TableRow
                      key={c.slug}
                      className="group border-border/40 hover:bg-muted/30"
                    >
                      <TableCell className="text-center font-bold font-mono text-muted-foreground/80 text-xs">
                        {globalRank}
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
                      <TableCell className="text-right font-mono text-muted-foreground text-xs">
                        {c.population2026.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden text-right font-mono text-muted-foreground text-xs sm:table-cell">
                        {c.area.toLocaleString()} km²
                      </TableCell>
                      <TableCell className="text-right font-bold font-mono text-foreground text-xs">
                        {Math.round(density).toLocaleString()} / km²
                      </TableCell>
                      <TableCell className="hidden w-64 pl-6 text-xs md:table-cell">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-foreground/80">
                              {comparison.label}
                            </span>
                            <span className="font-mono text-muted-foreground">
                              {(density / WORLD_AVERAGE_DENSITY).toFixed(1)}x
                            </span>
                          </div>
                          <Progress
                            value={comparison.pct}
                            className="h-1.5 w-full border-none bg-muted"
                            indicatorClassName={comparison.color}
                          />
                        </div>
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

                {sortedAndFiltered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-muted-foreground text-sm"
                    >
                      No country matches the search query.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-border/40 border-t p-4 text-xs">
              <span className="font-sans text-muted-foreground">
                Showing page{" "}
                <strong className="text-foreground">{currentPage}</strong> of{" "}
                <strong className="text-foreground">{totalPages}</strong>
              </span>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
