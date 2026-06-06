"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CountryChartProps {
  countryName: string
  data: { year: number; population: number }[]
}

export function CountryChart({ countryName, data }: CountryChartProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Format numbers for Y-axis (e.g. 50M, 1.4B)
  const formatYAxis = (tick: number) => {
    if (tick >= 1_000_000_000) return `${(tick / 1_000_000_000).toFixed(1)}B`
    if (tick >= 1_000_000) return `${(tick / 1_000_000).toFixed(0)}M`
    return tick.toLocaleString()
  }

  // Custom Tooltip
  // biome-ignore lint/suspicious/noExplicitAny: Recharts Custom Tooltip props
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-none border border-border bg-card p-3 font-sans text-xs shadow-md">
          <p className="mb-1 font-bold text-foreground">
            Year {payload[0].payload.year}
          </p>
          <p className="font-mono font-semibold text-primary">
            Population: {payload[0].value.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  if (!mounted) {
    return <CountryChartSkeleton countryName={countryName} />
  }

  return (
    <Card className="rounded-none border border-border/40 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
      <CardHeader className="p-4 pt-2">
        <CardTitle className="font-bold text-base text-foreground">
          Historical Population Trajectory
        </CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          Demographic census growth in {countryName} (1960 - 2026).
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 300, height: 200 }}
          >
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPopChart" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted/40"
              />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                className="font-mono font-semibold text-[10px] text-muted-foreground/80"
              />
              <YAxis
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                className="font-mono font-semibold text-[10px] text-muted-foreground/80"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="population"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPopChart)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function CountryChartSkeleton({
  countryName,
}: {
  countryName?: string
}) {
  return (
    <Card className="rounded-none border border-border/40 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
      <CardHeader className="p-4 pt-2">
        <CardTitle className="font-bold text-base text-foreground">
          Historical Population Trajectory
        </CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          Demographic census growth in {countryName || "Loading..."} (1960 -
          2026).
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="h-72 w-full">
          <div className="relative flex h-full w-full flex-col justify-between p-2">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6">
              <div className="w-full border-muted/10 border-t" />
              <div className="w-full border-muted/10 border-t" />
              <div className="w-full border-muted/10 border-t" />
              <div className="w-full border-muted/10 border-t" />
              <div className="w-full border-muted/10 border-t" />
            </div>

            {/* SVG Area Wave Simulation */}
            <div className="absolute inset-0 flex items-end px-4 py-6">
              <svg
                className="h-full w-full text-muted/15"
                fill="currentColor"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-label="Loading chart"
              >
                <title>Loading chart</title>
                <path
                  d="M0,80 Q25,60 50,45 T100,10 L100,100 L0,100 Z"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* X/Y Axis Placeholder Text */}
            <div className="z-10 flex h-full w-full items-end justify-between font-mono text-[9px] text-muted-foreground/30">
              <span>1960</span>
              <span>1980</span>
              <span>2000</span>
              <span>2020</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
