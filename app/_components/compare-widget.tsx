"use client"

import { IconArrowRight, IconGitCompare } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

interface CompareWidgetProps {
  countries: { name: string; slug: string; flag: string }[]
}

export function CompareWidget({ countries }: CompareWidgetProps) {
  const router = useRouter()
  const [countryA, setCountryA] = React.useState("india")
  const [countryB, setCountryB] = React.useState("united-states")

  const handleCompare = () => {
    if (countryA && countryB) {
      router.push(`/compare?countryA=${countryA}&countryB=${countryB}`)
    }
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <Card className="rounded-none border border-border/40 bg-radial from-primary/2 via-card to-card p-6 shadow-sm md:p-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-none border border-primary/20 bg-primary/10 text-primary">
              <IconGitCompare className="h-5 w-5" />
            </div>
            <h2 className="mt-2 font-bold text-foreground text-xl tracking-tight">
              Country Comparison Tool
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Analyze demographic trajectories side-by-side. Compare historical
              growth rates, densities, birth statistics, and urban ratios
              between any two countries.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row lg:col-span-2">
            {/* Country A Selection */}
            <div className="flex w-full flex-col gap-1.5">
              <label
                htmlFor="compare-select-a"
                className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
              >
                First Country
              </label>
              <Combobox<CompareWidgetProps["countries"][number]>
                items={countries}
                itemToStringLabel={(country) =>
                  country ? `${country.name} ${country.flag}` : ""
                }
                itemToStringValue={(country) => country?.slug ?? ""}
                isItemEqualToValue={(item, val) => item?.slug === val?.slug}
                value={countries.find((c) => c.slug === countryA) || null}
                onValueChange={(val) => setCountryA(val?.slug ?? "")}
              >
                <ComboboxInput
                  id="compare-select-a"
                  placeholder="Search first country..."
                  className="h-11 w-full bg-background font-bold font-mono text-sm"
                />
                <ComboboxContent
                  align="start"
                  className="max-h-60 overflow-y-auto rounded-none border border-border bg-popover text-popover-foreground"
                >
                  <ComboboxEmpty>No countries found.</ComboboxEmpty>
                  <ComboboxList>
                    {(c) => (
                      <ComboboxItem
                        key={`a-${c.slug}`}
                        value={c}
                        className="rounded-none"
                      >
                        <span className="mr-2 text-base leading-none">
                          {c.flag}
                        </span>
                        <span>{c.name}</span>
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="select-none py-2 font-semibold text-muted-foreground/60 text-sm sm:py-0">
              VS
            </div>

            {/* Country B Selection */}
            <div className="flex w-full flex-col gap-1.5">
              <label
                htmlFor="compare-select-b"
                className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
              >
                Second Country
              </label>
              <Combobox<CompareWidgetProps["countries"][number]>
                items={countries}
                itemToStringLabel={(country) =>
                  country ? `${country.name} ${country.flag}` : ""
                }
                itemToStringValue={(country) => country?.slug ?? ""}
                isItemEqualToValue={(item, val) => item?.slug === val?.slug}
                value={countries.find((c) => c.slug === countryB) || null}
                onValueChange={(val) => setCountryB(val?.slug ?? "")}
              >
                <ComboboxInput
                  id="compare-select-b"
                  placeholder="Search second country..."
                  className="h-11 w-full bg-background font-bold font-mono text-sm"
                />
                <ComboboxContent
                  align="start"
                  className="max-h-60 overflow-y-auto rounded-none border border-border bg-popover text-popover-foreground"
                >
                  <ComboboxEmpty>No countries found.</ComboboxEmpty>
                  <ComboboxList>
                    {(c) => (
                      <ComboboxItem
                        key={`b-${c.slug}`}
                        value={c}
                        className="rounded-none"
                      >
                        <span className="mr-2 text-base leading-none">
                          {c.flag}
                        </span>
                        <span>{c.name}</span>
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <Button
              onClick={handleCompare}
              className="mt-4 flex h-11 w-full shrink-0 items-center justify-center gap-2 self-stretch rounded-none px-6 font-semibold shadow-sm sm:mt-5 sm:w-auto"
            >
              Compare
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </section>
  )
}
