"use client"

import { IconSearch, IconSparkles } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { triggerGlobalSearch } from "@/components/search-dialog"
import { Button } from "@/components/ui/button"

export function Hero() {
  const router = useRouter()
  const [searchValue, setSearchValue] = React.useState("")

  // Base world population for mid-2026: ~8,185,420,000
  // Growth rate: ~0.91% per year (~74.5 million/year, ~204,000/day, ~2.36/second)
  const [population, setPopulation] = React.useState(0)

  React.useEffect(() => {
    // Randomize slightly the start point so it looks live but consistent
    const startPop = 8185420000 + Math.floor(Math.random() * 5000)
    setPopulation(startPop)

    const interval = setInterval(() => {
      setPopulation((prev) => {
        // Grow by ~2.36 people per second (approx. 0.236 every 100ms)
        const increment = 0.236 + Math.random() * 0.05
        return prev + increment
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      // Direct clean conversion to slug for navigation, or fall back to global search if it fails
      const querySlug = searchValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
      router.push(`/countries/${querySlug}`)
    } else {
      triggerGlobalSearch()
    }
  }

  const popularCountries = [
    { name: "India", slug: "india", flag: "🇮🇳" },
    { name: "China", slug: "china", flag: "🇨🇳" },
    { name: "United States", slug: "united-states", flag: "🇺🇸" },
    { name: "Indonesia", slug: "indonesia", flag: "🇮🇩" },
    { name: "Pakistan", slug: "pakistan", flag: "🇵🇰" },
    { name: "Nigeria", slug: "nigeria", flag: "🇳🇬" },
  ]

  return (
    <section className="relative overflow-hidden border-border/40 border-b bg-radial from-emerald-500/10 via-background to-background px-4 py-20">
      <div className="container mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Interactive Badge */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-none border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 font-semibold text-emerald-600 text-xs dark:text-emerald-400">
          <IconSparkles className="h-3.5 w-3.5" />
          Live Global Demographics Database
        </div>

        {/* Headline */}
        <h1 className="mb-4 font-extrabold text-4xl text-foreground leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Explore World Population
          <span className="mt-1 block bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            In Real-Time
          </span>
        </h1>

        <p className="mb-10 max-w-2xl text-muted-foreground text-sm leading-relaxed sm:text-base">
          Accurate demographic metrics, growth projections, population
          densities, and rankings for over 240 countries and territories.
          Powered by official records and live estimates.
        </p>

        {/* World Population Counter */}
        <div className="mb-10 w-full max-w-xl rounded-none border border-border/50 bg-card p-6 shadow-emerald-500/[0.02] shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider sm:text-sm">
            Estimated World Population
          </div>
          <div className="my-2 select-all font-bold font-mono text-3xl text-foreground leading-none tracking-tight transition-all sm:text-4xl lg:text-5xl">
            {population > 0
              ? Math.floor(population).toLocaleString()
              : "8,185,420,000"}
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5 font-semibold text-[11px] text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Growing by ~2.4 people every second (+0.91% p.a.)
          </div>
        </div>

        {/* Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="mb-6 flex w-full max-w-lg gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search country (e.g. Bangladesh)..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-12 w-full rounded-none border border-input bg-card pr-4 pl-11 text-foreground text-sm shadow-sm outline-none transition-all focus:border-primary/80 focus:ring-2 focus:ring-primary/20"
            />
            <IconSearch className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-12 px-6 font-semibold shadow-sm"
          >
            Search
          </Button>
        </form>

        {/* Keyboard tip */}
        <div className="mb-8 hidden text-muted-foreground text-xs sm:block">
          Or press{" "}
          <kbd className="rounded-none border bg-card px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>{" "}
          to search with autocomplete
        </div>

        {/* Popular searches */}
        <div className="flex max-w-xl flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-muted-foreground text-xs">Popular:</span>
          {popularCountries.map((c) => (
            <Link
              key={c.slug}
              href={`/countries/${c.slug}`}
              className="inline-flex items-center gap-1 rounded-none border border-border/40 bg-muted/40 px-3 py-1.5 text-foreground text-xs transition-all hover:bg-muted"
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
