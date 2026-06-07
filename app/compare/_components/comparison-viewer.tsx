"use client"

import { IconChevronRight, IconGitCompare } from "@tabler/icons-react"
import Link from "next/link"
import { parseAsString, useQueryStates } from "nuqs"

import * as React from "react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { ComparisonChart } from "./comparison-chart"

interface ComparisonViewerProps {
  countries: CountryData[]
}

export function ComparisonViewer({ countries }: ComparisonViewerProps) {
  const comparisonSearchParams = React.useMemo(
    () => ({
      countryA: parseAsString.withDefault("india"),
      countryB: parseAsString.withDefault("united-states"),
    }),
    []
  )

  const [isPending, startTransition] = React.useTransition()

  const [params, setParams] = useQueryStates(comparisonSearchParams, {
    startTransition,
    shallow: false,
  })

  const countryA = React.useMemo(() => {
    return (
      countries.find((c) => c.slug === params.countryA) ||
      countries.find((c) => c.slug === "india") ||
      countries[0]
    )
  }, [countries, params.countryA])

  const countryB = React.useMemo(() => {
    return (
      countries.find((c) => c.slug === params.countryB) ||
      countries.find((c) => c.slug === "united-states") ||
      countries[1]
    )
  }, [countries, params.countryB])

  // Align historical data points
  const chartData = React.useMemo(() => {
    const years = [1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025, 2026]
    return years.map((year) => {
      const popA =
        countryA.historical.find((h) => h.year === year)?.population || 0
      const popB =
        countryB.historical.find((h) => h.year === year)?.population || 0
      return {
        year,
        [countryA.name]: popA,
        [countryB.name]: popB,
      }
    })
  }, [countryA, countryB])

  const densityA = countryA.population2026 / countryA.area
  const densityB = countryB.population2026 / countryB.area

  // Comparison metrics rows
  const comparisonRows = [
    {
      metric: "Capital",
      valA: countryA.capital,
      valB: countryB.capital,
      winner: null,
    },
    {
      metric: "Continent",
      valA: countryA.continent,
      valB: countryB.continent,
      winner: null,
    },
    {
      metric: "Population (2026)",
      valA: countryA.population2026.toLocaleString(),
      valB: countryB.population2026.toLocaleString(),
      winner: countryA.population2026 > countryB.population2026 ? "A" : "B",
      label: "Larger",
    },
    {
      metric: "Land Area",
      valA: `${countryA.area.toLocaleString()} km²`,
      valB: `${countryB.area.toLocaleString()} km²`,
      winner: countryA.area > countryB.area ? "A" : "B",
      label: "Larger",
    },
    {
      metric: "Population Density",
      valA: `${Math.round(densityA).toLocaleString()} / km²`,
      valB: `${Math.round(densityB).toLocaleString()} / km²`,
      winner: densityA > densityB ? "A" : "B",
      label: "Denser",
    },
    {
      metric: "Growth Rate",
      valA: `${countryA.growthRate > 0 ? "+" : ""}${countryA.growthRate.toFixed(2)}%`,
      valB: `${countryB.growthRate > 0 ? "+" : ""}${countryB.growthRate.toFixed(2)}%`,
      winner: countryA.growthRate > countryB.growthRate ? "A" : "B",
      label: "Faster",
    },
    {
      metric: "Birth Rate (per 1000)",
      valA: countryA.birthRate.toFixed(1),
      valB: countryB.birthRate.toFixed(1),
      winner: countryA.birthRate > countryB.birthRate ? "A" : "B",
      label: "Higher",
    },
    {
      metric: "Death Rate (per 1000)",
      valA: countryA.deathRate.toFixed(1),
      valB: countryB.deathRate.toFixed(1),
      winner: countryA.deathRate > countryB.deathRate ? "A" : "B",
      label: "Higher",
    },
    {
      metric: "Median Age",
      valA: `${countryA.medianAge.toFixed(1)} yrs`,
      valB: `${countryB.medianAge.toFixed(1)} yrs`,
      winner: countryA.medianAge < countryB.medianAge ? "A" : "B", // younger winner in growth, or older in aging
      label: "Younger",
    },
    {
      metric: "Urban Ratio",
      valA: `${countryA.urbanPopulationPercent}%`,
      valB: `${countryB.urbanPopulationPercent}%`,
      winner:
        countryA.urbanPopulationPercent > countryB.urbanPopulationPercent
          ? "A"
          : "B",
      label: "More Urban",
    },
  ]

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Selectors Card */}
      <Card
        className={cn(
          "border border-border/40 bg-card/50 p-5 backdrop-blur-sm transition-opacity duration-300",
          isPending && "opacity-75"
        )}
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex w-full flex-col gap-1.5">
            <label
              htmlFor="compare-viewer-select-a"
              className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
            >
              Country A
            </label>
            <Select
              value={params.countryA}
              onValueChange={(val) => setParams({ countryA: val || "india" })}
            >
              <SelectTrigger
                id="compare-viewer-select-a"
                className="flex h-11 w-full items-center justify-between rounded-none border border-input bg-background text-sm focus:ring-1 focus:ring-primary"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                align="start"
                className="max-h-60 overflow-y-auto border border-border bg-popover text-popover-foreground"
              >
                {countries.map((c) => (
                  <SelectItem key={`optA-${c.slug}`} value={c.slug}>
                    <span className="mr-2 text-base leading-none">
                      {c.flag}
                    </span>
                    <span>{c.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 select-none self-center py-1 font-semibold text-muted-foreground/60 text-sm sm:mt-5 sm:py-0">
            VS
          </div>

          <div className="flex w-full flex-col gap-1.5">
            <label
              htmlFor="compare-viewer-select-b"
              className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
            >
              Country B
            </label>
            <Select
              value={params.countryB}
              onValueChange={(val) =>
                setParams({ countryB: val || "united-states" })
              }
            >
              <SelectTrigger
                id="compare-viewer-select-b"
                className="flex h-11 w-full items-center justify-between rounded-none border border-input bg-background text-sm focus:ring-1 focus:ring-primary"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                align="start"
                className="max-h-60 overflow-y-auto border border-border bg-popover text-popover-foreground"
              >
                {countries.map((c) => (
                  <SelectItem key={`optB-${c.slug}`} value={c.slug}>
                    <span className="mr-2 text-base leading-none">
                      {c.flag}
                    </span>
                    <span>{c.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Side-by-side Cards Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Country A Summary */}
        <Card className="border border-indigo-500/20 bg-indigo-500/1">
          <CardHeader className="flex flex-row items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none">{countryA.flag}</span>
              <div className="flex flex-col">
                <CardTitle className="font-bold text-base text-foreground">
                  {countryA.name}
                </CardTitle>
                <span className="text-[10px] text-muted-foreground">
                  Country A
                </span>
              </div>
            </div>
            <Link
              href={`/countries/${countryA.slug}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8 gap-1 text-xs"
              )}
            >
              View Profile
              <IconChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-5 pt-0 text-muted-foreground text-xs">
            <div className="flex items-center justify-between border-border/40 border-b py-1">
              <span>Capital</span>
              <span className="font-semibold text-foreground">
                {countryA.capital}
              </span>
            </div>
            <div className="flex items-center justify-between border-border/40 border-b py-1">
              <span>Land Area</span>
              <span className="font-mono font-semibold text-foreground">
                {countryA.area.toLocaleString()} km²
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Continent</span>
              <span className="font-semibold text-foreground">
                {countryA.continent}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Country B Summary */}
        <Card className="border border-emerald-500/20 bg-emerald-500/1">
          <CardHeader className="flex flex-row items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none">{countryB.flag}</span>
              <div className="flex flex-col">
                <CardTitle className="font-bold text-base text-foreground">
                  {countryB.name}
                </CardTitle>
                <span className="text-[10px] text-muted-foreground">
                  Country B
                </span>
              </div>
            </div>
            <Link
              href={`/countries/${countryB.slug}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8 gap-1 text-xs"
              )}
            >
              View Profile
              <IconChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-5 pt-0 text-muted-foreground text-xs">
            <div className="flex items-center justify-between border-border/40 border-b py-1">
              <span>Capital</span>
              <span className="font-semibold text-foreground">
                {countryB.capital}
              </span>
            </div>
            <div className="flex items-center justify-between border-border/40 border-b py-1">
              <span>Land Area</span>
              <span className="font-mono font-semibold text-foreground">
                {countryB.area.toLocaleString()} km²
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>Continent</span>
              <span className="font-semibold text-foreground">
                {countryB.continent}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card className="border border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-border/40 border-b p-5">
          <CardTitle className="flex items-center gap-2 font-bold text-muted-foreground text-sm uppercase tracking-tight">
            <IconGitCompare className="h-4 w-4 text-primary" />
            Side-By-Side Comparison Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="font-semibold text-xs">
                  Indicator
                </TableHead>
                <TableHead className="text-center font-semibold text-xs">
                  {countryA.name}
                </TableHead>
                <TableHead className="text-center font-semibold text-xs">
                  {countryB.name}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonRows.map((row) => (
                <TableRow
                  key={row.metric}
                  className="border-border/40 hover:bg-muted/30"
                >
                  <TableCell className="font-semibold text-muted-foreground text-xs">
                    {row.metric}
                  </TableCell>

                  {/* Country A Cell */}
                  <TableCell className="w-[40%] py-3.5 text-center font-medium text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={
                          row.winner === "A"
                            ? "font-bold font-mono text-primary"
                            : "font-mono text-foreground"
                        }
                      >
                        {row.valA}
                      </span>
                      {row.winner === "A" && row.label && (
                        <span className="shrink-0 rounded-none bg-primary/10 px-1.5 py-0.5 font-bold text-[9px] text-primary uppercase tracking-wider">
                          {row.label}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Country B Cell */}
                  <TableCell className="w-[40%] py-3.5 text-center font-medium text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={
                          row.winner === "B"
                            ? "font-bold font-mono text-emerald-500"
                            : "font-mono text-foreground"
                        }
                      >
                        {row.valB}
                      </span>
                      {row.winner === "B" && row.label && (
                        <span className="shrink-0 rounded-none bg-emerald-500/10 px-1.5 py-0.5 font-bold text-[9px] text-emerald-500 uppercase tracking-wider">
                          {row.label}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Trajectory chart */}
      <ComparisonChart
        countryAName={countryA.name}
        countryBName={countryB.name}
        data={chartData}
      />
    </div>
  )
}
