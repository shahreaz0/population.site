"use client"

import {
  IconArrowsUpDown,
  IconChevronRight,
  IconGlobe,
  IconMap,
  IconSearch,
} from "@tabler/icons-react"
import Link from "next/link"
import { useQueryState } from "nuqs"
import * as React from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

interface RankingsTableProps {
  countries: CountryData[]
}

export function RankingsTable({ countries }: RankingsTableProps) {
  // nuqs url state bindings
  const [sortBy, setSortBy] = useQueryState("sortBy", {
    defaultValue: "population",
  })
  const [continent, setContinent] = useQueryState("continent", {
    defaultValue: "all",
  })
  const [search, setSearch] = useQueryState("search", { defaultValue: "" })

  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 25

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [])

  const continents = [
    "All",
    "Asia",
    "Africa",
    "Europe",
    "North America",
    "South America",
    "Oceania",
  ]
  const sortCategories = [
    { value: "population", label: "Population" },
    { value: "density", label: "Density" },
    { value: "growth", label: "Growth Rate" },
    { value: "birth", label: "Birth Rate" },
    { value: "death", label: "Death Rate" },
    { value: "age", label: "Median Age" },
    { value: "urban", label: "Urban Ratio" },
  ]

  // Filtering
  const filtered = React.useMemo(() => {
    return countries.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code3.toLowerCase().includes(search.toLowerCase()) ||
        c.capital.toLowerCase().includes(search.toLowerCase())

      const matchesContinent =
        continent === "all" ||
        c.continent.toLowerCase() === continent.toLowerCase().replace("-", " ")

      return matchesSearch && matchesContinent
    })
  }, [countries, search, continent])

  // Sorting
  const sorted = React.useMemo(() => {
    const data = [...filtered]
    data.sort((a, b) => {
      if (sortBy === "population") {
        return b.population2026 - a.population2026
      }
      if (sortBy === "density") {
        const densA = a.population2026 / a.area
        const densB = b.population2026 / b.area
        return densB - densA
      }
      if (sortBy === "growth") {
        return b.growthRate - a.growthRate
      }
      if (sortBy === "birth") {
        return b.birthRate - a.birthRate
      }
      if (sortBy === "death") {
        return b.deathRate - a.deathRate
      }
      if (sortBy === "age") {
        return b.medianAge - a.medianAge
      }
      if (sortBy === "urban") {
        return b.urbanPopulationPercent - a.urbanPopulationPercent
      }
      return 0
    })
    return data
  }, [filtered, sortBy])

  // Pagination slicing
  const paginated = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sorted.slice(start, start + itemsPerPage)
  }, [sorted, currentPage])

  const totalPages = Math.ceil(sorted.length / itemsPerPage)

  const getSortLabel = (key: string) => {
    return (
      sortCategories.find((cat) => cat.value === key)?.label || "Population"
    )
  }

  const getDisplayValue = (c: CountryData) => {
    if (sortBy === "population") return c.population2026.toLocaleString()
    if (sortBy === "density")
      return `${Math.round(c.population2026 / c.area).toLocaleString()} / km²`
    if (sortBy === "growth")
      return `${c.growthRate > 0 ? "+" : ""}${c.growthRate.toFixed(2)}%`
    if (sortBy === "birth") return `${c.birthRate.toFixed(1)} / 1k`
    if (sortBy === "death") return `${c.deathRate.toFixed(1)} / 1k`
    if (sortBy === "age") return `${c.medianAge.toFixed(1)} yrs`
    if (sortBy === "urban") return `${c.urbanPopulationPercent}%`
    return ""
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Card */}
      <Card className="border border-border/40 bg-card/50 p-5 backdrop-blur-sm">
        <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-xs">
            <Input
              type="text"
              placeholder="Search by country or capital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 border-input/60 pl-9"
            />
            <IconSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 font-semibold text-muted-foreground text-xs">
              Continent:
            </div>
            <div className="flex flex-wrap gap-1">
              {continents.map((cont) => {
                const param = cont.toLowerCase().replace(" ", "-")
                return (
                  <Button
                    key={cont}
                    variant={continent === param ? "default" : "outline"}
                    size="sm"
                    onClick={() => setContinent(param)}
                    className="h-8 text-xs"
                  >
                    {cont}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="my-4 h-px bg-border/40" />

        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-1 font-sans font-semibold text-muted-foreground text-xs">
            Sort By:
          </div>
          <div className="flex flex-wrap gap-1">
            {sortCategories.map((cat) => (
              <Button
                key={cat.value}
                variant={sortBy === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(cat.value)}
                className="flex h-8 items-center gap-1 text-xs"
              >
                {cat.label}
                {sortBy === cat.value && (
                  <IconArrowsUpDown className="h-3.5 w-3.5" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results Table Card */}
      <Card className="border border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-border/40 border-b p-5">
          <CardTitle className="flex items-center gap-1.5 font-bold text-muted-foreground text-sm uppercase tracking-tight">
            <IconGlobe className="h-4 w-4 text-primary" />
            Rankings Directory ({sorted.length} countries found)
          </CardTitle>
          <span className="text-[10px] text-muted-foreground">
            Sorting by:{" "}
            <strong className="text-foreground">{getSortLabel(sortBy)}</strong>
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="w-12 text-center font-semibold text-xs">
                  Rank
                </TableHead>
                <TableHead className="font-semibold text-xs">Country</TableHead>
                <TableHead className="font-semibold text-xs">
                  Continent
                </TableHead>
                <TableHead className="text-right font-semibold text-xs">
                  Land Area
                </TableHead>
                <TableHead className="text-right font-semibold text-xs">
                  {getSortLabel(sortBy)}
                </TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((c) => {
                // Find global absolute index from sorted list
                const globalIndex =
                  countries.findIndex((orig) => orig.slug === c.slug) + 1

                return (
                  <TableRow
                    key={c.slug}
                    className="group border-border/40 hover:bg-muted/30"
                  >
                    <TableCell className="text-center font-bold font-mono text-muted-foreground/80 text-xs">
                      {globalIndex}
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
                    <TableCell className="flex items-center gap-1 py-4 text-muted-foreground text-xs">
                      <IconMap className="h-3 w-3 text-muted-foreground/60" />
                      {c.continent}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground text-xs">
                      {c.area.toLocaleString()} km²
                    </TableCell>
                    <TableCell className="text-right font-bold font-mono text-foreground text-xs">
                      {getDisplayValue(c)}
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

              {sorted.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground text-sm"
                  >
                    No country matches the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

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
