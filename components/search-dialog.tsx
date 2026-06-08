"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import type { CountryData } from "@/lib/data/countries"

export function SearchDialog({ countries }: { countries: CountryData[] }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    const handleOpenEvent = () => {
      setOpen(true)
    }

    document.addEventListener("keydown", down)
    window.addEventListener("open-global-search", handleOpenEvent)

    return () => {
      document.removeEventListener("keydown", down)
      window.removeEventListener("open-global-search", handleOpenEvent)
    }
  }, [])

  const handleSelect = (slug: string) => {
    setOpen(false)
    router.push(`/countries/${slug}`)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search Countries"
      description="Type a country name or code to view population data."
    >
      <CommandInput placeholder="Type a country name (e.g. Canada)..." />
      <CommandList className="max-h-[300px]">
        <CommandEmpty>No countries found.</CommandEmpty>
        <CommandGroup heading="All Countries & Territories">
          {countries.map((c, index) => (
            <CommandItem
              key={c.slug}
              value={c.name}
              onSelect={() => handleSelect(c.slug)}
              className="flex items-center gap-3 px-4 py-3"
            >
              <span
                className="text-lg leading-none"
                role="img"
                aria-label={`${c.name} flag`}
              >
                {c.flag}
              </span>
              <div className="flex flex-col">
                <span className="font-medium">{c.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {c.continent} • {c.capital}
                </span>
              </div>
              <span className="ml-auto rounded-none bg-muted/50 px-2 py-0.5 font-mono text-muted-foreground text-xs">
                Rank #{index + 1}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

// Trigger helper function to open the search dialog programmatically
export function triggerGlobalSearch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-global-search"))
  }
}
