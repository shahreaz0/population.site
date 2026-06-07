"use client"

import { IconChevronRight, IconSearch } from "@tabler/icons-react"
import Link from "next/link"
import { parseAsString, useQueryStates } from "nuqs"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { CountryData } from "@/lib/data/countries"
import { cn } from "@/lib/utils"

interface CountriesDirectoryProps {
  countries: CountryData[]
}

export function CountriesDirectory({ countries }: CountriesDirectoryProps) {
  const directorySearchParams = React.useMemo(
    () => ({
      search: parseAsString.withDefault(""),
      letter: parseAsString.withDefault("all"),
    }),
    []
  )

  const [isPending, startTransition] = React.useTransition()

  const [params, setParams] = useQueryStates(directorySearchParams, {
    startTransition,
    shallow: false,
  })

  const [search, setSearch] = React.useState(params.search)

  // Sync local search input value when URL changes externally
  React.useEffect(() => {
    setSearch(params.search)
  }, [params.search])

  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setParams({ search: value })
    }, 300)
  }

  // Clear timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  // Sort countries alphabetically
  const sortedCountries = React.useMemo(() => {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name))
  }, [countries])

  // Filter countries by search query and selected letter
  const filtered = React.useMemo(() => {
    return sortedCountries.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
      const matchesLetter =
        params.letter === "all" ||
        c.name.toUpperCase().startsWith(params.letter)
      return matchesSearch && matchesLetter
    })
  }, [sortedCountries, search, params.letter])

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Index Card */}
      <Card className="flex flex-col gap-5 border border-border/40 bg-card/50 p-5 backdrop-blur-sm">
        <div className="relative w-full md:max-w-md">
          <Input
            type="text"
            placeholder="Filter countries by name..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 border-input/60 pl-9"
          />
          <IconSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <div className="h-px w-full bg-border/40" />

        {/* Alphabet Index */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant={params.letter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setParams({ letter: "all" })}
            className="h-8 px-3 font-semibold text-xs"
          >
            All
          </Button>
          {alphabet.map((letter) => {
            // Check if any country starts with this letter
            const hasCountries = countries.some((c) =>
              c.name.toUpperCase().startsWith(letter)
            )
            return (
              <Button
                key={letter}
                variant={params.letter === letter ? "default" : "outline"}
                size="sm"
                disabled={!hasCountries}
                onClick={() => setParams({ letter: letter })}
                className="h-8 w-8 p-0 font-semibold text-xs"
              >
                {letter}
              </Button>
            )
          })}
        </div>
      </Card>

      {/* Directory Grid */}
      <Card
        className={cn(
          "border border-border/40 bg-card/50 backdrop-blur-sm transition-opacity duration-300",
          isPending && "opacity-75"
        )}
      >
        <CardHeader className="border-border/40 border-b p-5">
          <CardTitle className="flex items-center gap-2 font-bold text-muted-foreground text-sm uppercase tracking-tight">
            A - Z Directory Listing ({filtered.length} countries)
            {isPending && (
              <span className="ml-2 h-3.5 w-3.5 animate-spin rounded-full border border-primary border-t-transparent" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((c) => (
              <Link
                key={c.slug}
                href={`/countries/${c.slug}`}
                className="group flex items-center justify-between rounded-none border border-border/40 bg-background/50 p-3.5 transition-all hover:translate-y-[-1px] hover:border-primary/40 hover:bg-muted/20"
              >
                <div className="flex items-center gap-3 truncate">
                  <span
                    className="shrink-0 select-none text-2xl leading-none"
                    role="img"
                  >
                    {c.flag}
                  </span>
                  <div className="flex flex-col truncate">
                    <span className="truncate font-semibold text-foreground text-xs transition-colors group-hover:text-primary">
                      {c.name}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {c.population2026.toLocaleString()} pop
                    </span>
                  </div>
                </div>
                <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground text-sm">
                No countries match your search filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
